import client from "./client.js";
// gets the top bid of an auction
// should this also return the account, or should that be kept anonymous?
async function get_top_bid(auction_item) {
    const result = await client.query("SELECT amount FROM bids b JOIN auctions a ON a.id = b.auction_id WHERE a.item_name = $1 AND b.top_bid = true;", [auction_item]);
    //console.log(result.rows);
    return result;
}

// updates the top bid of an auction
async function set_top_bid(bid_id) {
    const result = await client.query("UPDATE bids SET top_bid = TRUE WHERE id = $1;", [bid_id]);
    return result.rowCount > 0;
}

// place a new bid on an auction.
// if it is higher than the current highest bid, set as the new highest bid
function new_bid(auction_item, amount) {
    // const result = client.query(
    //
    // )
}

//get_top_bid("House of the Dead Original Arcade Machine");
set_top_bid(4);