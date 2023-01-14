const container = document.querySelector('.container')
const containerBox = document.querySelector('.box-container')

const row = 39
const col = 61
// const row = 101
// const col = 101
const path = []
const grid = []
const frontier = []

let wall = 800

let start
let end

let openSet = []
let closedSet = []

// Draw Grid
for (let i = 0; i < row; i++) {
    const rowBox = document.createElement('div')
    const rowGrid = []
    rowBox.classList.add('row')
    for (let j = 0; j < col; j++) {
        const box = document.createElement('div')
        box.classList.add('box')
        box.dataset.i = i
        box.dataset.j = j
        box.style.backgroundColor = 'black'
        rowBox.appendChild(box)
        rowGrid.push({
            box,
            i,
            j,
            f : 0,
            g : 0,
            h : 0,
            isWall : true,
            previous : undefined,
            neighbors : undefined
        })
    }
    containerBox.appendChild(rowBox)
    grid.push(rowGrid)
}

document.addEventListener('keypress', function(e) {
    // console.log(e.key)
    if (e.key === 'Enter') generateMaze()
    else if (e.key === ' ') solveMaze()
})


async function generateMaze() {
    let x = 0
    let y = 0
    
    grid[x][y].isWall = false
    grid[x][y].box.style.backgroundColor = ''
    
    frontier.push(...getNeighbor(grid[x][y], true))

    while (frontier.length > 0) {

        const frontierCell = frontier[getRandom(0, frontier.length - 1)]
        const neighbor = getNeighbor(frontierCell, false)
    
        if (neighbor.length > 0) {
            const randNeighbor = neighbor[getRandom(0, neighbor.length - 1)]
    
            const xx = (randNeighbor.i + frontierCell.i) / 2
            const yy = (randNeighbor.j + frontierCell.j) / 2
    
            frontierCell.isWall = false
            grid[xx][yy].isWall = false
            randNeighbor.isWall = false
    
            frontierCell.box.style.backgroundColor = ''
            grid[xx][yy].box.style.backgroundColor = ''
            randNeighbor.box.style.backgroundColor = ''
        }
        const addFrontier = getNeighbor(frontierCell, true)
        // console.log(addFrontier)
        removeFromArray(frontier, frontierCell)
        frontier.push(...addFrontier)
        // console.log(frontier)
        // if (numberCount === 1000) break
        // else numberCount++
        await sleep(10)
    }

    console.log('selesai Membuat Maze')
}

async function solveMaze() {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (grid[i][j].isWall) grid[i][j].box.style.backgroundColor = 'black'
            grid[i][j].neighbors = getNeighbors(grid[i][j])
        }
    }

    start = grid[0][0]
    end = grid[row - 1][col - 1]
    
    openSet.push(start)
    while (openSet.length > 0) {
    
        let winner = 0
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i
            }
        }
        const current = openSet[winner]
    
        if (current === end) {
        // if (current.i === end.i && current.j === end.j) {
            let temp = current
            path.push(current)
            while (temp.previous) {
                path.push(temp.previous)
                temp = temp.previous
            }
            
            path.forEach(element => {
                // await sleep(100)
                element.box.style.backgroundColor = 'yellow'
            })
    
            console.log('Selesai Mencari Jalan')
            break
        }
    
        removeFromArray(openSet, current)
        closedSet.push(current)
    
        const neighbors = current.neighbors
    
        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i]
            if (!closedSet.includes(neighbor)) {
                const tempG = current.g + 1 
                let newPath = false
    
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG
                        newPath = true
                    }
                }
                else {
                    neighbor.g = tempG
                    newPath = true
                    openSet.push(neighbor)
                }
                if (newPath) {
                    neighbor.h = heuresticDistance(neighbor, end)
                    neighbor.f = neighbor.g + neighbor.h
                    neighbor.previous = current
                }
    
            }   
        }
        
        await sleep(10)
        closedSet.forEach(element => {
            element.box.style.backgroundColor = 'red'
        })
        
        openSet.forEach(element => {
            element.box.style.backgroundColor = 'green'
        })
        // openSet.forEach(element => {
        //     element.box.style.backgroundColor = 'green'
        // })
    }
}

function getNeighbor(cell, isWall) {
    const result = []
    const x = cell.i
    const y = cell.j
    const possible = [[x - 2, y], [x, y - 2], [x + 2, y], [x, y + 2]]
    // const possible = [[x - 1, y], [x, y - 1], [x + 1, y], [x, y + 1]]


    for (let i = 0; i < possible.length; i++) {
        const newX = possible[i][0]
        const newY = possible[i][1]
        if (newX >= 0 && newX < row && newY >= 0 && newY < col && grid[newX][newY].isWall === isWall) {
            result.push(grid[newX][newY])
        }
    }
    return result
}

function getNeighbors(current) {
    const result = []
    const x = current.i
    const y = current.j
    // const possible = [[x - 1, y], [x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x + 1, y], [x, y + 1], [x - 1, y + 1], [x + 1, y + 1]]
    const possible = [[x - 1, y], [x, y - 1], [x + 1, y], [x, y + 1]]

    for (let i = 0; i < possible.length; i++) {
        const newX = possible[i][0]
        const newY = possible[i][1]
        if (newX >= 0 && newX < row && newY >= 0 && newY < col && !grid[newX][newY].isWall) {
            result.push(grid[newX][newY])
        }
    }
    return result
}

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

function removeFromArray(arr, elm) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].i === elm.i && arr[i].j === elm.j) arr.splice(i, 1)
    }
}

function heuresticDistance(from, to) {
    // return Math.abs(from.i - to.i) + Math.abs(from.j - to.j)
    const x = Math.pow(to.i - from.i)
    const y = Math.pow(to.j - from.j)
    return Math.sqrt(x + y)
}