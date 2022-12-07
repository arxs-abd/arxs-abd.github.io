const containerBoard = document.querySelector('.container-board')
const resetButton = document.querySelector('#reset')
const flagText = document.querySelector('#flag')
const easyButton = document.querySelector('#easy')
const mediumButton = document.querySelector('#medium')
const hardButton = document.querySelector('#hard')

const bombSound = new Audio('wrong_sound.mp3')
const winSound = new Audio('win_sound.mp3')

const easy = '#00ADB5'
const color = {
    easy : '#00ADB5',
    medium : '#48b500',
    hard : '#acb500'
}
let gameMode = 'easy'

let score = 0
let highScore = 0
let first = true
// let color = easy

const col = 15
const row = 13

let mine = 30

// Creating Board Game
let board = []

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

// Flag
flagText.innerText = mine

// Generating Board
for (let i = 0; i < row; i++) {
    const rowContainer = document.createElement('div')
    rowContainer.classList.add('row')
    for (let j = 0; j < col; j++) {
        const box = board[i][j].box
        box.classList.add('box')
        box.dataset.mode = gameMode
        box.dataset.x = i
        box.dataset.y = j

        box.addEventListener('click', function(e) {
            firstClick(i, j)
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
                box.style.backgroundColor = color[gameMode]
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
        box.style.animation = `reveal-animation-${gameMode} 300ms`
        box.style.backgroundColor = 'white'
        box.innerText = board[x][y].data
        board[x][y].open = true
        delay = 0
        return
    }
    
    if (box.style.backgroundColor === 'white') return
    
    box.style.backgroundColor = 'white'
    board[x][y].open = true

    box.style.animation = `reveal-animation-${gameMode} 300ms`
    

    floodFill(Number(x) + 1, Number(y))
    floodFill(Number(x) + 1, Number(y) + 1)
    floodFill(Number(x) + 1, Number(y) - 1)
    floodFill(Number(x), Number(y) + 1)
    floodFill(Number(x), Number(y) - 1)
    floodFill(Number(x) - 1, Number(y))
    floodFill(Number(x) - 1, Number(y) + 1)
    floodFill(Number(x) - 1, Number(y) - 1)
}

resetButton.addEventListener('click', function(e) {
    reset()
})

easyButton.addEventListener('click', function(e) {
    mine = 30
    let olMode = gameMode + ''
    gameMode = 'easy'
    reset(olMode, gameMode)
})
mediumButton.addEventListener('click', function(e) {
    mine = 60
    let olMode = gameMode + ''
    gameMode = 'medium'
    reset(olMode, gameMode)
})

hardButton.addEventListener('click', function(e) {
    mine = 90
    let olMode = gameMode + ''
    gameMode = 'hard'
    reset(olMode, gameMode)
})

function reset(old, mode) {
    for (let i = 0; i< board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const box = board[i][j].box
            box.style.color = 'black'
            if (board[i][j].open || board[i][j].flag) {
                box.style.animation = `reveal-animation-${gameMode}-back 300ms`
                box.style.backgroundColor = color[gameMode]
                box.innerText = ''
            }
            board[i][j].open = false
            board[i][j].flag = false
        }
    }
    flagText.innerText = mine
    first = true

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            board[i][j].data = ''
            board[i][j].open = false
            board[i][j].flag = false
        }
    }

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const box = board[i][j].box
            if (mode) box.style.animation = `reveal-${old}-${mode} 500ms`
            box.style.backgroundColor = color[gameMode]
            box.addEventListener('click', function() {
                firstClick(i, j)
            })

            
        }
    }

    if (mode) {
        easyButton.style.backgroundColor = color[gameMode]
        easyButton.style.animation = `reveal-${old}-${mode} 500ms`
        mediumButton.style.backgroundColor = color[gameMode]
        mediumButton.style.animation = `reveal-${old}-${mode} 500ms`
        hardButton.style.backgroundColor = color[gameMode]
        hardButton.style.animation = `reveal-${old}-${mode} 500ms`
        resetButton.style.backgroundColor = color[gameMode]
        resetButton.style.animation = `reveal-${old}-${mode} 500ms`
    }
}

function firstClick(i, j) {
    if (first) {
        // Creating Mine
        const mineNumber = []
        while (mineNumber.length < mine) {
            const posX = getRandom(0, row - 1)
            const posY = getRandom(0, col - 1)

            if ((posX < i - 1 || posX > i + 1) || (posY < j - 1 || posY > j + 1)) {
                if (board[posX][posY].data === '') {
                    board[posX][posY].data = 0
                    mineNumber.push('*')
                }
            }
        }

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {

                if (board[i][j].data !== 0) {
                    board[i][j].data = generateNumberBoard(i, j)
                }

            }
        }

        first = !first
    }
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
                board[i][j].open = true
            }


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