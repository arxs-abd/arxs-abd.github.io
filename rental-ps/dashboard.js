/**
 * Dashboard page script for PlayStation Rental Management
 * Includes storage and broadcast functionality
 */

// Storage keys
const StorageKeys = {
  TV_CONSOLES: "ps_rental_tv_consoles",
  CONSOLE_PRICES: "ps_rental_console_prices",
  TRANSACTIONS: "ps_rental_transactions",
}

// Broadcast channels
const BroadcastChannels = {
  TV_CONSOLE_UPDATES: "ps_rental_tv_console_updates",
  PRICE_UPDATES: "ps_rental_price_updates",
  TRANSACTION_UPDATES: "ps_rental_transaction_updates",
}

// Broadcast event types
const BroadcastEvents = {
  TV_CONSOLE_ADDED: "tv_console_added",
  TV_CONSOLE_UPDATED: "tv_console_updated",
  TV_CONSOLE_DELETED: "tv_console_deleted",
  PRICES_UPDATED: "prices_updated",
  TRANSACTION_ADDED: "transaction_added",
}

// Active broadcast channels
const activeChannels = {}

// Storage functions
const Storage = {
  /**
   * Get TV-Console pairs from LocalStorage
   * @returns {Array} Array of TV-Console objects
   */
  getTVConsoles: () => {
    const tvConsoles = localStorage.getItem(StorageKeys.TV_CONSOLES)
    return tvConsoles ? JSON.parse(tvConsoles) : []
  },

  /**
   * Save TV-Console pairs to LocalStorage
   * @param {Array} tvConsoles - Array of TV-Console objects
   */
  saveTVConsoles: (tvConsoles) => {
    localStorage.setItem(StorageKeys.TV_CONSOLES, JSON.stringify(tvConsoles))
  },

  /**
   * Add a new TV-Console pair
   * @param {Object} tvConsole - TV-Console object
   * @returns {Object} The added TV-Console object with ID
   */
  addTVConsole: function (tvConsole) {
    const tvConsoles = this.getTVConsoles()

    // Check if TV name already exists
    const exists = tvConsoles.some((item) => item.tv.toLowerCase() === tvConsole.tv.toLowerCase())
    if (exists) {
      throw new Error(`TV dengan nama "${tvConsole.tv}" sudah ada`)
    }

    // Add unique ID and default values
    const newTVConsole = {
      ...tvConsole,
      id: Date.now().toString(),
      status: "available",
      rentalInfo: {
        startTime: null,
        duration: null,
        endTime: null,
        price: null,
      },
    }

    tvConsoles.push(newTVConsole)
    this.saveTVConsoles(tvConsoles)
    return newTVConsole
  },

  /**
   * Update a TV-Console pair
   * @param {String} id - TV-Console ID
   * @param {Object} updates - Object with properties to update
   * @returns {Object|null} Updated TV-Console object or null if not found
   */
  updateTVConsole: function (id, updates) {
    const tvConsoles = this.getTVConsoles()
    const index = tvConsoles.findIndex((item) => item.id === id)

    if (index === -1) return null

    tvConsoles[index] = { ...tvConsoles[index], ...updates }
    this.saveTVConsoles(tvConsoles)
    return tvConsoles[index]
  },

  /**
   * Delete a TV-Console pair
   * @param {String} id - TV-Console ID
   * @returns {Boolean} True if deleted, false if not found
   */
  deleteTVConsole: function (id) {
    const tvConsoles = this.getTVConsoles()
    const initialLength = tvConsoles.length

    const filtered = tvConsoles.filter((item) => item.id !== id)
    this.saveTVConsoles(filtered)

    return filtered.length < initialLength
  },

  /**
   * Get console prices from LocalStorage
   * @returns {Object} Object with console types as keys and prices as values
   */
  getConsolePrices: () => {
    const prices = localStorage.getItem(StorageKeys.CONSOLE_PRICES)
    return prices
      ? JSON.parse(prices)
      : {
          PS1: 3000,
          PS2: 5000,
          PS3: 7000,
          PS4: 10000,
          PS5: 15000,
        }
  },

  /**
   * Save console prices to LocalStorage
   * @param {Object} prices - Object with console types as keys and prices as values
   */
  saveConsolePrices: (prices) => {
    localStorage.setItem(StorageKeys.CONSOLE_PRICES, JSON.stringify(prices))
  },

  /**
   * Get transactions from LocalStorage
   * @returns {Array} Array of transaction objects
   */
  getTransactions: () => {
    const transactions = localStorage.getItem(StorageKeys.TRANSACTIONS)
    return transactions ? JSON.parse(transactions) : []
  },

  /**
   * Save transactions to LocalStorage
   * @param {Array} transactions - Array of transaction objects
   */
  saveTransactions: (transactions) => {
    localStorage.setItem(StorageKeys.TRANSACTIONS, JSON.stringify(transactions))
  },

  /**
   * Add a new transaction
   * @param {Object} transaction - Transaction object
   * @returns {Object} The added transaction with ID
   */
  addTransaction: function (transaction) {
    const transactions = this.getTransactions()

    // Add unique ID
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }

    transactions.push(newTransaction)
    this.saveTransactions(transactions)
    return newTransaction
  },
}

