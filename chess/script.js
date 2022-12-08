const containerBoard = document.querySelector('.container-board')
const html = document.querySelector('html')

// Note
// Baru bisa pindahkan Pionnya, masih banyak lagi
const army = {
    rook : '♜',
    knight : '♞',
    king : '♚',
    queen : '♛',
    bishop : '♝',
    pawn : '♟',
}

const position = [
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
    // [army.rook, army.knight, army.bishop, army.queen, army.king, army.bishop, army.knight, army.rook],
    [army.pawn, army.pawn, army.pawn, army.pawn, army.pawn, army.pawn, army.pawn, army.pawn,]
]

const game = []
let gameTurn = 1

let oldMove = {}
let nextMove = []

// Creating Board
for (let i = 0; i < 8; i++) {
    const row = document.createElement('div')
    row.classList.add('row')
    let boxColor = i % 2
    const rowGame = []
    for (let j = 0; j < 8; j++) {
        const box = document.createElement('div')
        box.classList.add('box')
        box.dataset.x = i
        box.dataset.y = j
        // box.draggable = true

        const data = {
            bord : null,
            player : null,
            box : box
        }

        box.dataset.board = boxColor % 2
        if (i === 0 || i === 7) {
            box.innerText = army[position[0][j]]
            box.dataset.player = i === 0 ? 0 : 1
            data.bord = position[0][j]
            data.player = i === 0 ? 0 : 1
        } else if (i === 1 || i === 6) {
            box.innerText = army['pawn']
            data.bord = 'pawn'
            box.dataset.player = i === 1 ? 0 : 1
            data.player = i === 1 ? 0 : 1
        }

        box.addEventListener('click', function(e) {
            e.preventDefault()
            
            const x = Number(box.dataset.x)
            const y = Number(box.dataset.y)

            if (checkNextMove(x, y)) {
                // console.log('nextMove')
                removeSelected()
                move(x, y)

                nextMove = []
                gameTurn = (gameTurn === 1) ? 0 : 1
                html.style.animation = (gameTurn === 1 ? 'black-white' : 'white-black') + ' 500ms'
                html.style.backgroundColor = gameTurn === 1 ? 'white' : '#222831'
            } else {
                removeSelected()
    
                if (!this.innerText) return

                if (game[x][y].player !== gameTurn) return
    
                box.classList.add('selected')
                oldMove = {x, y}
                checkMove(x, y)
            }
        })

        rowGame.push(data)
        row.appendChild(box)
        boxColor++
    }
    game.push(rowGame)
    containerBoard.appendChild(row)
}

// console.log('White Turn')

function removeSelected() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const box = game[i][j].box
            if (box.classList.contains('selected')) {
                box.classList.remove('selected')
            }
            if (box.dataset.dot === '1') box.dataset.dot = 0
        }
    }
}

function checkMove(x, y) {
    const data = game[x][y]
    // console.log(data)

    // Hitam Player 0
    // Putih Player 1

    if (data.bord === 'pawn') {

        // For Player 1
        if (data.player) {
            // Pawn 2 Steps
            if (x === 6) {

                // Check if a bord in front
                if (!game[x - 2][y].bord) {
                    game[x - 2][y].box.dataset.dot = 1
                    nextMove.push({
                        x : x - 2,
                        y : y,
                    })
                }
                if (!game[x - 1][y].bord) {
                    game[x - 1][y].box.dataset.dot = 1
                    nextMove.push({
                        x : x - 1,
                        y : y,
                    })
                }
            
            // Pawn 1 Steps
            } else {
                if (!game[x - 1][y].bord) {
                    game[x - 1][y].box.dataset.dot = 1
                    nextMove.push({
                        x : x - 1,
                        y : y,
                    })
                }

            }
          
        // For Player 0 
        } else {
            // Pawn 2 Steps
            if (x === 1) {

                // Check if a bord in front
                if (!game[x + 2][y].bord) {
                    game[x + 2][y].box.dataset.dot = 1
                    nextMove.push({
                        x : x + 2,
                        y : y,
                    })
                }
                if (!game[x + 1][y].bord) {
                    game[x + 1][y].box.dataset.dot = 1
                    nextMove.push({
                        x : x + 1,
                        y : y,
                    })
                }
            // Pawn 1 Steps
            } else {
                if (!game[x + 1][y].bord) {
                    game[x + 1][y].box.dataset.dot = 1
                    nextMove.push({
                        x : x + 1,
                        y : y,
                    })
                }
            }
        }

    }
}

function checkNextMove(x, y) {
    for (let i = 0; i < nextMove.length; i++) {
        if (nextMove[i].x === x && nextMove[i].y === y) return true
    }
    return false

}

function move(x, y) {
    const oldX = oldMove.x
    const oldY = oldMove.y

    const oldBoard = game[oldX][oldY].box
    const newBoard = game[x][y].box

    const oldBord = game[oldX][oldY].bord
    const oldPlayer = game[oldX][oldY].player
    
    // Create New
    game[x][y].bord = oldBord
    game[x][y].player = oldPlayer
    newBoard.innerText = army[oldBord]
    newBoard.dataset.player = oldPlayer

    // Remove Old
    game[oldX][oldY].bord = null
    game[oldX][oldY].player = null
    oldBoard.innerText = ''
    oldBoard.dataset.player = ''

}