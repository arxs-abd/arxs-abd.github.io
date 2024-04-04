const allBox = document.querySelectorAll('.kotak');
const broadcastChannel = new BroadcastChannel('matrix');

const BOX = document.querySelector('.kotak-kotak');
const BOX_NUMBER = BOX.dataset.kotak;
// console.log(BOX_NUMBER);
const dev = getEnv(window.location.href);
const BASEURL = dev
? 'http://localhost:3000'
: 'https://lazy-red-donkey-wrap.cyclic.app/';

for (const box of allBox) {
    box.addEventListener('click', async function() {
        box.style.backgroundColor = 'black';
        box.style.color = 'white';
        const block = box.dataset.id;

        const result = await fetchJSON(`/api/send-room/${BOX_NUMBER}/${block}`)
        console.log(result)
    });
}

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