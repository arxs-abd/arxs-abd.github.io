class Car {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.control = new Controls()
    }

    update() {
        if (this.control.forward) {
            this.y -= 2
        }
        if (this.control.reverse) {
            this.y += 2
        }

        if (this.control.left) {
            this.x -= 2
        }

        if (this.control.right) {
            this.x += 2
        }
    }

    draw() {
        ctx.beginPath()
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'rgb(138, 43, 226)'
    }
}