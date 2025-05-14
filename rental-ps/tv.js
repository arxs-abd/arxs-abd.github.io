/**
 * TV View page script for PlayStation Rental Management
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

// Store active timers
const activeTimers = {}

// Temporary storage for rental confirmation
let pendingRental = null
let pendingAddTime = null

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

  /**
   * Start a rental for a TV-Console
   * @param {String} id - TV-Console ID
   * @param {Number} duration - Duration in minutes
   * @returns {Object|null} Updated TV-Console object or null if not found
   */
  startRental: function (id, duration) {
    const tvConsoles = this.getTVConsoles()
    const index = tvConsoles.findIndex((item) => item.id === id)

    if (index === -1) return null

    const prices = this.getConsolePrices()
    const consoleType = tvConsoles[index].console
    const pricePerHalfHour = prices[consoleType] || 0

    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000)

    tvConsoles[index].status = "rented"
    tvConsoles[index].rentalInfo = {
      startTime: startTime.toISOString(),
      duration: duration,
      endTime: endTime.toISOString(),
      price: pricePerHalfHour * (duration / 30),
    }

    this.saveTVConsoles(tvConsoles)
    return tvConsoles[index]
  },

  /**
   * Add time to an existing rental
   * @param {String} id - TV-Console ID
   * @param {Number} additionalMinutes - Additional minutes to add
   * @returns {Object|null} Updated TV-Console object or null if not found
   */
  addRentalTime: function (id, additionalMinutes) {
    const tvConsoles = this.getTVConsoles()
    const index = tvConsoles.findIndex((item) => item.id === id)

    if (index === -1 || tvConsoles[index].status !== "rented") return null

    const prices = this.getConsolePrices()
    const consoleType = tvConsoles[index].console
    const pricePerHalfHour = prices[consoleType] || 0

    const rentalInfo = tvConsoles[index].rentalInfo
    const currentEndTime = new Date(rentalInfo.endTime)
    const newEndTime = new Date(currentEndTime.getTime() + additionalMinutes * 60 * 1000)

    const newDuration = rentalInfo.duration + additionalMinutes
    const newPrice = pricePerHalfHour * (newDuration / 30)

    tvConsoles[index].rentalInfo = {
      ...rentalInfo,
      duration: newDuration,
      endTime: newEndTime.toISOString(),
      price: newPrice,
    }

    this.saveTVConsoles(tvConsoles)
    return tvConsoles[index]
  },

  /**
   * Complete a rental and create a transaction
   * @param {String} id - TV-Console ID
   * @returns {Object|null} Transaction object or null if not found
   */
  completeRental: function (id) {
    const tvConsoles = this.getTVConsoles()
    const index = tvConsoles.findIndex((item) => item.id === id)

    if (index === -1 || tvConsoles[index].status !== "rented") return null

    const tvConsole = tvConsoles[index]
    const rentalInfo = tvConsole.rentalInfo

    // Create transaction
    const transaction = {
      tvConsoleId: tvConsole.id,
      tv: tvConsole.tv,
      console: tvConsole.console,
      startTime: rentalInfo.startTime,
      endTime: new Date().toISOString(), // Use current time as actual end time
      duration: rentalInfo.duration,
      totalCost: rentalInfo.price,
    }

    // Reset TV-Console status
    tvConsoles[index].status = "available"
    tvConsoles[index].rentalInfo = {
      startTime: null,
      duration: null,
      endTime: null,
      price: null,
    }

    this.saveTVConsoles(tvConsoles)
    return this.addTransaction(transaction)
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
   * Broadcast that a TV-Console was updated
   * @param {Object} tvConsole - The updated TV-Console
   */
  tvConsoleUpdated: function (tvConsole) {
    this.send(BroadcastChannels.TV_CONSOLE_UPDATES, BroadcastEvents.TV_CONSOLE_UPDATED, tvConsole)
  },

  /**
   * Broadcast that a transaction was added
   * @param {Object} transaction - The added transaction
   */
  transactionAdded: function (transaction) {
    this.send(BroadcastChannels.TRANSACTION_UPDATES, BroadcastEvents.TRANSACTION_ADDED, transaction)
  },

  /**
   * Listen for TV-Console updates
   * @param {Function} callback - Callback function to handle updates
   */
  listenForTVConsoleUpdates: function (callback) {
    this.listen(BroadcastChannels.TV_CONSOLE_UPDATES, callback)
  },

  /**
   * Listen for price updates
   * @param {Function} callback - Callback function to handle updates
   */
  listenForPriceUpdates: function (callback) {
    this.listen(BroadcastChannels.PRICE_UPDATES, callback)
  },
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load TV-Console cards
  loadTVConsoleCards()

  // Set up broadcast listeners
  setupBroadcastListeners()

  // Set up modal event listeners
  setupModalListeners()
})

