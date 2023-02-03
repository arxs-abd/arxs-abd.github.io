const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth
canvas.style.backgroundColor = 'black'

const rasio = 30
const angle = 90
const depth = 7

function drawLine(xFrom, yFrom, xTo, yTo) {
    ctx.moveTo(xFrom, yFrom)
    ctx.lineTo(xTo, yTo)
    ctx.stroke()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
}

async function drawTree(xFrom, yFrom, angle, depth) {
    if (depth === 0) return
    await sleep(1000)
    const xTo = xFrom - (Math.cos(degToRadian(angle)) * Math.sqrt(depth) * 20)
    const yTo = yFrom - (Math.sin(degToRadian(angle)) * Math.sqrt(depth) * 20)
    drawLine(xFrom, yFrom, xTo, yTo)
    drawTree(xTo, yTo, angle + rasio, depth - 1)
    drawTree(xTo, yTo, angle - rasio, depth - 1)
}

ctx.beginPath()
drawTree(canvas.width / 2, (canvas.height), angle, depth)

function degToRadian(deg) {
    return deg * (Math.PI / 180)
}
// drawTree(canvas.width / 2, canvas.height, angle, 10)


// function createBranch() {
//     ctx.beginPath()
//     ctx.moveTo(canvas.width / 2, canvas.height)
//     ctx.lineTo(canvas.width / 2, canvas.height - 50)
//     ctx.lineWidth = 2
//     ctx.strokeStyle = 'white'
//     ctx.stroke()
// }
// createBranch()
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}