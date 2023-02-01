class Block {
    // constructor(x, y, w, v) {
    constructor(x, w, v, m) {
        this.x = x
        this.y = ground - w
        this.v = v
        this.w = w
        this.m = m
    }

    update() {
        if (this.x < 0) {
            counterCount++
            counter.innerText = counterCount
            this.v = this.v * -1
        }
        this.x += this.v
    }

    collide(otherBlock) {
        return !(this.x + this.w < otherBlock.x || this.x > otherBlock.x + otherBlock.w)
    }

    bounce(otherBlock) {
        const sumM = this.m + otherBlock.m
        let newV = (this.m - otherBlock.m) / sumM * this.v
        newV += (2 * otherBlock.m / sumM) * otherBlock.v
        return newV
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = 'darkred'
        ctx.fillRect(this.x, this.y, this.w, this.w)
        ctx.closePath()
    }
}