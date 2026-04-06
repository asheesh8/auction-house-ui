import client from './postgres/client.js'

await client.query(`
  INSERT INTO accounts (email, username, password)
  VALUES
    ('calvin.dibartolo@mymail.champlain.edu', 'cdibartolo05', 'Password123'),
    ('ashish.subedi@mymail.champlain.edu', 'asheesh8', 'Password456'),
    ('lloyd.ivester@mymail.champlain.edu', 'ScootchCity', 'Password789'),
    ('logan.donaghue@mymail.champlain.edu', 'Loganest2110', 'Password0!?')
  ON CONFLICT DO NOTHING
`)

console.log('postgres seeded')

process.exit(0)
