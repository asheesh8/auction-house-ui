import mongoose from 'mongoose'
import { auctionsExport, bidsExport } from "./schema.js"

export async function seed_database() {
    const test1 = { auction_id: 1, seller_id: 1, item: 'Vacuum', end_date: '2026-04-20', active: true }
    await auctionsExport.findOneAndUpdate(
        {auction_id: test1.auction_id},
        test1,
        {upsert: true, new: true}
    )
    const test2 = { auction_id: 2, seller_id: 2, item: 'Chair', end_date: '2026-04-22', active: true }
    await auctionsExport.findOneAndUpdate(
        {auction_id: test2.auction_id},
        test2,
        {upsert: true, new: true}
    )
    const test3 = { auction_id: 3, seller_id: 3, item: 'Table', end_date: '2026-04-20', active: false }
    await auctionsExport.findOneAndUpdate(
        {auction_id: test3.auction_id},
        test3,
        {upsert: true, new: true}
    )
    const test4 = { auction_id: 4, seller_id: 4, item: 'Lamp', end_date: '2026-04-20', active: true }
    await auctionsExport.findOneAndUpdate(
        {auction_id: test4.auction_id},
        test4,
        {upsert: true, new: true}
    )
    
}