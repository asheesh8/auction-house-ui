import kafka from './client.js'
// TODO: import redis auction methods once implemented

const consumer = kafka.consumer({ groupId: 'bid-processor' })

async function validateBid(_auctionId, _amount) {
  // TODO: re-validate bid against Postgres top bid
  // query current top bid for auctionId, return { valid, reason }
  return { valid: true }
}

async function processBid(auctionId, _accountId, amount) {
  const { valid, reason } = await validateBid(auctionId, amount)
  if (!valid) return { valid: false, reason }

  // TODO: write bid to Postgres (new_bid in postgres/bids.js)
  // TODO: update Redis with new top bid amount for auctionId

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
