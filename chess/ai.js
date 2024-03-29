const containerBoard = document.querySelector('.container-board')
const html = document.querySelector('html')
const snackbar = document.querySelector('#snackbar')
const scoreBoxBlack = document.querySelector('.score-box#black')
const scoreBoxWhite = document.querySelector('.score-box#white')

// Note
// Blum Bisa CheckMate
// AI in progress
const army = {
    rook : '♜', // Done 50
    knight : '♞', // Done 30
    king : '♚', // Done 900
    queen : '♛', // Done 90
    bishop : '♝', // Done 30
    pawn : '♟', // Done 10
}

const scoreArmy = {
    rook : 50,
    knight : 30,
    king : 900,
    queen : 90,
    bishop : 30,
    pawn : 10,
}

// const score = {
//     rook : 
// }

const position = [
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
    [army.pawn, army.pawn, army.pawn, army.pawn, army.pawn, army.pawn, army.pawn, army.pawn,]
]

let game = []
let gameTurn = 1

let oldMove = {}
let nextMove = []
let nextMoveCheck = []

// AI
// const ai = true
const ai = false
let aiNext = false
const DEPTH = 3


// let customBoard = [
//     [{}, {b : 'king', p : 0}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {b : 'rook', p : 1}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
// ]

let customBoard = [
    ['', '', 'r', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', 'Q', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
]

const custom = false
// const custom = true

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

        const data = {
            bord : null,
            player : null,
            box : box,
            x : i,
            y : j
        }

        box.dataset.board = boxColor % 2
        if (!custom) {
            // Normal Board
            if (i === 0 || i === 7) {
                box.innerText = army[position[0][j]]
                box.dataset.player = i === 0 ? 0 : 1
                data.bord = position[0][j]
                data.player = i === 0 ? 0 : 1
            } 
            else if (i === 1 || i === 6) {
                box.innerText = army['pawn']
                data.bord = 'pawn'
                box.dataset.player = i === 1 ? 0 : 1
                data.player = i === 1 ? 0 : 1
            }
        } else {
            // Custom Board

            if (customBoard[i][j] !== '') {
                const [bord, player] = getCustomBoardData(customBoard[i][j])
                // console.log({player, bord})
                box.innerText = army[bord]
                data.bord = bord
                box.dataset.player = player
                data.player = player
            }
            // if (customBoard[i][j].b) {
            //     box.innerText = army[customBoard[i][j].b]
            //     data.bord = customBoard[i][j].b
            //     box.dataset.player = customBoard[i][j].p
            //     data.player = customBoard[i][j].p
            // }


        }

        box.addEventListener('click', function(e) {
            e.preventDefault()
            
            const x = Number(box.dataset.x)
            const y = Number(box.dataset.y)

            if (checkNextMove(x, y)) {
                removeSelected()
                move(x, y)
                checkMate(x, y)
                // console.log(countScore(gameTurn), countScore(gameTurn + 1 % 2))
                gameTurn = (gameTurn === 1) ? 0 : 1
                html.style.animation = (gameTurn === 1 ? 'black-white' : 'white-black') + ' 1000ms'
                html.style.backgroundColor = gameTurn === 1 ? 'white' : '#222831'
                nextMove = []

                
                // Ai Turn
                // if (aiTurn) {
                    if (ai) {
                        setTimeout(() => {
                            aiTurn()
                        }, 1000);
                        // aiTurnNext = !aiTurnNext
                    }
                // }

            } else {
                removeSelected()
                console.log(game[x][y])
    
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

function getCustomBoardData(data) {
    let bord = ''

    // ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],

    if (data.toLowerCase() === 'p') bord = 'pawn'
    else if (data.toLowerCase() === 'r') bord = 'rook'
    else if (data.toLowerCase() === 'k') bord = 'knight'
    else if (data.toLowerCase() === 'b') bord = 'bishop'
    else if (data.toLowerCase() === 'q') bord = 'queen'
    else if (data.toLowerCase() === 'ki') bord = 'king'

    let player = data.toLowerCase() === data ? 0 : 1

    return [bord, player]
}

function updateBox() {

    const white = countPieces(1)
    const black = countPieces(0)

    // console.log({white, black})
    const total = white + black
    const whitePercentage = Math.round((white / total) * 100)

    scoreBoxBlack.style.height = `${100 - whitePercentage}%`
    scoreBoxWhite.style.height = `${whitePercentage}%`
}

function countPieces(color) {
    let score = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (game[i][j].player === color) score++
        }
    }

    return score
}

function aiTurn() {
    aiNext = true
    // Ai Random
    // const aiPieces = []
    // for (let i = 0; i < 8; i++) {
    //     for (let j = 0; j < 8; j++) {
    //         if (game[i][j].player === 0) {
    //             aiPieces.push(game[i][j])
    //         }
    //     }
    // }
    // if (aiPieces.length === 0) {
    //     console.log('You Win')
    //     return 
    // }
    // let done = true

    // while (done) {
    //     const number = getRandom(0, aiPieces.length - 1)
    //     const pieces = aiPieces[number]
    //     console.log(pieces)
    //     const x = pieces.x
    //     const y = pieces.y

    //     oldMove = {x, y}
    //     if (pieces.bord === 'pawn') {
    //         pawnMove(pieces, x, y)
    //     } 
    //     else if (pieces.bord === 'knight') {
    //         knightMove(x, y)
    //     }
    //     else if (pieces.bord === 'bishop') {
    //         bishopMove(x, y)
    //     }
    //     else if (pieces.bord === 'rook') {
    //         rookMove(x, y)
    //     }
    //     else if (pieces.bord === 'king') {
    //         kingMove(x, y)
    //     }
    //     else if (pieces.bord === 'queen'){ 
    //         rookMove(x, y) 
    //         bishopMove(x, y)
    //     }

    //     if (nextMove.length !== 0) {
    //         const movePoint = getRandom(0, nextMove.length - 1)
    //         const next = nextMove[movePoint]
    //         move(next.x, next.y)
    //         done = false
    //     }
    // }

    // Ai Alpha Beta Pruning
    let lowScore = Infinity
    const aiPieces = getPieces(game, 0)
    // console.log(...aiPieces)
    let bestMove = {}
    let movePieces = {}
    // console.log([...game])
    for (let i = 0; i < aiPieces.length; i++) {
        const pieces = {...aiPieces[i]}
        const {x, y} = pieces
        moveBord(pieces, x, y)
        oldMove = {x, y}
        const oldBoard = game.slice()
        for (let j = 0; j < nextMove.length; j++) {
            console.log(pieces, nextMove[j])
            const oldPieces = game[nextMove[j].x][nextMove[j].y]
            const newBoard = moveComputer(game, x, y, nextMove[j].x, nextMove[j].y)
            // console.log([...newBoard])
            // return
            const score = countScoreAB(newBoard, 1)
            if (score < lowScore) {
                lowScore = score
                bestMove.x = nextMove[j].x
                bestMove.y = nextMove[j].y
                movePieces = pieces
                console.log({movePieces, bestMove})
            }
            // // game = oldBoard
            // // Undo
            // // console.log(pieces)
            // const temp = {...newBoard[x][y]}
            game[x][y] = oldBoard[x][y]
            game[nextMove[j].x][nextMove[j].y] = oldBoard[nextMove[j].x][nextMove[j].y]
            // return
        }
        nextMove = []
    }
    console.log({bestMove, movePieces})
    move(bestMove.x, bestMove.y, movePieces)

    removeSelected()
    renderBordAgain()
    gameTurn = (gameTurn === 1) ? 0 : 1
    html.style.animation = (gameTurn === 1 ? 'black-white' : 'white-black') + ' 1000ms'
    html.style.backgroundColor = gameTurn === 1 ? '#FFFDD2' : '#222831'
    nextMove = []
    aiNext = false
}

function renderBordAgain() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const {box, bord, player} = game[i][j]
            box.innerText = ''
            box.dataset.player = ''
            if (game[i][j].bord) {
                box.innerText = army[bord]
                box.dataset.player = player
            }
        }
    }
}

