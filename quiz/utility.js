const BASEURL = 'https://opentdb.com/api.php?amount=1&type=multiple'

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

function isDev(url) {
    if (url.split('//')[0] === 'http:') return true
    return false
}