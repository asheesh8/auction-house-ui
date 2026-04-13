// export all redis auction functions so they can be imported as:
// import redis from './redis/index.js'
// redis.auction.getActiveAuctions(), etc.
import * as auction from './auction.js'

export default { auction }