function moveBord(pieces, x, y) {
    if (pieces.bord === 'pawn') {
        pawnMove(pieces, x, y)
    } 
    else if (pieces.bord === 'knight') {
        knightMove(x, y)
    }
    else if (pieces.bord === 'bishop') {
        bishopMove(x, y)
    }
    else if (pieces.bord === 'rook') {
        rookMove(x, y)
    }
    else if (pieces.bord === 'king') {
        kingMove(x, y)
    }
    else if (pieces.bord === 'queen'){ 
        rookMove(x, y) 
        bishopMove(x, y)
    }
}

function aplhaBetaPruning(board, depth, alpha, beta, isMaximizing) {
    const color = isMaximizing ? 1 : 0
    if (depth == 0 ) {
        return countScoreAB(board, color)
    }
    const pieces = getPieces(board, color)
    if (isMaximizing) {
        let bestScore = -Infinity
        for (let i = 0; i < pieces.length; i++) {

            alpha = Math.max(alpha, minimax(child, depth - 1, alpha, beta, false))
            if (alpha >= beta) {
               break
            }
        }
        return alpha
    } else {
        let bestScore = Infinity
        for (let i = 0; i < pieces.length; i++) {
            beta = Math.min(beta, minimax(child, depth - 1, alpha, beta, true))
            if (alpha >= beta) {
               break
            }
        }
        return beta
    }
}

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}



