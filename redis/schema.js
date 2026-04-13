import pgClient from '../postgres/client.js'
import { setAuction } from './auction.js'

//seed Redis with all currently active auctions from postgres
//run this after the postgres schema + seed: node redis/schema.js
//this will keep Redis in sync

const result = await pgClient.query(`
  SELECT id, seller, item_name, description, status, end_date
  FROM auctions
  WHERE status = 'In-Progress'
`)

//cache each active auction into Redis with a starting top_bid of 0.
for (const row of result.rows) {
  await setAuction({ ...row, top_bid: 0 })
  console.log(`cached auction: ${row.item_name}`)
}

console.log(`redis seed done — ${result.rowCount} auctions cached`)
process.exit(0)