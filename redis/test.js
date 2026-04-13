import { setAuction, getAuction, getTopBid, setTopBid, getActiveAuctions } from './auction.js'

// seed a fake auction
await setAuction({
  id: 999,
  item_name: 'CHEVY',
  description: 'just a test',
  status: 'In-Progress',
  end_date: new Date(),
  top_bid: 0,
  seller: 'asheesh8'
})

console.log('getAuction:', await getAuction(999))
console.log('getTopBid:', await getTopBid(999))
console.log('setTopBid 500:', await setTopBid(999, 500))//should be true
console.log('setTopBid 100:', await setTopBid(999, 100))//should be false (too low)
console.log('getTopBid after:', await getTopBid(999)) // should be 500
console.log('getActiveAuctions:', await getActiveAuctions())

process.exit(0)