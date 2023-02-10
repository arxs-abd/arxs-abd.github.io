class Bird {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.velocity = 4
        this.gravity = 2
        this.size = 20
    }

    up() {
        this.y -= this.velocity * 20
    }
    
    update() {
        if (this.y + this.velocity + this.size < canvas.height) this.y += this.velocity
    }

    // hit(pipe) {
    hit(...pipe) {
        // console.log(pipe)
        for (let i = 0; i < pipe.length; i++) {
            if (isInCircle(bird.x, bird.y, pipe[i].x, pipe[i].y, this.size)) return true 
            // if (this.x > pipe[i].x && this.x < pipe[i].x + pipe[i].size && 
            //     (this.y < pipe[i].y + pipe[i].firstBlock ||
            //     this.y > pipe[i].firstBlock + 200)) return true 
        }

        // if (this.x > pipe.x && this.x < pipe.x + pipe.size && 
        //     (this.y < pipe.y + pipe.firstBlock ||
        //     this.y > pipe.firstBlock + 200)) return true 
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
    }
}