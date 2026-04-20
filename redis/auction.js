import client from './client.js'

//all auction data is stored in Redis as Hash under the key: 'auction:{id}'
//fields: item_name, description, status, end_date, top_bid, seller

//cache full auction object into Redis
//called when seeding from postgres OR when new auction is created
async function setAuction(auction) {
  const key = `auction:${auction.id}`

  //write all auction fields as Redis Hash
  await client.hset(key, {
    item_name: auction.item_name,
    description: auction.description ?? '', // default = empty string if null
    status: auction.status,
    end_date: auction.end_date?.toISOString?.() ?? auction.end_date ?? '',
    top_bid: auction.top_bid ?? 0,//default 0 if no bids yet
    seller: auction.seller ?? '',
    top_bidder: auction.top_bidder ?? '',
  })

  //set a 4 day TTL on 'in-progress' auctions to MATCH WITH postgres default end_date interval
  //finished auctions do not expire ... they stay in cache for reference
  if (auction.status === 'In-Progress') {
    await client.expire(key, 60 * 60 * 24 * 4)
  }
}

//fetch all cached fields for one auction by its postgres id
//returns null if the auction isn't in the cache

async function getAuction(id) {
  const data = await client.hgetall(`auction:${id}`)

  //hgetall returns an empty object if key doesn't exist
  if (!data || Object.keys(data).length === 0) return null

  return {
    ...data,
    top_bid: parseFloat(data.top_bid) || 0,//parse top_bid back to a number
  }
}

//get just the current top bid amount for an auction
async function getTopBid(id) {
  const val = await client.hget(`auction:${id}`, 'top_bid')
  return parseFloat(val) || 0
}

//update the top bid only if the new amount beats the current one
//returns true if the bid was accepted, false if it was too low
async function setTopBid(id, amount, username = '') {
  const current = await getTopBid(id)

  //reject bid if it doesn't beat current top
  if (amount <= current) return false

  await client.hset(`auction:${id}`, 'top_bid', amount)
  if (username) await client.hset(`auction:${id}`, 'top_bidder', username)
  return true
}

//return all auctions currently marked as 'In-Progress' from the cache
//scans all auction: * keys and filters by status field
async function getActiveAuctions() {
  const keys = await client.keys('auction:*')
  if (!keys.length) return []

  const results = []
  for (const key of keys) {
    const data = await client.hgetall(key)

    //only include auctions that are still running
    if (data?.status === 'In-Progress') {
      const id = key.split(':')[1]  //extract id from key name
      results.push({ id, ...data, top_bid: parseFloat(data.top_bid) || 0 })
    }
  }
  results.sort((a, b) => parseInt(a.id) - parseInt(b.id))
  return results
}

//remove an auction from the cache when it finishes
//so after auction status changes to finished in postgres
async function deleteAuction(id) {
  await client.del(`auction:${id}`)
}

// store a chat message for an auction as a Redis List under key: 'chat:{auction_id}'
// each entry is a JSON string with username, comment, amount, and timestamp
// keep only the last 50 messages to avoid unbounded growth
async function addChatMessage(auctionId, username, amount, comment) {
  const key = `chat:${auctionId}`
  const entry = JSON.stringify({ username, amount, comment, timestamp: new Date().toISOString() })
  await client.rpush(key, entry)
  await client.ltrim(key, -50, -1) // keep last 50 only
}

// get all chat messages for an auction, oldest first
async function getChatMessages(auctionId) {
  const key = `chat:${auctionId}`
  const entries = await client.lrange(key, 0, -1)
  return entries.map(e => JSON.parse(e))
}

//export all functions so they can be used
export { setAuction, getAuction, getTopBid, setTopBid, getActiveAuctions, deleteAuction, addChatMessage, getChatMessages }