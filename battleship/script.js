// BOARD GAME
// BOARD GAME BUTTON
const boardPlayer = document.querySelector('#board-player')
const boardOther = document.querySelector('#board-other')
const roomId = document.querySelector('#room-id')
const oppponentText = document.querySelector('#opponent-text')

// CONSOLE
// CONSOLE BUTTON
const createRoom = document.querySelector('#create-room')
const joinRoom = document.querySelector('#join')
const ready = document.querySelector('#ready')
// CONSOLE INPUT
const playerRoom = document.querySelector('#player-room')
const playerUsername = document.querySelector('#player-name')

// TOAST
const TOAST = document.querySelector('#snackbar')

// PUSHER
let pusher
let channel
let socket_id


const BASEURL = isProduction() 
? 'https://zany-puce-lamb-cap.cyclic.app/battleship/api' 
: 'http://localhost:3001/battleship/api'

const button = document.querySelectorAll('.c-ship')
const ship = {
    carrier : 5,
    battleship : 4,
    crusier : 3,
    submarine : 3,
    destroyer : 2,
}

// GAME
let PLAY = false
// let PLAY = true
let ROOM_ID = ''
let PLAYER_ID = ''
let IS_TURN = false

const MAX_LENGTH = 8

const boardGame = []
const strikeBoardGame = []
let selectedShip = []
let axis = true
let positionBoxNow = ''

let buttonClicked = null
let horizontal = true
let clicked = 0

// Create Listener For Create Ship
for (const cs of button) {
    cs.addEventListener('click', function() {
        if (!PLAY) return showToast('Anda Harus Mempunyai Lawan Untuk Memulai')

        if (cs.classList.contains('disabled')) return

        if (cs.classList.contains('click')) {
            // Sudah di Klik
            cs.classList.remove('click')
            buttonClicked = ''
        } else {
            // Baru Di Klik
            cs.classList.add('click')
            buttonClicked = cs.getAttribute('id')
            clicked = ship[buttonClicked]
        }
    })
}

playerUsername.addEventListener('keypress', function(e) {
    if (playerUsername.value.length < 5) return
    playerUsername.value = playerUsername.value.slice(0, 4)
    showToast('Maksimal Karakter Adalah 5')
    
})

createRoom.addEventListener('click', async function() {
    if (playerUsername.value.length === 0) return showToast('Username Wajib Diisi')
    const username = playerUsername.value
    const options = {
        method : 'POST',
        body: JSON.stringify({username})
    }
    const response = await fetchJSON('/create-room', options)
    ROOM_ID = response.roomId
    PLAYER_ID = response.id
    roomId.textContent = `[${ROOM_ID}]`
    playerRoom.value = response.roomId
    showToast(response.msg)

    await navigator.clipboard.writeText(response.roomId)
    await navigator.clipboard.readText()
    // playerRoom.select()
    // document.execCommand('copy')

    initPusher(username, PLAYER_ID)
})

joinRoom.addEventListener('click', async function() {
    const username = playerUsername.value
    const id = playerRoom.value
    const response = await fetchJSON('/join-room', {
        method : 'POST',
        body : JSON.stringify({roomId : id, username})
    })
    if (response.room === 0) return showToast(response.msg)
    ROOM_ID = id
    PLAYER_ID = response.id
    PLAY = true

    roomId.textContent = `[${ROOM_ID}]`
    oppponentText.textContent = 'Opponent : ' + response.oppUsername
    showToast(response.msg)
    initPusher(username, PLAYER_ID)
})

ready.addEventListener('click', async function() {
    const allShip = document.querySelectorAll('[ship]')

    if (allShip.length < 17) {
        return showToast('Susun Semua Kapal Terlebih Dahulu')
    }

    const payload = {
        method : 'POST',
        headers: {
            'x-socket-id': socket_id,
        },
        body : JSON.stringify({
            roomId : ROOM_ID,
            id : PLAYER_ID,
            channel_name : ROOM_ID,
            socket_id
        })
    }

    const response = await fetchJSON('/ready', payload)
    if (response.status === 'play') {
        roomId.textContent = `[${ROOM_ID}] : Silahkan Menyerang`
        IS_TURN = !IS_TURN
    } else showToast(response.msg)
})

createBoard()

document.addEventListener('keypress', function(e) {
    if (e.key === 'r') {
        horizontal = !horizontal
        removeShip()

        createShip(positionBoxNow)

    }
})

