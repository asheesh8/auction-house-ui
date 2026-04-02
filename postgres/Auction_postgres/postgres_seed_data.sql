-- Example data for proof of concept

-- Account data
INSERT INTO accounts (email, username, password)
VALUES
    ('calvin.dibartolo@mymail.champlain.edu', 'cdibartolo05', 'Password123'),
    ('ashish.subedi@mymail.champlain.edu', 'asheesh8', 'Password456'),
    ('lloyd.ivester@mymail.champlain.edu', 'ScootchCity', 'Password789'),
    ('logan.donaghue@mymail.champlain.edu', 'Loganest2110', 'Password0!?');

-- items data
INSERT INTO items (item_name, description, seller, sold_to)
VALUES
    ('2012 Chevy Silverado', 'Good condition, mostly original parts', (SELECT id FROM accounts WHERE email = 'calvin.dibartolo@mymail.champlain.edu'), (SELECT id FROM accounts WHERE email = 'logan.donaghue@mymail.champlain.edu')),
    ('House of the Dead Original Arcade Machine', NULL, (SELECT id FROM accounts WHERE email = 'ashish.subedi@mymail.champlain.edu'), NULL),
    ('Orange Game Cube', NULL, (SELECT id FROM accounts WHERE email = 'lloyd.ivester@mymail.champlain.edu'), NULL);

INSERT INTO auctions (item_id, status)
VALUES
    ((SELECT id FROM items WHERE item_name = '2012 Chevy Silverado'), 'Finished'),
    ((SELECT id FROM items WHERE item_name = 'House of the Dead Original Arcade Machine'), 'In-Progress'),
    ((SELECT id FROM items WHERE item_name = 'Orange Game Cube'), 'In-Progress');

INSERT INTO bids (auction_id, account_id, amount, top_bid)
VALUES
    ((SELECT id FROM auctions WHERE item_id.item_name = '2012 Chevy Silverado'), (SELECT FROM accounts WHERE email = 'ashish.subedi@mymail.champlain.edu'), 8900.00, TRUE),