// Broadcast functions
const Broadcast = {
  /**
   * Initialize a broadcast channel
   * @param {String} channelName - Name of the channel
   * @returns {BroadcastChannel} The broadcast channel
   */
  initChannel: (channelName) => {
    if (!activeChannels[channelName]) {
      try {
        activeChannels[channelName] = new BroadcastChannel(channelName)
      } catch (error) {
        console.error(`Failed to create BroadcastChannel: ${error.message}`)
        // Fallback for browsers that don't support BroadcastChannel
        activeChannels[channelName] = {
          postMessage: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          close: () => {},
        }
      }
    }
    return activeChannels[channelName]
  },

  /**
   * Close a broadcast channel
   * @param {String} channelName - Name of the channel
   */
  closeChannel: (channelName) => {
    if (activeChannels[channelName]) {
      activeChannels[channelName].close()
      delete activeChannels[channelName]
    }
  },

  /**
   * Close all broadcast channels
   */
  closeAllChannels: function () {
    Object.keys(activeChannels).forEach((channelName) => {
      this.closeChannel(channelName)
    })
  },

  /**
   * Send a message on a broadcast channel
   * @param {String} channelName - Name of the channel
   * @param {String} eventType - Type of event
   * @param {*} data - Data to send
   */
  send: function (channelName, eventType, data) {
    const channel = this.initChannel(channelName)
    channel.postMessage({
      type: eventType,
      data: data,
      timestamp: new Date().toISOString(),
    })
  },

  /**
   * Listen for messages on a broadcast channel
   * @param {String} channelName - Name of the channel
   * @param {Function} callback - Callback function to handle messages
   */
  listen: function (channelName, callback) {
    const channel = this.initChannel(channelName)
    channel.addEventListener("message", callback)
  },

  /**
   * Broadcast that a TV-Console was added
   * @param {Object} tvConsole - The added TV-Console
   */
  tvConsoleAdded: function (tvConsole) {
    this.send(BroadcastChannels.TV_CONSOLE_UPDATES, BroadcastEvents.TV_CONSOLE_ADDED, tvConsole)
  },

  /**
   * Broadcast that a TV-Console was deleted
   * @param {String} id - ID of the deleted TV-Console
   */
  tvConsoleDeleted: function (id) {
    this.send(BroadcastChannels.TV_CONSOLE_UPDATES, BroadcastEvents.TV_CONSOLE_DELETED, { id })
  },

  /**
   * Broadcast that prices were updated
   * @param {Object} prices - The updated prices
   */
  pricesUpdated: function (prices) {
    this.send(BroadcastChannels.PRICE_UPDATES, BroadcastEvents.PRICES_UPDATED, prices)
  },

  /**
   * Listen for TV-Console updates
   * @param {Function} callback - Callback function to handle updates
   */
  listenForTVConsoleUpdates: function (callback) {
    this.listen(BroadcastChannels.TV_CONSOLE_UPDATES, callback)
  },

  /**
   * Listen for transaction updates
   * @param {Function} callback - Callback function to handle updates
   */
  listenForTransactionUpdates: function (callback) {
    this.listen(BroadcastChannels.TRANSACTION_UPDATES, callback)
  },
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize tabs
  initTabs()

  // Load TV-Console list
  loadTVConsoleList()

  // Load price settings
  loadPriceSettings()

  // Load transaction history
  loadTransactionHistory()

  // Set up form event listeners
  setupFormListeners()

  // Set up broadcast listeners
  setupBroadcastListeners()
})

/**
 * Initialize tab functionality
 */
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab")

      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Update active tab content
      tabContents.forEach((content) => content.classList.remove("active"))
      document.getElementById(tabId).classList.add("active")
    })
  })
}

/**
 * Load TV-Console list from storage
 */
