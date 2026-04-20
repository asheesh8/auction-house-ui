import kafka from './client.js'
import { getAuction, getTopBid, setTopBid } from '../redis/auction.js'
import { write_bid, set_top_bid } from '../postgres/bids.js'

//if kafka is null (no KAFKA_BROKER set), skip consumer/admin setup entirely
const consumer = kafka ? kafka.consumer({ groupId: 'bid-processor' }) : null
const admin = kafka ? kafka.admin() : null

// Safety check on the consumer side in case a bad message slips through
async function validateBid(auctionId, amount) {
  const auction = await getAuction(auctionId)
  if (!auction || auction.status !== 'In-Progress') {
    return { valid: false, reason: 'Auction is not active' }
  }

  const topBid = await getTopBid(auctionId)
  if (amount <= topBid) {
    return { valid: false, reason: `Bid of ${amount} does not beat current top bid of ${topBid}` }
  }

  return { valid: true }
}

async function processBid(auctionId, accountId, amount) {
  const { valid, reason } = await validateBid(auctionId, amount)
  if (!valid) {
    console.warn(`[bid-processor] rejected bid: ${reason}`)
    return
  }

  const bidId = await write_bid(auctionId, accountId, amount)
  await set_top_bid(bidId, auctionId)
  await setTopBid(auctionId, amount)
}

export async function run() {
  //if kafka is not configured, warn and skip rather than crashing on startup
  if (!kafka) {
    console.warn('[bid-processor] kafka is not configured — skipping bid processor startup')
    return
  }

  await admin.connect()
  await admin.createTopics({ topics: [{ topic: 'bids', numPartitions: 1 }] })
  await admin.disconnect()

  await consumer.connect()
  await consumer.subscribe({ topic: 'bids', fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { auctionId, accountId, amount } = JSON.parse(message.value.toString())
      await processBid(auctionId, accountId, amount)
    }
  })
}
