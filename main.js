import termkit from 'terminal-kit'
import db from './postgres/index.js'

const term = termkit.terminal

term.grabInput(true)

let currentScreen = null
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

  const choice = await term.singleColumnMenu(['Option 1', 'Option 2', 'Log Out'], {
    cancelable: true,
  }).promise

  if (!choice || choice.canceled || choice.selectedText === 'Log Out') {
    await showAuthScreen()
    return
  }
  if (choice.selectedText === 'Option 1') {
    await showPlaceholder('Option 1')
  }
  if (choice.selectedText === 'Option 2') {
    await showPlaceholder('Option 2')
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

// ── Entry point ───────────────────────────────────────────────────────────────

await showAuthScreen()
