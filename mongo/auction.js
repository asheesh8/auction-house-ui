import { auctionsExport, bidsExport } from "./schema.js"
import { seed_database } from './items.js'

async function get_active_auctions() {
    const activeAuctions = (await auctionsExport.find({active: true }).limit(10)).sort({end_date: 1})
    return activeAuctions
}

export async function get_auction(auctionId) {
    await seed_database()

    const auction = (await auctionsExport.findOne({auction_id: auctionId}))
    return auction;
}