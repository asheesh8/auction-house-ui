import kafka from './client.js'
import { getAuction, getTopBid } from '../redis/auction.js'

const producer = kafka.producer()
await producer.connect()

async function validateBid(auctionId, amount) {
  const auction = await getAuction(auctionId)
  if (!auction || auction.status !== 'In-Progress') {
    return { valid: false, reason: 'Auction is not active' }
  }

  const topBid = await getTopBid(auctionId)
  if (amount <= topBid) {
    return { valid: false, reason: `Bid must be higher than current top bid of $${topBid.toFixed(2)}` }
  }

  return { valid: true }
}

export async function submitBid(auctionId, accountId, amount) {
  const { valid, reason } = await validateBid(auctionId, amount)
  if (!valid) return { valid: false, reason }

  await producer.send({
    topic: 'bids',
    messages: [
      { value: JSON.stringify({ auctionId, accountId, amount }) }
    ]
  })

  return { valid: true }
}