/**
 * Load TV-Console cards from storage
 */
function loadTVConsoleCards() {
  const tvConsoles = Storage.getTVConsoles()
  const rentedTVGrid = document.getElementById("rented-tv-grid")
  const availableTVGrid = document.getElementById("available-tv-grid")

  // Pisahkan TV berdasarkan status
  const rentedTVs = tvConsoles.filter((item) => item.status === "rented")
  const availableTVs = tvConsoles.filter((item) => item.status === "available")

  // Reset grid containers
  rentedTVGrid.innerHTML = ""
  availableTVGrid.innerHTML = ""

  // Tampilkan TV yang sedang disewa
  if (rentedTVs.length === 0) {
    rentedTVGrid.innerHTML = `
      <div class="empty-section-message">
        <h3>Tidak ada TV yang sedang disewa</h3>
      </div>
    `
  } else {
    rentedTVs.forEach((item) => {
      const card = createTVConsoleCard(item)
      rentedTVGrid.appendChild(card)

      // Start timer
      startTimer(item.id)
    })
  }

  // Tampilkan TV yang tersedia
  if (availableTVs.length === 0) {
    availableTVGrid.innerHTML = `
      <div class="empty-section-message">
        <h3>Tidak ada TV yang tersedia</h3>
        <p>Tambahkan TV dan Konsol di halaman Dashboard</p>
      </div>
    `
  } else {
    availableTVs.forEach((item) => {
      const card = createTVConsoleCard(item)
      availableTVGrid.appendChild(card)
    })
  }

  // Jika tidak ada TV sama sekali
  if (tvConsoles.length === 0) {
    availableTVGrid.innerHTML = `
      <div class="empty-section-message">
        <h3>Belum ada TV dan Konsol</h3>
        <p>Tambahkan TV dan Konsol di halaman Dashboard</p>
      </div>
    `
  }
}

/**
 * Create a TV-Console card
 * @param {Object} item - TV-Console object
 * @returns {HTMLElement} Card element
 */
function createTVConsoleCard(item) {
  const card = document.createElement("div")
  card.className = "tv-card"
  card.setAttribute("data-id", item.id)

  const isRented = item.status === "rented"
  const prices = Storage.getConsolePrices()
  const pricePerHalfHour = prices[item.console] || 0

  // Card header
  let cardContent = `
        <h3>
            ${item.tv} - ${item.console}
            <span class="status ${isRented ? "rented" : "available"}">
                ${isRented ? "Disewa" : "Tersedia"}
            </span>
        </h3>
        <div class="details">
            <p>Harga: <strong>Rp ${pricePerHalfHour.toLocaleString()} / 30 menit</strong></p>
        </div>
    `

  // Rental controls
  if (isRented) {
    // Show timer and rental info for rented TV
    const startTime = new Date(item.rentalInfo.startTime)
    const endTime = new Date(item.rentalInfo.endTime)
    const duration = item.rentalInfo.duration
    const price = item.rentalInfo.price

    cardContent += `
            <div class="timer" id="timer-${item.id}">
                <h4>Waktu Tersisa</h4>
                <div class="time" id="time-${item.id}">Menghitung...</div>
                <div class="info">
                    <span>Total Waktu: ${formatDuration(duration)}</span>
                    <span>Biaya: Rp ${price.toLocaleString()}</span>
                </div>
            </div>
            <div class="rental-controls">
                <div class="rental-form">
                    <div class="time-shortcuts">
                        <button class="add-time-shortcut" data-id="${item.id}" data-minutes="30">+30 Menit</button>
                        <button class="add-time-shortcut" data-id="${item.id}" data-minutes="60">+1 Jam</button>
                        <button class="add-time-shortcut" data-id="${item.id}" data-minutes="120">+2 Jam</button>
                    </div>
                    <div class="input-group">
                        <input type="number" id="add-time-${item.id}" min="30" step="30" value="30" placeholder="Menit">
                        <button class="btn warning add-time" data-id="${item.id}">Tambah Waktu</button>
                    </div>
                </div>
                <button class="btn success pay-rental" data-id="${item.id}">Bayar</button>
            </div>
        `
  } else {
    // Show rental form for available TV with shortcuts
    cardContent += `
            <div class="rental-controls">
                <div class="rental-form">
                    <div class="time-shortcuts">
                        <button class="time-shortcut" data-id="${item.id}" data-minutes="60">1 Jam</button>
                        <button class="time-shortcut" data-id="${item.id}" data-minutes="120">2 Jam</button>
                        <button class="time-shortcut" data-id="${item.id}" data-minutes="240">4 Jam</button>
                    </div>
                    <div class="input-group">
                        <input type="number" id="rental-duration-${item.id}" min="30" step="30" value="60" placeholder="Menit">
                        <button class="btn primary start-rental" data-id="${item.id}">Mulai Sewa</button>
                    </div>
                </div>
            </div>
        `
  }

  card.innerHTML = cardContent

  // Add event listeners
  if (isRented) {
    card.querySelector(".add-time").addEventListener("click", handleAddTimeClick)
    card.querySelector(".pay-rental").addEventListener("click", handlePayRental)

    // Add event listeners for add time shortcuts
    card.querySelectorAll(".add-time-shortcut").forEach((button) => {
      button.addEventListener("click", handleAddTimeShortcut)
    })
  } else {
    card.querySelector(".start-rental").addEventListener("click", handleStartRentalClick)

    // Add event listeners for time shortcuts
    card.querySelectorAll(".time-shortcut").forEach((button) => {
      button.addEventListener("click", handleTimeShortcut)
    })
  }

  return card
}

