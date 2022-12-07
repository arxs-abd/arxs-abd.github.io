const containerBoard = document.querySelector('.container-board')
const resetButton = document.querySelector('#reset')
const scoreText = document.querySelector('#score')
const highScoreText = document.querySelector('#max-score')

resetButton.addEventListener('click', function(e) {
    for (let i = 0; i< board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].open) {
                const box = board[i][j].box
                box.style.animation = `reveal-animation-back 300ms`
                box.style.backgroundColor = '#00ADB5'
                box.innerText = ''
            }
            board[i][j].open = false
        }
    }
    score = 0
    scoreText.innerText = 0
})

let score = 0
let highScore = 0

const col = 15
const row = 13

const mine = 100

// Creating Board Game
const board = []

for (let i = 0; i < row; i++) {
    const rowBoard = []
    for (let j = 0; j < col; j++) {
        let data = {
            data : '',
            open : false,
            box : document.createElement('div')
        }
        rowBoard.push(data)
    }
    board.push(rowBoard)
}
// Creating Mine
const mineNumber = []
while (mineNumber.length < mine) {
    const posX = getRandom(0, row - 1)
    const posY = getRandom(0, col - 1)

    if (board[posX][posY].data === '') {
        board[posX][posY].data = 0
        mineNumber.push('*')
    }
}

// Generating Number
for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {

        if (board[i][j].data !== 0) {
            board[i][j].data = generateNumberBoard(i, j)
        }

    }
}

// Generating Board
for (let i = 0; i < row; i++) {
    const rowContainer = document.createElement('div')
    rowContainer.classList.add('row')
    for (let j = 0; j < col; j++) {
        const box = board[i][j].box
        box.classList.add('box')
        box.dataset.x = i
        box.dataset.y = j

        // if (board[i][j] === 0) box.innerText = '*'
        // else box.innerText = board[i][j]

        box.addEventListener('click', function(e) {
            if (board[box.dataset.x][box.dataset.y].open) return

            if (board[box.dataset.x][box.dataset.y].data === 0) {
                reveal()
            } else if (board[box.dataset.x][box.dataset.y].data !== '') {
                box.style.backgroundColor = 'white'
                box.innerText = board[box.dataset.x][box.dataset.y].data
                board[box.dataset.x][box.dataset.y].open = true
                updateScore()
            } else {
                floodFill(Number(box.dataset.x), Number(box.dataset.y))
                updateScore()
            }
            checkWinner()
        })
        rowContainer.appendChild(box)
    }
    containerBoard.append(rowContainer)
}

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function floodFill(x, y) {
    if (x < 0 || x >= row || y < 0 || y >= col) return

    if (board[x][y].open) return

    const box = board[x][y].box

    if (board[x][y].data !== '' && board[x][y].data !== 0) {
        box.style.backgroundColor = 'white'
        box.innerText = board[x][y].data
        board[x][y].open = true
        delay = 0
        return
    }
    
    if (box.style.backgroundColor === 'white') return
    
    box.style.backgroundColor = 'white'
    board[x][y].open = true

    box.style.animation = `reveal-animation 300ms`
    

    floodFill(Number(x) + 1, Number(y))
    floodFill(Number(x), Number(y) + 1)
    floodFill(Number(x), Number(y) - 1)
    floodFill(Number(x) - 1, Number(y))
}

function reveal() {
    for (let i = 0; i< board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].data === 0) {
                const box = board[i][j].box
                box.style.animation = `reveal-animation 300ms`
                box.style.backgroundColor = 'white'
                box.style.color = 'red'
                box.innerText = 'x'
            }

            board[i][j].open = true

        }
    }
}

function generateNumberBoard(x, y) {
    let total = 0

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {

            const pointX = x + i
            const pointY = y + j

            if (pointX >= 0 && pointX < row && pointY >= 0 && pointY < col) {

                if (board[pointX][pointY].data === 0) {
                    total++
                }
            }

        }
    }
    return total === 0 ? '' : total
}

function checkWinner() {
    let count = 0
    for (let i = 0; i< board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].open) count++
        }
    }

    if (count === ((col * row) - mine)) return console.log('Winner')
}

function updateScore() {
    score++
    scoreText.innerText = score

    if (score > highScore) {
        highScore = score
        highScoreText.innerText = score
    }
}