function removeSelected() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const box = game[i][j].box
            if (box.classList.contains('selected')) {
                box.classList.remove('selected')
            }
            if (box.dataset.dot !== '0') box.dataset.dot = 0
        }
    }
}

function checkMove(x, y) {
    const data = game[x][y]
    // console.log(data)

    // Hitam Player 0
    // Putih Player 1

    if (data.bord === 'pawn') pawnMove(data, x, y) 
    else if (data.bord === 'knight') knightMove(x, y)
    else if (data.bord === 'bishop') bishopMove(x, y)
    else if (data.bord === 'rook') rookMove(x, y)
    else if (data.bord === 'king') kingMove(x, y)
    else if (data.bord === 'queen'){ 
        rookMove(x, y) 
        bishopMove(x, y)
    }
}

function checkNextMove(x, y) {
    for (let i = 0; i < nextMove.length; i++) {
        if (nextMove[i].x === x && nextMove[i].y === y) return true
    }
    return false

}

function moveComputer(board, oldX, oldY, x, y) {
    // const oldX = oldMove.x
    // const oldY = oldMove.y
    // console.log({oldX, oldY})

    const oldBord = board[oldX][oldY].bord
    const oldPlayer = board[oldX][oldY].player
    
    // Create New
    board[x][y].bord = oldBord
    board[x][y].player = oldPlayer

    // Remove Old
    board[oldX][oldY].bord = null
    board[oldX][oldY].player = null
    return board
}

function move(x, y, movePieces) {
    const oldX = movePieces?.x ?? oldMove.x
    const oldY = movePieces?.y ??oldMove.y

    const oldBoard = game[oldX][oldY].box
    const newBoard = game[x][y].box
    
    // const oldBord = game[oldX][oldY].bord
    // const oldPlayer = game[oldX][oldY].player
    const oldBord = movePieces?.bord ?? game[oldX][oldY].bord
    const oldPlayer = movePieces?.player ?? game[oldX][oldY].player
    
    console.log({oldX, oldY})
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

    updateBox()

}