function loadTVConsoleList() {
  const tvConsoles = Storage.getTVConsoles()
  const tableBody = document.querySelector("#tv-console-table tbody")

  tableBody.innerHTML = ""

  if (tvConsoles.length === 0) {
    const emptyRow = document.createElement("tr")
    emptyRow.innerHTML = `<td colspan="4" style="text-align: center;">Belum ada TV dan Konsol</td>`
    tableBody.appendChild(emptyRow)
    return
  }

  tvConsoles.forEach((item) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${item.tv}</td>
            <td>${item.console}</td>
            <td>
                <span class="status ${item.status === "available" ? "available" : "rented"}">
                    ${item.status === "available" ? "Tersedia" : "Disewa"}
                </span>
            </td>
            <td>
                <button class="btn danger delete-tv-console" data-id="${item.id}">Hapus</button>
            </td>
        `
    tableBody.appendChild(row)
  })

  // Add event listeners to delete buttons
  document.querySelectorAll(".delete-tv-console").forEach((button) => {
    button.addEventListener("click", handleDeleteTVConsole)
  })
}

/**
 * Handle deleting a TV-Console
 */
function handleDeleteTVConsole(event) {
  const id = event.target.getAttribute("data-id")
  const tvConsoles = Storage.getTVConsoles()
  const tvConsole = tvConsoles.find((item) => item.id === id)

  if (tvConsole.status === "rented") {
    alert("Tidak dapat menghapus TV yang sedang disewa")
    return
  }

  if (confirm(`Apakah Anda yakin ingin menghapus ${tvConsole.tv} - ${tvConsole.console}?`)) {
    Storage.deleteTVConsole(id)
    Broadcast.tvConsoleDeleted(id)
    loadTVConsoleList()
  }
}

/**
 * Load price settings from storage
 */
function loadPriceSettings() {
  const prices = Storage.getConsolePrices()

  document.getElementById("ps1-price").value = prices.PS1 || ""
  document.getElementById("ps2-price").value = prices.PS2 || ""
  document.getElementById("ps3-price").value = prices.PS3 || ""
  document.getElementById("ps4-price").value = prices.PS4 || ""
  document.getElementById("ps5-price").value = prices.PS5 || ""
}

/**
 * Load transaction history from storage
 */
function loadTransactionHistory() {
  const transactions = Storage.getTransactions()
  const tableBody = document.querySelector("#transaction-table tbody")

  tableBody.innerHTML = ""

  if (transactions.length === 0) {
    const emptyRow = document.createElement("tr")
    emptyRow.innerHTML = `<td colspan="6" style="text-align: center;">Belum ada transaksi</td>`
    tableBody.appendChild(emptyRow)
    return
  }

  // Sort transactions by end time (newest first)
  transactions.sort((a, b) => new Date(b.endTime) - new Date(a.endTime))

  transactions.forEach((transaction) => {
    const startTime = new Date(transaction.startTime)
    const endTime = new Date(transaction.endTime)

    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${transaction.tv}</td>
            <td>${transaction.console}</td>
            <td>${formatDateTime(startTime)}</td>
            <td>${formatDateTime(endTime)}</td>
            <td>${formatDuration(transaction.duration)}</td>
            <td>Rp ${transaction.totalCost.toLocaleString()}</td>
        `
    tableBody.appendChild(row)
  })
}

/**
 * Set up form event listeners
 */
function setupFormListeners() {
  // Add TV-Console form
  const addTVConsoleForm = document.getElementById("add-tv-console-form")
  addTVConsoleForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const tvName = document.getElementById("tv-name").value.trim()
    const consoleType = document.getElementById("console-type").value

    if (!tvName || !consoleType) {
      alert("Mohon isi semua field")
      return
    }

    try {
      const newTVConsole = Storage.addTVConsole({
        tv: tvName,
        console: consoleType,
      })

      Broadcast.tvConsoleAdded(newTVConsole)
      loadTVConsoleList()
      addTVConsoleForm.reset()
    } catch (error) {
      alert(error.message)
    }
  })

  // Price settings form
  const priceSettingsForm = document.getElementById("price-settings-form")
  priceSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const prices = {
      PS1: Number.parseInt(document.getElementById("ps1-price").value) || 0,
      PS2: Number.parseInt(document.getElementById("ps2-price").value) || 0,
      PS3: Number.parseInt(document.getElementById("ps3-price").value) || 0,
      PS4: Number.parseInt(document.getElementById("ps4-price").value) || 0,
      PS5: Number.parseInt(document.getElementById("ps5-price").value) || 0,
    }

    Storage.saveConsolePrices(prices)
    Broadcast.pricesUpdated(prices)

    alert("Harga berhasil disimpan")
  })
}

/**
 * Set up broadcast listeners
 */
function setupBroadcastListeners() {
  // Listen for TV-Console updates
  Broadcast.listenForTVConsoleUpdates((event) => {
    const { type } = event.data

    if (type === BroadcastEvents.TV_CONSOLE_UPDATED) {
      loadTVConsoleList()
    }
  })

  // Listen for transaction updates
  Broadcast.listenForTransactionUpdates((event) => {
    const { type } = event.data

    if (type === BroadcastEvents.TRANSACTION_ADDED) {
      loadTransactionHistory()
    }
  })
}

/**
 * Format date and time
 * @param {Date} date - Date object
 * @returns {String} Formatted date and time
 */
function formatDateTime(date) {
  return `${date.toLocaleDateString("id-ID")} ${date.toLocaleTimeString("id-ID")}`
}

/**
 * Format duration in minutes to hours and minutes
 * @param {Number} minutes - Duration in minutes
 * @returns {String} Formatted duration
 */
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours} jam ${mins > 0 ? `${mins} menit` : ""}`
  }

  return `${mins} menit`
}

// Clean up broadcast channels when page is unloaded
window.addEventListener("beforeunload", () => {
  Broadcast.closeAllChannels()
})