/**
 * Handle time shortcut click
 */
function handleTimeShortcut(event) {
  const id = event.target.getAttribute("data-id")
  const minutes = Number.parseInt(event.target.getAttribute("data-minutes"))

  // Set the input value to the shortcut minutes
  const durationInput = document.getElementById(`rental-duration-${id}`)
  durationInput.value = minutes

  // Show rental confirmation
  showRentalConfirmation(id, minutes)
}

/**
 * Handle add time shortcut click
 */
function handleAddTimeShortcut(event) {
  const id = event.target.getAttribute("data-id")
  const minutes = Number.parseInt(event.target.getAttribute("data-minutes"))

  // Set the input value to the shortcut minutes
  const timeInput = document.getElementById(`add-time-${id}`)
  timeInput.value = minutes

  // Show add time confirmation
  showAddTimeConfirmation(id, minutes)
}

/**
 * Handle start rental button click
 */
function handleStartRentalClick(event) {
  const id = event.target.getAttribute("data-id")
  const durationInput = document.getElementById(`rental-duration-${id}`)
  const duration = Number.parseInt(durationInput.value)

  if (!duration || duration < 30) {
    alert("Durasi minimal 30 menit")
    return
  }

  // Show rental confirmation
  showRentalConfirmation(id, duration)
}

/**
 * Show rental confirmation modal
 */
function showRentalConfirmation(id, duration) {
  const tvConsoles = Storage.getTVConsoles()
  const tvConsole = tvConsoles.find((item) => item.id === id)

  if (!tvConsole) return

  const prices = Storage.getConsolePrices()
  const pricePerHalfHour = prices[tvConsole.console] || 0
  const cost = pricePerHalfHour * (duration / 30)

  // Set confirmation modal content
  document.getElementById("confirm-tv").textContent = tvConsole.tv
  document.getElementById("confirm-console").textContent = tvConsole.console
  document.getElementById("confirm-duration").textContent = formatDuration(duration)
  document.getElementById("confirm-cost").textContent = `Rp ${cost.toLocaleString()}`

  // Store pending rental info
  pendingRental = {
    id,
    duration,
  }

  // Show modal
  const modal = document.getElementById("rental-confirmation-modal")
  modal.classList.add("active")
}

/**
 * Handle add time button click
 */
function handleAddTimeClick(event) {
  const id = event.target.getAttribute("data-id")
  const timeInput = document.getElementById(`add-time-${id}`)
  const additionalMinutes = Number.parseInt(timeInput.value)

  if (!additionalMinutes || additionalMinutes < 30) {
    alert("Waktu tambahan minimal 30 menit")
    return
  }

  // Show add time confirmation
  showAddTimeConfirmation(id, additionalMinutes)
}

/**
 * Show add time confirmation modal
 */