function pawnMove(data, x, y) {
    // For Player 1
    if (data.player) {
        // Pawn 2 Steps
        if (x === 6) {

            // Check if a bord in front
            if (!game[x - 2][y].bord) {
                if (!aiNext) game[x - 2][y].box.dataset.dot = 1
                nextMove.push({
                    x : x - 2,
                    y : y,
                })
            }
            if (!game[x - 1][y].bord) {
                if (!aiNext) game[x - 1][y].box.dataset.dot = 1
                nextMove.push({
                    x : x - 1,
                    y : y,
                })
            }
        
        // Pawn 1 Steps
        } else {
            if (!game[x - 1][y].bord) {
                if (!aiNext) game[x - 1][y].box.dataset.dot = 1
                nextMove.push({
                    x : x - 1,
                    y : y,
                })
            }
            
            
        }
        // check Kill
        // Check if stil in board
        if (x - 1 >= 0 && y - 1 >= 0) {
            if (game[x - 1][y - 1].player !== game[x][y].player && game[x - 1][y - 1].player !== null) {
                setKill(x - 1, y - 1)
            }
        }
        // Check if stil in board
        if (x - 1 >= 0 && y + 1 < 8) {
            if (game[x - 1][y + 1].player !== game[x][y].player && game[x - 1][y + 1].player !== null) {
                setKill(x - 1, y + 1)
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
        // check Kill
        // Check if stil in board
        if (x + 1 < 8 && y + 1 < 8) {

            if (game[x + 1][y + 1].player !== game[x][y].player && game[x + 1][y + 1].player !== null) {
                setKill(x + 1, y + 1)
            }
        }

        // Check if stil in board
        if (x + 1 < 8 && y - 1 >= 0) {
            if (game[x + 1][y - 1].player !== game[x][y].player && game[x + 1][y - 1].player !== null) {
                setKill(x + 1, y - 1)
            }
        }
    }
}

function knightMove(x, y) {
    const knightMove = [
        [x - 1, y - 2], [x - 1, y + 2], [x - 2, y - 1], [x - 2, y + 1],
        [x + 1, y - 2], [x + 1, y + 2], [x + 2, y + 1], [x + 2, y - 1]
    ]

    knightMove.forEach(function(move) {
        const i = move[0]
        const j = move[1]
        if (i >= 0 && i < 8 && j >= 0 && j < 8) {
            if (!game[i][j].bord) {
                if (!aiNext) game[i][j].box.dataset.dot = 1
                nextMove.push({
                    x : i,
                    y : j,
                 })
            } else {
                if (game[i][j].player !== game[x][y].player && game[i][j].player !== null) {
                    if (!aiNext) game[i][j].box.dataset.dot = 2
                    nextMove.push({
                        x : i,
                        y : j,
                    })
                }
            }
        }

    })
}

function bishopMove(x, y) {
    let plusPlus = false
    let plusMinus = false
    let minusPlus = false
    let minusMinus = false

    for (let i = 1; i < 8; i++) {
        if (x + i >= 0 && x + i < 8 && y + i >= 0 && y + i < 8) {
            if (!game[x + i][y + i].bord && !plusPlus) {
                if (!aiNext) game[x + i][y + i].box.dataset.dot = 1
                nextMove.push({
                    x : x + i,
                    y : y + i,
                })
            } else if (game[x + i][y + i].player !== game[x][y].player && !plusPlus) {
                if (!aiNext) game[x + i][y + i].box.dataset.dot = 2
                nextMove.push({
                    x : x + i,
                    y : y + i,
                })
                plusPlus = true
            } else {
                plusPlus = true
            }
        }
        if (x + i >= 0 && x + i < 8 && y - i >= 0 && y - i < 8) {
            if (!game[x + i][y - i].bord && !plusMinus) {
                if (!aiNext) game[x + i][y - i].box.dataset.dot = 1
                nextMove.push({
                    x : x + i,
                    y : y - i,
                })
            } else if (game[x + i][y - i].player !== game[x][y].player && !plusMinus) {
                if (!aiNext) game[x + i][y - i].box.dataset.dot = 2
                nextMove.push({
                    x : x + i,
                    y : y - i,
                })
                plusMinus = true
            } else {
                plusMinus = true
            }
        }
        if (x - i >= 0 && x - i < 8 && y + i >= 0 && y + i < 8) {
            if (!game[x - i][y + i].bord && !minusPlus) {
                if (!aiNext) game[x - i][y + i].box.dataset.dot = 1
                nextMove.push({
                    x : x - i,
                    y : y + i,
                })
            } else if (game[x - i][y + i].player !== game[x][y].player && !minusPlus) {
                if (!aiNext) game[x - i][y + i].box.dataset.dot = 2
                nextMove.push({
                    x : x - i,
                    y : y + i,
                })
                minusPlus = true
            } else {
                minusPlus = true
            }
        }
        if (x - i >= 0 && x - i < 8 && y - i >= 0 && y - i < 8) {
            if (!game[x - i][y - i].bord && !minusMinus) {
                if (!aiNext) game[x - i][y - i].box.dataset.dot = 1
                nextMove.push({
                    x : x - i,
                    y : y - i,
                })
            } else if (game[x - i][y - i].player !== game[x][y].player && !minusMinus) {
                if (!aiNext) game[x - i][y - i].box.dataset.dot = 2
                nextMove.push({
                    x : x - i,
                    y : y - i,
                })
                minusMinus = true
            } else {
                minusMinus = true
            }
        }
    }
}

function rookMove(x, y) {
    let axisXMin = false
    let axisXPlus = false
    let axisYMin = false
    let axisYPlus = false

    for (let i = 1; i < 8; i++) {
        if (x + i < 8) {
            if (!game[x + i][y].bord && !axisXPlus) {
                if (!aiNext) game[x + i][y].box.dataset.dot = 1
                nextMove.push({
                    x : x + i,
                    y : y,
                })
            } else if (game[x + i][y].player !== game[x][y].player && !axisXPlus) {
                if (!aiNext) game[x + i][y].box.dataset.dot = 2
                nextMove.push({
                    x : x + i,
                    y : y,
                })
                axisXPlus = true
            } else {
                axisXPlus = true
            }
            
        }
        if (x - i >= 0) {
            if (!game[x - i][y].bord && !axisXMin) {
                if (!aiNext) game[x - i][y].box.dataset.dot = 1
                nextMove.push({
                    x : x - i,
                    y : y,
                })
            } else if (game[x - i][y].player !== game[x][y].player && !axisXMin) {
                if (!aiNext) game[x - i][y].box.dataset.dot = 2
                nextMove.push({
                    x : x - i,
                    y : y,
                })
                axisXMin = true
            } else {
                axisXMin = true
            }
        }
        if (y + i < 8) {
            if (!game[x][y + i].bord && !axisYPlus) {
                if (!aiNext) game[x][y + i].box.dataset.dot = 1
                nextMove.push({
                    x : x,
                    y : y + i,
                })
            } else if (game[x][y + i].player !== game[x][y].player && !axisYPlus) {
                if (!aiNext) game[x][y + i].box.dataset.dot = 2
                nextMove.push({
                    x : x,
                    y : y + i,
                })
                axisYPlus = true
            } else {
                axisYPlus = true
            }
            
        }
        if (y - i >= 0) {
            if (!game[x][y - i].bord && !axisYMin) {
                if (!aiNext) game[x][y - i].box.dataset.dot = 1
                nextMove.push({
                    x : x,
                    y : y - i,
                })
            } else if (game[x][y - i].player !== game[x][y].player && !axisYMin) {
                if (!aiNext) game[x][y - i].box.dataset.dot = 2
                nextMove.push({
                    x : x,
                    y : y - i,
                })
                axisYMin = true
            } else {
                axisYMin = true
            }
        }
    }
}

function kingMove(x, y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const xNow = x + i
            const yNow = y + j
            if (xNow >= 0 && xNow < 8 && yNow >= 0 && yNow < 8) {
                if (!game[xNow][yNow].bord) {
                    if (!aiNext) game[xNow][yNow].box.dataset.dot = 1
                    nextMove.push({
                        x : xNow,
                        y : yNow,
                    })
                } else if (game[xNow][yNow].player !== game[x][y].player) {
                    if (!aiNext) game[xNow][yNow].box.dataset.dot = 2
                    nextMove.push({
                        x : xNow,
                        y : yNow,
                    })
                }
            }

        }
    }
}

