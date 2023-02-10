const canvas = document.querySelector('canvas')

canvas.style.marginTop = '20px'
canvas.width = 350
canvas.height = 600
canvas.style.backgroundColor = 'black'

const ctx = canvas.getContext('2d')
const bird = new Bird(canvas.width / 2, canvas.height / 2)
let firstObstacle = new Pipe(0, 0)
let secondObstacle = new Pipe(-350, 0)

document.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
        bird.up()
        bird.draw()
    }
})
// bird.draw()

function handleBird() {
    if (firstObstacle.isPassed()) firstObstacle = new Pipe(-350, 0)
    if (secondObstacle.isPassed()) secondObstacle = new Pipe(-350, 0)

    if (bird.hit(firstObstacle, secondObstacle)) return
    
    firstObstacle.draw()
    firstObstacle.update()
    secondObstacle.draw()
    secondObstacle.update()
    bird.draw()
    bird.update()

}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    handleBird()
    requestAnimationFrame(animate)
}
animate()

function randBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function isInCircle(a, b, x, y, r) {
    const dist_points = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    return dist_points < r
}