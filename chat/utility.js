let formatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit', 
    minute: '2-digit',
})

let formatterTimeDivisionDate = new Intl.DateTimeFormat('id-ID', {
    month : 'long',
    day : '2-digit',
    year : 'numeric'
})
let formatterTimeDivisionDay = new Intl.DateTimeFormat('id-ID', {
    weekday : 'long'
})

// Utility Function

async function fetchJSON(url, options = {}) {
    try {
        const response = await fetch(BASEURL + url, options)
        if (!response.ok) {
            const data = await response.json()
            return alert(data.msg)
            // return alert(response.text())
            // throw new Error(response.statusText)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

function getEnv(url) {
    if (url.split('//')[0] === 'http:') return true
    return false
}

function getFromLocalStorage(key, falseResult = []) {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : falseResult
}

function setFromLocalStorage(key, value) {
    return localStorage.setItem(key, JSON.stringify(value))
}

async function getNotifPermission() {
    return await Notification.requestPermission()
}

async function getMicPermission() {
    return await navigator.mediaDevices.getUserMedia({video : false, audio : true})
}

function sendNotification(msg) {
    console.log('jalan')
    let title = 'New Message'
    let body = 'Pesan dari Teman anda yaitu : ' + msg.message;
    let notification = new Notification(title, { body });
    notification.onclick = () => {
        notification.close()
        window.parent.focus()
    }
}

function formatTime(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
        return '00:00'
      }
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
    
      const formattedMinutes = String(minutes).padStart(2, '0')
      const formattedSeconds = String(remainingSeconds).padStart(2, '0')
    
      return `${formattedMinutes}:${formattedSeconds}`
}

function showMessage(...message) {
    let dev = getEnv(window.location.href)
    if (dev) console.log(...message)
}

function countDay(time) {
    const now = new Date()
    
    const min = now - time
    return Math.floor(min / (1000 * 60 * 60 * 24))
    
}

function getMessageChat(text) {
    const MAX_LENGTH = 1000
    return text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH) + '...' : text
}