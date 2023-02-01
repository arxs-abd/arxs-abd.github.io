const canvas = document.querySelector('canvas')
const counter = document.querySelector('#counter')
let counterCount = 0
counter.innerText = counterCount

const ctx = canvas.getContext('2d')
const m1 = 1
const digit = 3
const timeStamp = digit > 1 ? Math.pow(10, digit - 2) : 1

canvas.style.backgroundColor = 'grey'
canvas.height = 400
canvas.width = 800
const ground = 300

const block = new Block(350, 100, -1/timeStamp, Math.pow(100, digit - 1))
const block2 = new Block(30, 20, 0, m1)

function groundBlock() {
    ctx.beginPath()
    ctx.fillStyle = 'darkgrey'
    ctx.fillRect(0, ground, canvas.width, ground)
    ctx.closePath()
}

function handleBlock() {
    groundBlock()
    for (let i = 0; i < timeStamp; i++) {
        if (block.collide(block2)) {
            const v1 = block.bounce(block2)
            const v2 = block2.bounce(block)
            block.v = v1
            block2.v = v2
            counterCount++
            counter.innerText = counterCount
            
        }
        block.update()
        block2.update()
    }
    block.draw()
    block2.draw()

}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    handleBlock()
    requestAnimationFrame(animate)
}
animate()