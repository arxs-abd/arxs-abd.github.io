const containerBoard = document.querySelector('.container-board')
const html = document.querySelector('html')

// Note
// Baru bisa pindahkan Suda Bisa Pindahkan Bishop
const army = {
    rook : '♜', // Done
    knight : '♞', // Done
    king : '♚', // Done
    queen : '♛', // Done
    bishop : '♝', // Done
    pawn : '♟', // Done
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

        const data = {
            bord : null,
            player : null,
            box : box,
            x : i,
            y : j
        }

        box.dataset.board = boxColor % 2
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

        box.addEventListener('click', function(e) {
            e.preventDefault()
            
            const x = Number(box.dataset.x)
            const y = Number(box.dataset.y)

            if (checkNextMove(x, y)) {
                removeSelected()
                move(x, y)

                nextMove = []
                gameTurn = (gameTurn === 1) ? 0 : 1
                html.style.animation = (gameTurn === 1 ? 'black-white' : 'white-black') + ' 1000ms'
                html.style.backgroundColor = gameTurn === 1 ? '#FFFDD2' : '#222831'
            } else {
                removeSelected()
                // console.log(game[x][y])
    
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
            // check Kill
            // Check if stil in board
            if (x - 1 >= 0 && y - 1 >= 0) {
                if (game[x - 1][y - 1].player !== game[x][y].player && game[x - 1][y - 1].player !== null) {
                    game[x - 1][y - 1].box.dataset.dot = 2
                    nextMove.push({
                        x : x - 1,
                        y : y - 1,
                    })
                }
            }
            // Check if stil in board
            if (x - 1 >= 0 && y + 1 < 8) {
                if (game[x - 1][y + 1].player !== game[x][y].player && game[x - 1][y + 1].player !== null) {
                    game[x - 1][y + 1].box.dataset.dot = 2
                    nextMove.push({
                        x : x - 1,
                        y : y + 1,
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
            // check Kill
            // Check if stil in board
            if (x + 1 < 8 && y + 1 < 8) {

                if (game[x + 1][y + 1].player !== game[x][y].player && game[x + 1][y + 1].player !== null) {
                    game[x + 1][y + 1].box.dataset.dot = 2
                    nextMove.push({
                        x : x + 1,
                        y : y + 1,
                    })
                }
            }

            // Check if stil in board
            if (x + 1 < 8 && y - 1 >= 0) {
                if (game[x + 1][y - 1].player !== game[x][y].player && game[x + 1][y - 1].player !== null) {
                    game[x + 1][y - 1].box.dataset.dot = 2
                    nextMove.push({
                        x : x + 1,
                        y : y - 1,
                    })
                }
            }
        }

    } else if (data.bord === 'knight') {
            const knightMove = [
                [x - 1, y - 2], [x - 1, y + 2], [x - 2, y - 1], [x - 2, y + 1],
                [x + 1, y - 2], [x + 1, y + 2], [x + 2, y + 1], [x + 2, y - 1]
            ]

            knightMove.forEach(function(move) {
                const i = move[0]
                const j = move[1]
                if (i >= 0 && i < 8 && j >= 0 && j < 8) {
                    if (!game[i][j].bord) {
                        game[i][j].box.dataset.dot = 1
                        nextMove.push({
                            x : i,
                            y : j,
                         })
                    } else {
                        if (game[i][j].player !== game[x][y].player && game[i][j].player !== null) {
                            game[i][j].box.dataset.dot = 2
                            nextMove.push({
                                x : i,
                                y : j,
                            })
                        }
                    }
                }

            })

    } else if (data.bord === 'bishop') {
        bishopMove(x, y)
    } else if (data.bord === 'rook') {
        rookMove(x, y)
    } else if (data.bord === 'queen') {
        rookMove(x, y)
        bishopMove(x, y)
    } else if (data.bord === 'king') {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                const xNow = x + i
                const yNow = y + j
                if (xNow >= 0 && xNow < 8 && yNow >= 0 && yNow < 8) {
                    if (!game[xNow][yNow].bord) {
                        game[xNow][yNow].box.dataset.dot = 1
                        nextMove.push({
                            x : xNow,
                            y : yNow,
                        })
                    } else if (game[xNow][yNow].player !== game[x][y].player) {
                        game[xNow][yNow].box.dataset.dot = 2
                        nextMove.push({
                            x : xNow,
                            y : yNow,
                        })
                    }
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

function bishopMove(x, y) {
    let plusPlus = false
    let plusMinus = false
    let minusPlus = false
    let minusMinus = false

    for (let i = 1; i < 8; i++) {
        if (x + i >= 0 && x + i < 8 && y + i >= 0 && y + i < 8) {
            if (!game[x + i][y + i].bord && !plusPlus) {
                game[x + i][y + i].box.dataset.dot = 1
                nextMove.push({
                    x : x + i,
                    y : y + i,
                })
            } else if (game[x + i][y + i].player !== game[x][y].player && !plusPlus) {
                game[x + i][y + i].box.dataset.dot = 2
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
                game[x + i][y - i].box.dataset.dot = 1
                nextMove.push({
                    x : x + i,
                    y : y - i,
                })
            } else if (game[x + i][y - i].player !== game[x][y].player && !plusMinus) {
                game[x + i][y - i].box.dataset.dot = 2
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
                game[x - i][y + i].box.dataset.dot = 1
                nextMove.push({
                    x : x - i,
                    y : y + i,
                })
            } else if (game[x - i][y + i].player !== game[x][y].player && !minusPlus) {
                game[x - i][y + i].box.dataset.dot = 2
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
                game[x - i][y - i].box.dataset.dot = 1
                nextMove.push({
                    x : x - i,
                    y : y - i,
                })
            } else if (game[x - i][y - i].player !== game[x][y].player && !minusMinus) {
                game[x - i][y - i].box.dataset.dot = 2
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
                game[x + i][y].box.dataset.dot = 1
                nextMove.push({
                    x : x + i,
                    y : y,
                })
            } else if (game[x + i][y].player !== game[x][y].player && !axisXPlus) {
                game[x + i][y].box.dataset.dot = 2
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
                game[x - i][y].box.dataset.dot = 1
                nextMove.push({
                    x : x - i,
                    y : y,
                })
            } else if (game[x - i][y].player !== game[x][y].player && !axisXMin) {
                game[x - i][y].box.dataset.dot = 2
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
                game[x][y + i].box.dataset.dot = 1
                nextMove.push({
                    x : x,
                    y : y + i,
                })
            } else if (game[x][y + i].player !== game[x][y].player && !axisYPlus) {
                game[x][y + i].box.dataset.dot = 2
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
                game[x][y - i].box.dataset.dot = 1
                nextMove.push({
                    x : x,
                    y : y - i,
                })
            } else if (game[x][y - i].player !== game[x][y].player && !axisYMin) {
                game[x][y - i].box.dataset.dot = 2
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