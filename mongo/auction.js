import { auctionsExport, bidsExport } from "./schema";

async function get_active_auctions() {
    const activeAuctions = (await auctionsExport.find({active: true, }).limit(10)).sort({end_date: 1});
    return activeAuctions;
}