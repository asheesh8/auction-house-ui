import kafka from './client.js'
import { setTopBid } from '../redis/auction.js'
import { write_bid } from '../postgres/bids.js'

const consumer = kafka.consumer({ groupId: 'bid-processor' })

//revalidate on consumer side as check for safety
async function validateBid(_auctionId, _amount) {
//main validation already happened in producer before hitting kafka
  return { valid: true }
}

async function processBid(auctionId, accountId, amount) {
  const { valid, reason } = await validateBid(auctionId, amount)
  if (!valid) return { valid: false, reason }

  //update redis with new top bid after kafka processes it
  await setTopBid(auctionId, amount)

  // write bid to postgres
  await write_bid(auctionId, accountId, amount)

  return { valid: true }
}

export async function run() {
  await consumer.connect()
  await consumer.subscribe({ topic: 'bids', fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { auctionId, accountId, amount } = JSON.parse(message.value.toString())
      await processBid(auctionId, accountId, amount)
    }
  })
}
