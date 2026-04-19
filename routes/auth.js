import { Router } from 'express'
import { verify_login, verify_unique_email, write_login } from '../postgres/users.js'

const router = Router()

router.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/auctions')
    res.redirect('/login')
})

router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/auctions')
    res.render('login', { error: req.query.error || null })
})

router.post('/login', async (req, res) => {
    const { identifier, password } = req.body

    const user = await verify_login(identifier, password)
    if (!user) return res.redirect('/login?error=Invalid+username+or+password')

    req.session.user = { id: user.id, username: user.username }
    res.redirect('/auctions')
})

router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/auctions')
    res.render('register', { error: req.query.error || null })
})

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body

    const emailTaken = await verify_unique_email(email)
    if (emailTaken) return res.redirect('/register?error=Email+already+in+use')

    await write_login(email, username, password)
    res.redirect('/login')
})

router.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

export default router