function setKill(x, y) {
    if (!aiNext) game[x][y].box.dataset.dot = 2
    nextMove.push({
        x,
        y,
    })
}

function checkMate(x, y) {
    let posKingX
    let posKingY

    let opposite = gameTurn === 0 ? 1 : 0

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (game[i][j].bord === 'king' && game[i][j].player === opposite) {
                posKingX = i
                posKingY = j
                break
            }
        }
    }

    nextMoveCheck = []

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (game[i][j].bord === 'pawn' && game[i][j].player === gameTurn) checkPawn(i, j)
            else if (game[i][j].bord === 'knight' && game[i][j].player === gameTurn) checkKnight(i, j) 
            else if (game[i][j].bord === 'bishop' && game[i][j].player === gameTurn) checkBishop(i, j) 
            else if (game[i][j].bord === 'rook' && game[i][j].player === gameTurn) checkRook(i, j) 
            else if (game[i][j].bord === 'king' && game[i][j].player === gameTurn) checkMateKing(i, j) 
            else if (game[i][j].bord === 'queen' && game[i][j].player === gameTurn) {
                checkRook(i, j) 
                checkBishop(i, j) 
            }

        }
    }

    // console.log({nextMoveCheck})
    
    for (let i = 0; i < nextMoveCheck.length; i++) {
        // if (nextMoveCheck[i].x === posKingX && nextMoveCheck[i].y === posKingY) return 
        if (nextMoveCheck[i].x === posKingX && nextMoveCheck[i].y === posKingY) {

            checkView('Check')
            break
            // if (checkKingCantMove(posKingX, posKingY, opposite)) checkView('Checkmate')
            // else checkView('Check')
            // break
        } 
    }

    // return false


}

