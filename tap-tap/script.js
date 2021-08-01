const redBox = document.querySelector('#red')
const greenBox = document.querySelector('#green')

const redScore = document.querySelector('#red-score')
const greenScore = document.querySelector('#green-score')

let redHeight = 50;
let greenHeight = 50;

redBox.addEventListener('click', function() {
    redHeight += 1;
    greenHeight -= 1;
    redScore.innerHTML = redHeight
    greenScore.innerHTML = greenHeight
    redBox.style.height = `${redHeight}%`
    greenBox.style.height = `${greenHeight}%`
})

greenBox.addEventListener('click', function() {
    greenHeight += 1;
    redHeight -= 1;
    redScore.innerHTML = redHeight
    greenScore.innerHTML = greenHeight
    redBox.style.height = `${redHeight}%`
    greenBox.style.height = `${greenHeight}%`
})