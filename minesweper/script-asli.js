const containerBoard = document.querySelector('.container-board')
const resetButton = document.querySelector('#reset')
const flagText = document.querySelector('#flag')

const bombSound = new Audio('wrong_sound.mp3')
const winSound = new Audio('win_sound.mp3')


resetButton.addEventListener('click', function(e) {
    for (let i = 0; i< board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].open || board[i][j].flag) {
                const box = board[i][j].box
                box.style.animation = `reveal-animation-back 300ms`
                box.style.backgroundColor = '#00ADB5'
                box.innerText = ''
            }
            board[i][j].open = false
        }
    }
    flagText.innerText = mine
})

let score = 0
let highScore = 0
let color = easy

const col = 15
const row = 13

const mine = 3

// Creating Board Game
const board = []

for (let i = 0; i < row; i++) {
    const rowBoard = []
    for (let j = 0; j < col; j++) {
        let data = {
            data : '',
            open : false,
            flag : false,
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

// Flag
flagText.innerText = mine

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
            if (board[i][j].open || board[i][j].flag) return

            board[i][j].flag = false

            if (board[i][j].data === 0) {
                bombSound.play()
                reveal()
            } else if (board[i][j].data !== '') {
                box.style.backgroundColor = 'white'
                box.innerText = board[i][j].data
                board[i][j].open = true
            } else {
                floodFill(Number(i), Number(j))
            }
            checkWinner()
        })

        box.addEventListener('contextmenu', function(e) {
            e.preventDefault()
            // if (Number(flagText.innerText) - 1 < 0) return
            if (board[i][j].flag) {
                box.style.backgroundColor = '#00ADB5'
                board[i][j].flag = false
                flagText.innerText = Number(flagText.innerText) + 1
            } else {
                box.style.backgroundColor = '#b50900'
                board[i][j].flag = true
                flagText.innerText = Number(flagText.innerText) - 1
            }
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

    if (board[x][y].flag) return
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
    floodFill(Number(x) + 1, Number(y) + 1)
    floodFill(Number(x) + 1, Number(y) - 1)
    floodFill(Number(x), Number(y) + 1)
    floodFill(Number(x), Number(y) - 1)
    floodFill(Number(x) - 1, Number(y))
    floodFill(Number(x) - 1, Number(y) + 1)
    floodFill(Number(x) - 1, Number(y) - 1)
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

    if (count === ((col * row) - mine)) {
        winSound.play()
        for (let i = 0; i< board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].data === 0) {
                    board[i][j].flag = true
                    board[i][j].box.style.backgroundColor = '#b50900'
                }
            }
        }
        return console.log('Winner')
    }
}