function checkView(status) {
    snackbar.innerText = ''
    const color = gameTurn === 1 ? 'white' : 'black'
    snackbar.className = 'show'
    snackbar.innerText = status
    snackbar.classList.add(color)
    setTimeout(function(){ 
        snackbar.className = snackbar.className.replace('show', '')
        if (snackbar.classList.contains(color)) snackbar.classList.remove(color)
    }, 3000)
}

function checkPawn(x, y) {
    // For Player 1
    // console.log(gameTurn)
    if (gameTurn) {
        // Check if stil in board
        if (x - 1 >= 0 && y - 1 >= 0) {
            if (game[x - 1][y - 1].player !== game[x][y].player && game[x - 1][y - 1].player !== null) {
                nextMoveCheck.push({
                    x : x - 1,
                    y : y - 1
                })
            }
        }
        // Check if stil in board
        if (x - 1 >= 0 && y + 1 < 8) {
            if (game[x - 1][y + 1].player !== game[x][y].player && game[x - 1][y + 1].player !== null) {
                nextMoveCheck.push({
                    x : x - 1, 
                    y : y + 1
                })
            }
        }
      
    // For Player 0 
    } else {
        // check Kill
        if (x + 1 < 8 && y + 1 < 8) {

            if (game[x + 1][y + 1].player !== game[x][y].player && game[x + 1][y + 1].player !== null) {
                nextMoveCheck.push({
                    x : x + 1, 
                    y : y + 1
                })
            }
        }

        // Check if stil in board
        if (x + 1 < 8 && y - 1 >= 0) {
            if (game[x + 1][y - 1].player !== game[x][y].player && game[x + 1][y - 1].player !== null) {
                nextMoveCheck.push({
                    x : x + 1,
                    y : y - 1
                })
            }
        }
    }
}

function checkKnight(x, y) {
    const knightMove = [
        [x - 1, y - 2], [x - 1, y + 2], [x - 2, y - 1], [x - 2, y + 1],
        [x + 1, y - 2], [x + 1, y + 2], [x + 2, y + 1], [x + 2, y - 1]
    ]

    knightMove.forEach(function(move) {
        const i = move[0]
        const j = move[1]
        if (i >= 0 && i < 8 && j >= 0 && j < 8) {
            if (game[i][j].player !== game[x][y].player && game[i][j].player !== null) {
                nextMoveCheck.push({
                    x : i,
                    y : j,
                })
            }
        }

    })
}

