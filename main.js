import termkit from 'terminal-kit'
import db from './postgres/index.js'
import { get_auction } from './mongo/auction.js'
import redis from './redis/index.js'
import kafka from './kafka/index.js'
import { run as runBidProcessor } from './kafka/bidProcessor.js'


const term = termkit.terminal

term.grabInput(true)

let currentScreen = null
let loggedInUser = null
term.on('resize', () => { if (currentScreen) currentScreen() })

// ── Auth screen ───────────────────────────────────────────────────────────────
async function showAuthScreen() {
  currentScreen = showAuthScreen
  term.clear()
  term.moveTo(1, 2).bold('auction-house\n')

  const choice = await term.singleColumnMenu(['Login', 'Register', 'Exit'], {
    cancelable: true,
  }).promise

  if (!choice || choice.canceled || choice.selectedText === 'Exit') {
    term.clear()
    process.exit(0)
  }
  if (choice.selectedText === 'Register') {
    await showRegisterScreen()
  }
  if (choice.selectedText === 'Login') {
    await showLoginScreen()
  }
}

// ── Register screen ───────────────────────────────────────────────────────────
async function showRegisterScreen() {
  currentScreen = showRegisterScreen
  term.clear()
  term.moveTo(1, 2).bold('Register\n').dim('ESC to go back\n')

  term('   Email: ')
  const email = await term.inputField({ cancelable: true }).promise
  if (email === undefined) { await showAuthScreen(); return }

  const emailTaken = await db.users.verify_unique_email(email)
  if (emailTaken) {
    term.red('\nThat email is already registered. Press enter to try again.')
    await term.inputField({ echo: false }).promise
    await showRegisterScreen()
    return
  }

  term('\nUsername: ')
  const username = await term.inputField({ cancelable: true }).promise
  if (username === undefined) { await showAuthScreen(); return }

  term('\nPassword: ')
  const password = await term.inputField({ echoChar: '●', cancelable: true }).promise
  if (password === undefined) { await showAuthScreen(); return }

  term('\n')
  const success = await db.users.write_login(email, username, password)
  if (success) {
    await showAuthScreen()
  } else {
    term.red('\nSomething went wrong. Press any key to try again.')
    await term.inputField({ echo: false }).promise
    await showRegisterScreen()
  }
}

// ── Login screen ──────────────────────────────────────────────────────────────
async function showLoginScreen() {
  currentScreen = showLoginScreen
  term.clear()
  term.moveTo(1, 2).bold('Login\n').dim('ESC to go back\n\n')

  term('Username or email: ')
  const identifier = await term.inputField({ cancelable: true }).promise
  if (identifier === undefined) { await showAuthScreen(); return }

  term('\n         Password: ')
  const password = await term.inputField({ echoChar: '●', cancelable: true }).promise
  if (password === undefined) { await showAuthScreen(); return }

  term('\n')
  await attemptLogin(identifier, password)
}

async function attemptLogin(identifier, password) {
  const valid = await db.users.verify_login(identifier, password)
  if (valid) {
    loggedInUser = identifier
    await showMenu()
  } else {
    term.red('\nIncorrect credentials. Press any key to retry.')
    await term.inputField({ echo: false }).promise
    await showLoginScreen()
  }
}

// ── Menu ──────────────────────────────────────────────────────────────────────
async function showMenu() {
  currentScreen = showMenu
  term.clear()
  term.moveTo(1, 2).bold('Menu\n')

  const choice = await term.singleColumnMenu(['Display Auction', 'Option 2', 'View Auctions', 'Place Bid', 'Log Out'], {
    cancelable: true,
  }).promise

  if (!choice || choice.canceled || choice.selectedText === 'Log Out') {
    await showAuthScreen()
    return
  }
  if (choice.selectedText === 'Display Auction') {
    const auction = await get_auction(1)
    console.log(auction.item)
    console.log(auction.description)
    console.log(auction.start_date)
    console.log(auction.end_date)
    console.log(auction.active)
  }
  if (choice.selectedText === 'Option 2') {
    await showPlaceholder('Option 2')
  }
  if (choice.selectedText === 'View Auctions') {
    await showViewAuctions()
  }
  if (choice.selectedText === 'Place Bid') {
    await showPlaceBid()
  }
}

async function showPlaceholder(name) {
  currentScreen = () => showPlaceholder(name)
  term.clear()
  term.moveTo(1, 2).bold(`${name}\n`).dim('ESC to go back\n\n').dim('coming soon\n')

  await new Promise(resolve => {
    term.once('key', async key => {
      if (key === 'ESCAPE') { await showMenu() }
      resolve()
    })
  })
}

// ── View Auctions screen ──────────────────────────────────────────────────────
async function showViewAuctions() {
  currentScreen = showViewAuctions
  term.clear()
  term.moveTo(1, 2).bold('View Auctions\n').dim('ESC to go back\n\n')

  const auctions = await redis.auction.getActiveAuctions()

  if (!auctions.length) {
    term.dim('No active auctions.\n')
  } else {
    for (const a of auctions) {
      term.bold(`  [${a.id}] `)(a.item_name + '\n')
      term.dim(`       Top Bid: `)(`$${a.top_bid}  `)
      term.dim(`Ends: `)(a.end_date + '\n')
    }
  }

  await new Promise(resolve => {
    term.once('key', async key => {
      if (key === 'ESCAPE') { await showMenu() }
      resolve()
    })
  })
}

// ── Place Bid screen ──────────────────────────────────────────────────────────
async function showPlaceBid() {
  currentScreen = showPlaceBid
  term.clear()
  term.moveTo(1, 2).bold('Place Bid\n').dim('ESC to go back\n\n')

  const auctions = await redis.auction.getActiveAuctions()

  if (!auctions.length) {
    term.dim('No active auctions.\n\n')
  } else {
    term.dim('Active auctions:\n')
    for (const a of auctions) {
      term.bold(`  [${a.id}] `)(a.item_name + ' ')
      term.dim(`— Top Bid: `)(`$${a.top_bid}\n`)
    }
    term('\n')
  }

  term('Auction ID: ')
  const auctionId = await term.inputField({ cancelable: true }).promise
  if (auctionId === undefined) { await showMenu(); return }

  term('\n  Bid amount: ')
  const amountStr = await term.inputField({ cancelable: true }).promise
  if (amountStr === undefined) { await showMenu(); return }

  term('\n')
  const amount = parseFloat(amountStr)
  const result = await kafka.producer.submitBid(auctionId, loggedInUser, amount)

  if (result.valid) {
    term.green('Bid placed successfully!\n')
  } else {
    term.red(`Bid rejected: ${result.reason}\n`)
  }

  term.dim('\nPress any key to go back.')
  await new Promise(resolve => {
    term.once('key', async () => { await showMenu(); resolve() })
  })
}

// ── Entry point ───────────────────────────────────────────────────────────────

runBidProcessor().catch(console.error)
await showAuthScreen()