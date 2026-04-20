import { auctionsExport, bidsExport } from "./schema.js"
//import { seed_database } from './items.js'

async function get_active_auctions() {
    const activeAuctions = (await auctionsExport.find({active: true }).sort({end_date: 1}.limit(10)))
    return activeAuctions
}

export async function get_auction(auctionId) {
    const auction = (await auctionsExport.findOne({auction_id: auctionId}))
    return auction;
}

export async function create_auction(auctionInformation) {
    // use an explicit auction_id when provided (e.g. to keep in sync with postgres id)
    // otherwise fall back to auto-incrementing from the highest existing id
    let nextId = auctionInformation.auction_id
    if (!nextId) {
        const lastAuction = await auctionsExport.findOne().sort({ auction_id: -1 })
        nextId = lastAuction ? lastAuction.auction_id + 1 : 1
    }

    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + auctionInformation.durationMinutes * 60000)

    const auction = new auctionsExport({
        auction_id: nextId,
        seller_id: nextId, // Change to be users seller id
        item: auctionInformation.item,
        description: auctionInformation.description,
        start_date: startDate,
        end_date: endDate,
        active: true,
        images: auctionInformation.images ?? []
    })

    return await auction.save()
}