function showAddTimeConfirmation(id, additionalMinutes) {
  const tvConsoles = Storage.getTVConsoles()
  const tvConsole = tvConsoles.find((item) => item.id === id)

  if (!tvConsole || tvConsole.status !== "rented") {
    alert("TV tidak dalam status disewa")
    return
  }

  const prices = Storage.getConsolePrices()
  const pricePerHalfHour = prices[tvConsole.console] || 0
  const additionalCost = pricePerHalfHour * (additionalMinutes / 30)

  const currentDuration = tvConsole.rentalInfo.duration
  const currentCost = tvConsole.rentalInfo.price
  const totalDuration = currentDuration + additionalMinutes
  const totalCost = currentCost + additionalCost

  // Set confirmation modal content
  document.getElementById("add-time-confirm-tv").textContent = tvConsole.tv
  document.getElementById("add-time-confirm-console").textContent = tvConsole.console
  document.getElementById("add-time-confirm-duration").textContent = formatDuration(additionalMinutes)
  document.getElementById("add-time-confirm-cost").textContent = `Rp ${additionalCost.toLocaleString()}`
  document.getElementById("add-time-confirm-total-duration").textContent = formatDuration(totalDuration)
  document.getElementById("add-time-confirm-total-cost").textContent = `Rp ${totalCost.toLocaleString()}`

  // Store pending add time info
  pendingAddTime = {
    id,
    additionalMinutes,
  }

  // Show modal
  const modal = document.getElementById("add-time-confirmation-modal")
  modal.classList.add("active")
}

/**
 * Handle confirming rental
 */
function confirmRental() {
  if (!pendingRental) return

  const { id, duration } = pendingRental

  const updatedTVConsole = Storage.startRental(id, duration)
  if (updatedTVConsole) {
    Broadcast.tvConsoleUpdated(updatedTVConsole)

    // Hapus kartu dari bagian TV yang tersedia
    const oldCard = document.querySelector(`.tv-card[data-id="${id}"]`)
    oldCard.remove()

    // Tambahkan kartu ke bagian TV yang sedang disewa
    const rentedTVGrid = document.getElementById("rented-tv-grid")
    const newCard = createTVConsoleCard(updatedTVConsole)

    // Hapus pesan "Tidak ada TV yang sedang disewa" jika ada
    const emptyRentedMessage = rentedTVGrid.querySelector(".empty-section-message")
    if (emptyRentedMessage) {
      emptyRentedMessage.remove()
    }

    rentedTVGrid.appendChild(newCard)

    // Periksa apakah bagian TV tersedia menjadi kosong
    const availableTVGrid = document.getElementById("available-tv-grid")
    if (!availableTVGrid.querySelector(".tv-card")) {
      availableTVGrid.innerHTML = `
        <div class="empty-section-message">
          <h3>Tidak ada TV yang tersedia</h3>
          <p>Tambahkan TV dan Konsol di halaman Dashboard</p>
        </div>
      `
    }

    // Start the timer
    startTimer(id)
  }

  // Reset pending rental
  pendingRental = null
}

/**
 * Handle confirming add time
 */
function confirmAddTime() {
  if (!pendingAddTime) return

  const { id, additionalMinutes } = pendingAddTime

  const updatedTVConsole = Storage.addRentalTime(id, additionalMinutes)
  if (updatedTVConsole) {
    Broadcast.tvConsoleUpdated(updatedTVConsole)

    // Update the timer display
    updateTimerDisplay(id)

    // Reset the input
    const timeInput = document.getElementById(`add-time-${id}`)
    timeInput.value = 30

    // Show notification
    alert(`Berhasil menambah waktu ${formatDuration(additionalMinutes)}`)
  }

  // Reset pending add time
  pendingAddTime = null
}

/**
 * Handle paying for a rental
 */
function handlePayRental(event) {
  const id = event.target.getAttribute("data-id")
  const tvConsoles = Storage.getTVConsoles()
  const tvConsole = tvConsoles.find((item) => item.id === id)

  if (!tvConsole || tvConsole.status !== "rented") {
    alert("TV tidak dalam status disewa")
    return
  }

  // Show payment modal
  showPaymentModal(tvConsole)
}

/**
 * Show payment confirmation modal
 * @param {Object} tvConsole - TV-Console object
 */
