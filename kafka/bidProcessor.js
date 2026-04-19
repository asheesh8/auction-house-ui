import kafka from './client.js'
import { getAuction, getTopBid, setTopBid } from '../redis/auction.js'
import { write_bid } from '../postgres/bids.js'

const consumer = kafka.consumer({ groupId: 'bid-processor' })
const admin = kafka.admin()

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

  await write_bid(auctionId, accountId, amount)
  await setTopBid(auctionId, amount)
}

export async function run() {
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