// CHANNEL LISTENER
function channelListener() {
    // Ketika Orang Join, Maka Sudah Bisa Mengatur SHIP
    channel.bind('join', function(data) {
        if (data.id == PLAYER_ID) return
        
        PLAY = true
        oppponentText.textContent = 'Opponent : ' + data.username
        showToast(data.msg)
    })

    // Ketika Lawan Sudah Siap, dan Anda Belum SIap
    channel.bind('opponent-ready', function(data) {
        if (data.id === PLAYER_ID) return

        showToast(data.msg)
    })

    // Ketika Anda dan Lawan Sudah Siap, Game Di Mulai
    channel.bind('start', function(data) {
        if (data.id === PLAYER_ID) return

        roomId.textContent = `[${ROOM_ID}] : ${data.msg}`
    })
    
    // Ketika Lawan Menyerang
    channel.bind('attack', async function(data) {
        if (data.id === PLAYER_ID) return

        const box = document.querySelector(`[data-pos="${data.attack}"]`)
        const result = box.getAttribute('ship')
        box.textContent = (result) ? 'x' : '-'

        const options = {
            method : 'POST',
            headers: {
                'x-socket-id': socket_id,
            },
            body : JSON.stringify({
                id : data.id,
                position : data.attack,
                result,
                roomId : ROOM_ID,
                socket_id,
                channel_name : ROOM_ID
            })
        }
        IS_TURN = !IS_TURN
        roomId.textContent = `[${ROOM_ID}] : ${IS_TURN ? 'Silahkan Menyerang' : 'Menunggu Lawan'}`
        showToast(result ? 'Tertembak' : 'Meleset')
        await fetchJSON('/response-move', options)
        
    })
    channel.bind('attack-response', async function(data) {
        if (data.id !== PLAYER_ID) return

        const box = document.querySelector(`[data-pos="${data.position}"][data-player="false"]`)
        console.log(box)
        box.classList.add((data.result) ? 'strike' : 'fail')
        showToast(data.result ? 'Tertembak' : 'Meleset')
        IS_TURN = !IS_TURN
        roomId.textContent = `[${ROOM_ID}] : ${IS_TURN ? 'Silahkan Menyerang' : 'Menunggu Lawan'}`
        
    })

}

// UTILITY
function initPusher(username, id) {
    // console.log(username, id)
    pusher = new Pusher('914eb719506342bd7d28', {
        cluster : 'ap1',
        authEndpoint: BASEURL + '/auth',
        auth : {
            params : {
                user_id: id,
                username: username,
            },
        },
        // authEndpoint: BASEURL + '/pusher/auth',
        // auth: {
        //     params: {
        //         user_id: id,
        //         username: username,
        //     },
        // },
    })
    pusher.connection.bind('connected', async () => {
        socket_id = pusher.connection.socket_id
    });
    
    channel = pusher.subscribe('presence-battleship-room-' + ROOM_ID)
    // channel.trigger()
    channel.bind('pusher:subscription_error', async () => {
        console.log('Gagal Subscribe')
        
    })
    channel.bind('pusher:member_added', () => {
        console.log(Object.keys(channel.members.members))
    })
    channel.bind('pusher:member_removed', async () => {
        showToast('Lawan Meninggalkan Room, Silahkan Buat Room Baru')

        await fetchJSON('/left-room', {
            method : 'POST',
            body : JSON.stringify({
                roomId : ROOM_ID
            })
        })

        playerRoom.value = ''
    })
  
    // channel.bind('pusher:subscription_succeeded', () => {
    //   onlineUsers = channel.members.members
    // })
  
    // channel.bind('pusher:member_added', (member) => {
    //   const idNow = chatUser.dataset.id
    //   if (!onlineUsers.hasOwnProperty(member.id)) onlineUsers[idNow] = null
    //   if (idNow === member.id) chatStatus.innerText = 'Online'
    // })
    // channel.bind('pusher:member_removed', (member) => {
    //   const idNow = chatUser.dataset.id
    //   delete onlineUsers[member]
    //   if (idNow === member.id) chatStatus.innerText = 'Offline'
    // })
    channelListener()
}