function showPaymentModal(tvConsole) {
  const modal = document.getElementById("payment-modal")
  const startTime = new Date(tvConsole.rentalInfo.startTime)
  const endTime = new Date() // Use current time
  const duration = tvConsole.rentalInfo.duration
  const cost = tvConsole.rentalInfo.price

  // Set modal content
  document.getElementById("modal-tv").textContent = tvConsole.tv
  document.getElementById("modal-console").textContent = tvConsole.console
  document.getElementById("modal-start-time").textContent = formatDateTime(startTime)
  document.getElementById("modal-end-time").textContent = formatDateTime(endTime)
  document.getElementById("modal-duration").textContent = formatDuration(duration)
  document.getElementById("modal-cost").textContent = `Rp ${cost.toLocaleString()}`

  // Store TV-Console ID in confirm button
  document.getElementById("confirm-payment").setAttribute("data-id", tvConsole.id)

  // Show modal
  modal.classList.add("active")
}

/**
 * Complete a rental payment
 * @param {String} id - TV-Console ID
 */
function completeRentalPayment(id) {
  // Stop the timer
  stopTimer(id)

  // Complete the rental in storage
  const transaction = Storage.completeRental(id)
  if (transaction) {
    // Broadcast the transaction
    Broadcast.transactionAdded(transaction)

    // Update the TV card
    const tvConsoles = Storage.getTVConsoles()
    const updatedTVConsole = tvConsoles.find((item) => item.id === id)

    if (updatedTVConsole) {
      Broadcast.tvConsoleUpdated(updatedTVConsole)

      // Hapus kartu dari bagian TV yang sedang disewa
      const oldCard = document.querySelector(`.tv-card[data-id="${id}"]`)
      oldCard.remove()

      // Tambahkan kartu ke bagian TV yang tersedia
      const availableTVGrid = document.getElementById("available-tv-grid")
      const newCard = createTVConsoleCard(updatedTVConsole)

      // Hapus pesan "Tidak ada TV yang tersedia" jika ada
      const emptyAvailableMessage = availableTVGrid.querySelector(".empty-section-message")
      if (emptyAvailableMessage) {
        emptyAvailableMessage.remove()
      }

      availableTVGrid.appendChild(newCard)

      // Periksa apakah bagian TV yang disewa menjadi kosong
      const rentedTVGrid = document.getElementById("rented-tv-grid")
      if (!rentedTVGrid.querySelector(".tv-card")) {
        rentedTVGrid.innerHTML = `
          <div class="empty-section-message">
            <h3>Tidak ada TV yang sedang disewa</h3>
          </div>
        `
      }
    }

    // Show success message
    alert("Pembayaran berhasil")
  }
}

/**
 * Start a timer for a rented TV
 * @param {String} id - TV-Console ID
 */
function startTimer(id) {
  // Clear existing timer if any
  stopTimer(id)

  // Get TV-Console data
  const tvConsoles = Storage.getTVConsoles()
  const tvConsole = tvConsoles.find((item) => item.id === id)

  if (!tvConsole || tvConsole.status !== "rented") return

  const endTime = new Date(tvConsole.rentalInfo.endTime)

  // Update timer display immediately
  updateTimerDisplay(id)

  // Set interval to update timer every second
  activeTimers[id] = setInterval(() => {
    updateTimerDisplay(id)
  }, 1000)
}

/**
 * Stop a timer
 * @param {String} id - TV-Console ID
 */
function stopTimer(id) {
  if (activeTimers[id]) {
    clearInterval(activeTimers[id])
    delete activeTimers[id]
  }
}

/**
 * Update timer display
 * @param {String} id - TV-Console ID
 */
function updateTimerDisplay(id) {
  const timeElement = document.getElementById(`time-${id}`)
  if (!timeElement) return

  // Get TV-Console data
  const tvConsoles = Storage.getTVConsoles()
  const tvConsole = tvConsoles.find((item) => item.id === id)

  if (!tvConsole || tvConsole.status !== "rented") {
    timeElement.textContent = "Tidak Disewa"
    return
  }

  const now = new Date()
  const endTime = new Date(tvConsole.rentalInfo.endTime)
  const timeLeft = endTime - now

  if (timeLeft <= 0) {
    // Time is up
    timeElement.textContent = "WAKTU HABIS"
    timeElement.classList.add("danger")
    stopTimer(id)
    return
  }

  // Format time left
  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  // Update time element
  timeElement.textContent = formattedTime

  // Add warning class if less than 5 minutes left
  if (timeLeft < 5 * 60 * 1000) {
    timeElement.classList.add("danger")
  } else if (timeLeft < 15 * 60 * 1000) {
    timeElement.classList.add("warning")
    timeElement.classList.remove("danger")
  } else {
    timeElement.classList.remove("warning", "danger")
  }

  // Update info section
  const infoElement = timeElement.nextElementSibling
  if (infoElement) {
    const totalTime = formatDuration(tvConsole.rentalInfo.duration)
    const cost = tvConsole.rentalInfo.price

    infoElement.innerHTML = `
            <span>Total Waktu: ${totalTime}</span>
            <span>Biaya: Rp ${cost.toLocaleString()}</span>
        `
  }
}

