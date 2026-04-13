import kafka from './client.js'
// TODO: import isAuctionActive and getCurrentTopBid from redis/auction.js once implemented

const producer = kafka.producer()

// Validates the bid against Redis before pushing to the queue.
// Returns { valid: boolean, reason?: string }
async function validateBid(_auctionId, _amount) {

  //check redis to see if auction exists + is still running
  const auction = await getAuction(auctionId)
  if (!auction || auction.status !== 'In-Progress') {
    return { valid: false, reason: 'Auction is not active' }
  }

  // reject if bid doesn't beat the current top bid in redis
  const topBid = await getTopBid(auctionId)
  if (topBid !== null && amount <= topBid) {
    return { valid: false, reason: `Bid must be higher than current top bid of ${topBid}` }
  }

  return { valid: true }
}
export async function submitBid(auctionId, accountId, amount) {
  const { valid, reason } = await validateBid(auctionId, amount)
  if (!valid) return { valid: false, reason }

  await producer.connect()
  await producer.send({
    topic: 'bids',
    messages: [
      { value: JSON.stringify({ auctionId, accountId, amount }) }
    ]
  })
  await producer.disconnect()

  return { valid: true }
}
