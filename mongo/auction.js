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
    const lastAuction = await auctionsExport.findOne().sort({ auctionId: -1})
    const nextId = lastAuction ? lastAuction.auction_id + 1 : 1

    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + auctionInformation.durationMinutes * 60000)

    const auction = new auctionsExport({
        auction_id: nextId,
        seller_id: nextId, // Change to be users seller id
        item: auctionInformation.item,
        description: auctionInformation.description,
        start_date: startDate,
        end_date: endDate,
        active: true
    })

    return await auction.save()
}