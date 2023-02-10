class Pipe {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = 30
        this.firstBlock = randBetween(10, canvas.height - 250)
        this.secondBlock = 400 - this.firstBlock
    }

    update() {
        this.x += 2
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.size, this.firstBlock)
        ctx.fillRect(this.x, canvas.height, this.size, -this.secondBlock)
    }

    isPassed() {
        return this.x > canvas.width
    }
}