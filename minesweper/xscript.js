const containerBoard = document.querySelector('.container-board')

const col = 15
const row = 13
// const col = 4
// const row = 4

const mine = 10

let delay = 0

// Creating Board Game
const board = []
const boardGame = []
for (let i = 0; i < row; i++) {
    const rowBoard = []
    for (let j = 0; j < col; j++) {
        rowBoard.push('')
    }
    board.push(rowBoard)
}
// Creating Mine
const mineNumber = []

while (mineNumber.length < mine) {
    const posX = getRandom(0, col - 1)
    const posY = getRandom(0, row - 1)

    if (board[posY][posX] === '') {
        board[posY][posX] = 0
        mineNumber.push('*')
    }
}

// Generating Number
for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {

        if (board[i][j] !== 0) {
            // console.log({i, j})
            board[i][j] = generateNumberBoard(i, j)
        }

    }
}

// Generating Board
for (let i = 0; i < row; i++) {
    const rowContainer = document.createElement('div')
    rowContainer.classList.add('row')
    const rowBoardGame = []
    for (let j = 0; j < col; j++) {
        const box = document.createElement('div')
        box.classList.add('box')
        box.dataset.x = i
        box.dataset.y = j

        // if (board[i][j] === 0) box.innerText = '*'
        // else box.innerText = board[i][j]

        box.addEventListener('click', function(e) {
            if (board[box.dataset.x][box.dataset.y] === 0) {
                // console.log('Game Over')
                box.style.backgroundColor = 'white'
                box.innerText = 'x'
                box.style.color = 'red'
                reveal()
                return alert('Game Selesai')
            } else if (board[box.dataset.x][box.dataset.y] !== '') {
                box.style.backgroundColor = 'white'
                box.innerText = board[box.dataset.x][box.dataset.y]
            } else {
                // box.style.backgroundColor = 'white'
                floodFill(Number(box.dataset.x), Number(box.dataset.y))
            }
        })
        rowContainer.appendChild(box)
        rowBoardGame.push(box)
    }
    containerBoard.append(rowContainer)
    boardGame.push(rowBoardGame)
}

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function floodFill(x, y) {
    if (x < 0 || x >= row || y < 0 || y >= col) return
    const box = boardGame[x][y]

    if (board[x][y] !== '' && board[x][y] !== 0) {
        boardGame[x][y].style.backgroundColor = 'white'
        boardGame[x][y].innerText = board[x][y]
        return
    }

    if (box.style.backgroundColor === 'white') return

    // box.style.animation = `reveal-animation 200ms ${delay}ms` 
    box.style.backgroundColor = 'white'
    // delay += 200

    floodFill(Number(x) + 1, Number(y))
    floodFill(Number(x) - 1, Number(y))
    floodFill(Number(x), Number(y) + 1)
    floodFill(Number(x), Number(y) - 1)
}

function reveal() {
    for (let i = 0; i< boardGame.length; i++) {
        for (let j = 0; j < boardGame[i].length; j++) {

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

                if (board[pointX][pointY] === 0) {
                    // console.log(board[pointY][pointX])
                    total++
                }
            }

        }
    }
    return total === 0 ? '' : total
}