/**
 * Set up broadcast listeners
 */
function setupBroadcastListeners() {
  // Listen for TV-Console updates
  Broadcast.listenForTVConsoleUpdates((event) => {
    const { type, data } = event.data

    if (type === BroadcastEvents.TV_CONSOLE_ADDED) {
      // Tambahkan TV baru ke bagian yang sesuai
      const tvConsole = data
      const availableTVGrid = document.getElementById("available-tv-grid")

      // Hapus pesan "Tidak ada TV yang tersedia" jika ada
      const emptyAvailableMessage = availableTVGrid.querySelector(".empty-section-message")
      if (emptyAvailableMessage) {
        emptyAvailableMessage.remove()
      }

      const card = createTVConsoleCard(tvConsole)
      availableTVGrid.appendChild(card)
    } else if (type === BroadcastEvents.TV_CONSOLE_DELETED) {
      // Hapus TV dari bagian yang sesuai
      const id = data.id
      const card = document.querySelector(`.tv-card[data-id="${id}"]`)
      if (card) {
        const parentGrid = card.parentNode
        card.remove()

        // Periksa apakah grid menjadi kosong
        if (!parentGrid.querySelector(".tv-card")) {
          if (parentGrid.id === "rented-tv-grid") {
            parentGrid.innerHTML = `
              <div class="empty-section-message">
                <h3>Tidak ada TV yang sedang disewa</h3>
              </div>
            `
          } else {
            parentGrid.innerHTML = `
              <div class="empty-section-message">
                <h3>Tidak ada TV yang tersedia</h3>
                <p>Tambahkan TV dan Konsol di halaman Dashboard</p>
              </div>
            `
          }
        }
      }
    } else if (type === BroadcastEvents.TV_CONSOLE_UPDATED) {
      // Update TV-Console card
      const tvConsole = data
      const oldCard = document.querySelector(`.tv-card[data-id="${tvConsole.id}"]`)

      if (oldCard) {
        const oldStatus = oldCard.querySelector(".status").classList.contains("rented") ? "rented" : "available"

        // Jika status berubah, pindahkan kartu ke bagian yang sesuai
        if (oldStatus !== tvConsole.status) {
          oldCard.remove()

          if (tvConsole.status === "rented") {
            // Pindahkan ke bagian TV yang sedang disewa
            const rentedTVGrid = document.getElementById("rented-tv-grid")
            const newCard = createTVConsoleCard(tvConsole)

            // Hapus pesan "Tidak ada TV yang sedang disewa" jika ada
            const emptyRentedMessage = rentedTVGrid.querySelector(".empty-section-message")
            if (emptyRentedMessage) {
              emptyRentedMessage.remove()
            }

            rentedTVGrid.appendChild(newCard)

            // Periksa apakah bagian TV tersedia menjadi kosong
            const availableTVGrid = document.getElementById("available-tv-grid")
            if (!availableTVGrid.querySelector(".tv-card")) {
              availableTVGrid.innerHTML = `
                <div class="empty-section-message">
                  <h3>Tidak ada TV yang tersedia</h3>
                  <p>Tambahkan TV dan Konsol di halaman Dashboard</p>
                </div>
              `
            }

            // Start timer
            startTimer(tvConsole.id)
          } else {
            // Pindahkan ke bagian TV yang tersedia
            const availableTVGrid = document.getElementById("available-tv-grid")
            const newCard = createTVConsoleCard(tvConsole)

            // Hapus pesan "Tidak ada TV yang tersedia" jika ada
            const emptyAvailableMessage = availableTVGrid.querySelector(".empty-section-message")
            if (emptyAvailableMessage) {
              emptyAvailableMessage.remove()
            }

            availableTVGrid.appendChild(newCard)

            // Periksa apakah bagian TV yang disewa menjadi kosong
            const rentedTVGrid = document.getElementById("rented-tv-grid")
            if (!rentedTVGrid.querySelector(".tv-card")) {
              rentedTVGrid.innerHTML = `
                <div class="empty-section-message">
                  <h3>Tidak ada TV yang sedang disewa</h3>
                </div>
              `
            }
          }
        } else {
          // Jika status tidak berubah, cukup update kartu
          const newCard = createTVConsoleCard(tvConsole)
          oldCard.parentNode.replaceChild(newCard, oldCard)

          // Restart timer if TV is rented
          if (tvConsole.status === "rented") {
            startTimer(tvConsole.id)
          }
        }
      } else {
        // Jika kartu tidak ditemukan, reload semua
        loadTVConsoleCards()
      }
    }
  })

  // Listen for price updates
  Broadcast.listenForPriceUpdates((event) => {
    const { type, data } = event.data

    if (type === BroadcastEvents.PRICES_UPDATED) {
      // Reload all cards to update prices
      loadTVConsoleCards()
    }
  })
}