function checkBishop(x, y) {
    let plusPlus = false
    let plusMinus = false
    let minusPlus = false
    let minusMinus = false

    for (let i = 1; i < 8; i++) {
        if (x + i >= 0 && x + i < 8 && y + i >= 0 && y + i < 8) {
            if (!game[x + i][y + i].bord && !plusPlus) {
                
            } else if (game[x + i][y + i].player !== game[x][y].player && !plusPlus) {
                nextMoveCheck.push({
                    x : x + i,
                    y : y + i,
                })
                plusPlus = true
            } else {
                plusPlus = true
            }
        }
        if (x + i >= 0 && x + i < 8 && y - i >= 0 && y - i < 8) {
            if (!game[x + i][y - i].bord && !plusMinus) {
                
            } else if (game[x + i][y - i].player !== game[x][y].player && !plusMinus) {
                nextMoveCheck.push({
                    x : x + i,
                    y : y - i,
                })
                plusMinus = true
            } else {
                plusMinus = true
            }
        }
        if (x - i >= 0 && x - i < 8 && y + i >= 0 && y + i < 8) {
            if (!game[x - i][y + i].bord && !minusPlus) {
                
            } else if (game[x - i][y + i].player !== game[x][y].player && !minusPlus) {
                nextMoveCheck.push({
                    x : x - i,
                    y : y + i,
                })
                minusPlus = true
            } else {
                minusPlus = true
            }
        }
        if (x - i >= 0 && x - i < 8 && y - i >= 0 && y - i < 8) {
            if (!game[x - i][y - i].bord && !minusMinus) {
                
            } else if (game[x - i][y - i].player !== game[x][y].player && !minusMinus) {
                nextMoveCheck.push({
                    x : x - i,
                    y : y - i,
                })
                minusMinus = true
            } else {
                minusMinus = true
            }
        }
    }
}

function checkRook(x, y) {
    let axisXMin = false
    let axisXPlus = false
    let axisYMin = false
    let axisYPlus = false

    for (let i = 1; i < 8; i++) {
        if (x + i < 8) {
            if (!game[x + i][y].bord && !axisXPlus) {
        
            } else if (game[x + i][y].player !== game[x][y].player && !axisXPlus) {
                nextMoveCheck.push({
                    x : x + i,
                    y : y,
                })
                axisXPlus = true
            } else axisXPlus = true
            
        }
        if (x - i >= 0) {
            if (!game[x - i][y].bord && !axisXMin) {
                
            } else if (game[x - i][y].player !== game[x][y].player && !axisXMin) {
                nextMoveCheck.push({
                    x : x - i,
                    y : y,
                })
                axisXMin = true
            } else axisXMin = true
        }
        if (y + i < 8) {
            if (!game[x][y + i].bord && !axisYPlus) {
                
            } else if (game[x][y + i].player !== game[x][y].player && !axisYPlus) {
                nextMoveCheck.push({
                    x : x,
                    y : y + i,
                })
                axisYPlus = true
            } else axisYPlus = true
            
        }
        if (y - i >= 0) {
            if (!game[x][y - i].bord && !axisYMin) {
                
            } else if (game[x][y - i].player !== game[x][y].player && !axisYMin) {
                nextMoveCheck.push({
                    x : x,
                    y : y - i,
                })
                axisYMin = true
            } else axisYMin = true
        }
    }
}

function checkMateKing(x, y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const xNow = x + i
            const yNow = y + j
            if (xNow >= 0 && xNow < 8 && yNow >= 0 && yNow < 8) {
                if (!game[xNow][yNow].bord) {
                } else if (game[xNow][yNow].player !== game[x][y].player) {
                    nextMoveCheck.push({
                        x : xNow,
                        y : yNow,
                    })
                }
            }

        }
    }
}

function checkKingCantMove(x, y, opposite) {


    console.log('Jalan', x, y)
    let availMove = 0
    let killedMove = 0
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const xNow = x + i
            const yNow = y + j
            if (xNow >= 0 && xNow < 8 && yNow >= 0 && yNow < 8) {
                // console.log(xNow, yNow)

                if (game[xNow][yNow].player !== opposite) {
                    availMove++
                    for (let k = 0; k < nextMoveCheck.length; k++) {
                        if (xNow === nextMoveCheck[k].x && yNow === nextMoveCheck[k].y) {
                            killedMove++  
                        }
                    }
                }

            }

        }
    }
    // console.log({availMove, killedMove})
    return availMove === killedMove
}


function countScore(color) {
    let score = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (game[i][j].player === color) score += scoreArmy[game[i][j].bord]
        }
    }

    return score
}

function countScoreAB(board, color) {
    let score = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].player === color) score += scoreArmy[game[i][j].bord]
        }
    }

    return score
}

function getPieces(board, color) {
    const pieces = []
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].player === color) pieces.push(board[i][j])
        }
    }
    return pieces
}