function createBoard() {
    for (let k = 0; k < 2; k++) {
        for (let i = 0; i < MAX_LENGTH; i++) {
            const rowBoard = []
            const row = document.createElement('div')
            row.classList.add('row')
            for (let j = 0; j < MAX_LENGTH; j++) {
                const box = document.createElement('div')
                const position = (String.fromCharCode(97 + i)) + ',' + (j + 1)
                box.classList.add('box')
                box.setAttribute('data-pos', position)
                box.setAttribute('data-status', '')
                box.setAttribute('data-player', (k === 0))
                
                // Event Listener For Board
                if (k === 0) {
                    box.addEventListener('mouseover', function(e) {
                        removeShip()
                        if (buttonClicked) {
                            createShip(position)
                            positionBoxNow = position
                        }
                    })

                    box.addEventListener('click', function(e) {
                        if (buttonClicked) {
                            if (selectedShip.length === 0) return

                            // Create SHIP by Location
                            for (const ship of selectedShip) {
                                const box = document.querySelector(`[data-pos="${ship}"]`)
                                box.setAttribute('ship', true)
                                box.classList.add('ship')
                            }
                            const selector = '#' + buttonClicked
                            const button = document.querySelector(selector)
                            button.classList.remove('click')
                            button.classList.add('disabled')
                            buttonClicked = ''
                        }
                    })
                } else {
                    box.addEventListener('click', async function(e) {
                        if (!PLAY || !IS_TURN) return

                        const options = {
                            method : 'POST',
                            headers: {
                                'x-socket-id': socket_id,
                            },
                            body : JSON.stringify({
                                roomId : ROOM_ID,
                                id : PLAYER_ID,
                                attack : position,
                                socket_id,
                                channel_name : ROOM_ID
                            })
                        }
                        const response = await fetchJSON('/move', options)
                        // box.classList.add('fail')
                    })
                }

                row.appendChild(box)
                rowBoard.push(box)
            }
            if (k == 0) {
                boardPlayer.appendChild(row)
                boardGame.push(rowBoard)
            }
            else {
                boardOther.appendChild(row)
                strikeBoardGame.push(rowBoard)
            }
        }
    }
}

function removeShip() {
    for (const row of boardGame) {
        for (const box of row) {
            if (!box.getAttribute('ship')) {
                box.classList.remove('ship')
                box.removeAttribute('data-ship')
            }
        }
    }
}

function createShip(position) {
    const length = ship[buttonClicked]
    let [x, y] = position.split(',')
    const xx = Number(x.charCodeAt(0)) - 96
    y = Number(y)

    const [max, min] = minMaxBlock(length)

    if (horizontal) {
        if (y + max <= MAX_LENGTH && y + min > 0) {
            // Check If Not Have SHIP
            for (let i = min; i <= max; i++) {
                const location = `${x},${y + i}`
                const box = document.querySelector(`[data-pos="${location}"]`)
                if (box.getAttribute('ship')) return
            }
            // Render SHIP
            selectedShip = []
            for (let i = min; i <= max; i++) {
                const location = `${x},${y + i}`
                const box = document.querySelector(`[data-pos="${location}"]`)
                box.classList.add('ship')
                box.setAttribute('data-ship', buttonClicked)
                selectedShip.push(location)
            }
        } else selectedShip = []
    } else {
        if (xx + max <= MAX_LENGTH && xx + min > 0) {
            for (let i = min; i <= max; i++) {
                // Check If Not Have SHIP
                const newX = String.fromCharCode(xx + i + 96)
                const location = `${newX},${y}`
                const box = document.querySelector(`[data-pos="${location}"]`)
                if (box.getAttribute('ship')) return
            }
            // Render SHIP
            selectedShip = []
            for (let i = min; i <= max; i++) {
                const newX = String.fromCharCode(xx + i + 96)
                const location = `${newX},${y}`
                const box = document.querySelector(`[data-pos="${location}"]`)
                box.classList.add('ship')
                box.setAttribute('data-ship', buttonClicked)
                selectedShip.push(location)
            }
        } else selectedShip = []
    }

}

function minMaxBlock(num) {
    if (num % 2 === 1) return [Math.floor(num / 2), Math.floor(num / 2) * -1]
    return [num / 2, (num / -2) + 1]
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength)
        result += characters.charAt(randomIndex)
    }

    return result
}

function showToast(message, time = 3000) {
    TOAST.textContent = ''
    TOAST.classList.add('show')
    TOAST.textContent = message
    setTimeout(function() {
        TOAST.classList.remove('show')
    }, time);
}

async function fetchJSON(url, options = {}) {
    options.headers = {
        'Content-Type': 'application/json',
    }
    try {
        const response = await fetch(BASEURL + url, options)
        if (!response.ok) {
            const data = await response.json()
            return alert(data.msg)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

function isProduction() {
    // return true
    const url = window.location.href
    return url.split('//')[0] === 'https:'
}