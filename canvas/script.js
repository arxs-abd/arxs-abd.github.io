const canvas = document.querySelector('canvas')

canvas.height = 500
canvas.width = 500

const ctx = canvas.getContext('2d')
const rain = []
canvas.style.backgroundColor = 'rgb(230, 230, 250)'

const car = new Car(10, 10, 40, 70)

function handleCar() {
    car.draw()    
    car.update()
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    handleCar()
    requestAnimationFrame(animate)
}

animate()



