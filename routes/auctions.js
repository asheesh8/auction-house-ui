import { Router } from 'express'
import multer from 'multer'
import path from 'path'
// TODO: get_active_auctions is not yet exported from mongo/auction.js — see TODO.md
import { get_auction, create_auction as create_auction_mongo } from '../mongo/auction.js'
import { getActiveAuctions, getAuction, setAuction, setTopBid, addChatMessage, getChatMessages } from '../redis/auction.js'
import { submitBid } from '../kafka/producer.js'
import { create_auction_pg } from '../postgres/auctions.js'

const router = Router()

// Middleware: require a logged-in session for all auction routes
function requireAuth(req, res, next) {
    if (!req.session.user) return res.redirect('/login')
    next()
}

// multer: store uploaded auction images in public/uploads, keep only image files, 5MB limit each
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, unique + path.extname(file.originalname))
    }
})
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true)
        else cb(new Error('Only image files are allowed'))
    }
})

// Browse all active auctions — loads from Redis cache (includes item_name, end_date, top_bid)
// TODO: swap to Mongo once get_active_auctions is exported from mongo/auction.js (see TODO.md)
router.get('/auctions', requireAuth, async (req, res) => {
    const auctions = await getActiveAuctions()
    res.render('auctions', { auctions, user: req.session.user })
})

// Create auction form
router.get('/auctions/create', requireAuth, (req, res) => {
    res.render('create_auction', { user: req.session.user, error: req.query.error || null })
})

// Submit new auction — images uploaded via multer, then synced to postgres + mongo + redis
router.post('/auctions/create', requireAuth, upload.array('images', 8), async (req, res) => {
    const { item_name, description, duration_days } = req.body
    const imagePaths = req.files?.map(f => '/uploads/' + f.filename) ?? []
    const durationMinutes = (parseInt(duration_days) || 4) * 24 * 60

    if (!item_name || item_name.trim().length === 0) {
        return res.redirect('/auctions/create?error=Item+name+is+required')
    }

    // write to postgres first to get the canonical auction id
    const pgId = await create_auction_pg(req.session.user.id, item_name.trim(), description?.trim() ?? '')

    // write to mongo with the same id so detail lookups stay in sync
    const mongoAuction = await create_auction_mongo({
        auction_id: pgId,
        item: item_name.trim(),
        description: description?.trim() ?? '',
        durationMinutes,
        images: imagePaths
    })

    // seed into Redis cache so it appears in the active list immediately
    await setAuction({
        id: pgId,
        item_name: item_name.trim(),
        description: description?.trim() ?? '',
        status: 'In-Progress',
        end_date: mongoAuction.end_date,
        top_bid: 0,
        seller: req.session.user.username,
        top_bidder: ''
    })

    res.redirect('/auctions')
})

// Auction detail page
router.get('/auctions/:id', requireAuth, async (req, res) => {
    const auction = await get_auction(parseInt(req.params.id))
    if (!auction) return res.redirect('/auctions')

    const cached = await getAuction(auction.auction_id)
    const top_bid = cached?.top_bid ?? 0
    const top_bidder = cached?.top_bidder ?? ''
    const comments = await getChatMessages(parseInt(req.params.id))
    res.render('auction', { auction: { ...auction.toObject(), top_bidder }, top_bid, comments, user: req.session.user, error: req.query.error || null })
})

// Place a bid
router.post('/bid', requireAuth, async (req, res) => {
    const { auction_id, amount, comment } = req.body
    const parsedAmount = parseFloat(amount)

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.redirect(`/auctions/${auction_id}?error=Invalid+bid+amount`)
    }

    const result = await submitBid(parseInt(auction_id), req.session.user.id, parsedAmount)

    if (!result.valid) {
        return res.redirect(`/auctions/${auction_id}?error=${encodeURIComponent(result.reason)}`)
    }

    await setTopBid(parseInt(auction_id), parsedAmount, req.session.user.username)

    // store the bid comment in Redis chat for this auction
    if (comment && comment.trim().length > 0) {
        await addChatMessage(parseInt(auction_id), req.session.user.username, parsedAmount, comment.trim())
    }

    res.redirect(`/auctions/${auction_id}`)
})

export default router