/**
 * Set up modal event listeners
 */
function setupModalListeners() {
  // Payment modal
  const paymentModal = document.getElementById("payment-modal")
  const paymentCloseBtn = paymentModal.querySelector(".close-modal")
  const cancelPaymentBtn = document.getElementById("cancel-payment")
  const confirmPaymentBtn = document.getElementById("confirm-payment")

  // Close payment modal when clicking the X button
  paymentCloseBtn.addEventListener("click", () => {
    paymentModal.classList.remove("active")
  })

  // Close payment modal when clicking the Cancel button
  cancelPaymentBtn.addEventListener("click", () => {
    paymentModal.classList.remove("active")
  })

  // Confirm payment
  confirmPaymentBtn.addEventListener("click", () => {
    const id = confirmPaymentBtn.getAttribute("data-id")
    completeRentalPayment(id)
    paymentModal.classList.remove("active")
  })

  // Rental confirmation modal
  const rentalConfirmationModal = document.getElementById("rental-confirmation-modal")
  const rentalCloseBtn = rentalConfirmationModal.querySelector(".close-modal")
  const cancelRentalBtn = document.getElementById("cancel-rental")
  const confirmRentalBtn = document.getElementById("confirm-rental")

  // Close rental confirmation modal when clicking the X button
  rentalCloseBtn.addEventListener("click", () => {
    rentalConfirmationModal.classList.remove("active")
    pendingRental = null
  })

  // Close rental confirmation modal when clicking the Cancel button
  cancelRentalBtn.addEventListener("click", () => {
    rentalConfirmationModal.classList.remove("active")
    pendingRental = null
  })

  // Confirm rental
  confirmRentalBtn.addEventListener("click", () => {
    confirmRental()
    rentalConfirmationModal.classList.remove("active")
  })

  // Add time confirmation modal
  const addTimeConfirmationModal = document.getElementById("add-time-confirmation-modal")
  const addTimeCloseBtn = addTimeConfirmationModal.querySelector(".close-modal")
  const cancelAddTimeBtn = document.getElementById("cancel-add-time")
  const confirmAddTimeBtn = document.getElementById("confirm-add-time")

  // Close add time confirmation modal when clicking the X button
  addTimeCloseBtn.addEventListener("click", () => {
    addTimeConfirmationModal.classList.remove("active")
    pendingAddTime = null
  })

  // Close add time confirmation modal when clicking the Cancel button
  cancelAddTimeBtn.addEventListener("click", () => {
    addTimeConfirmationModal.classList.remove("active")
    pendingAddTime = null
  })

  // Confirm add time
  confirmAddTimeBtn.addEventListener("click", () => {
    confirmAddTime()
    addTimeConfirmationModal.classList.remove("active")
  })

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === paymentModal) {
      paymentModal.classList.remove("active")
    } else if (event.target === rentalConfirmationModal) {
      rentalConfirmationModal.classList.remove("active")
      pendingRental = null
    } else if (event.target === addTimeConfirmationModal) {
      addTimeConfirmationModal.classList.remove("active")
      pendingAddTime = null
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

// Clean up broadcast channels and timers when page is unloaded
window.addEventListener("beforeunload", () => {
  // Stop all timers
  Object.keys(activeTimers).forEach((id) => {
    stopTimer(id)
  })

  // Close all broadcast channels
  Broadcast.closeAllChannels()
})
