const container = document.querySelector('.container')
const containerBox = document.querySelector('.box-container')

const row = 40
const col = 60
// const row = 20
// const col = 30
const path = []
const grid = []
let wall = 800
let start
let end

// const spot = {
//     f : 0, 
//     g : 0, // Jarak
//     h: 0,
// }

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
        rowBox.appendChild(box)
        rowGrid.push({
            box,
            i : i,
            j : j,
            f : 0,
            g : 0,
            h : 0,
            isWall : false,
            previous : undefined,
            neighbors : undefined
        })
        // box.addEventListener('click', function() {
        //     // console.log({...grid[i][j]})
        //     box.style.backgroundColor = 'black'
        //     grid[i][j].isWall = true
        // })
    }
    containerBox.appendChild(rowBox)
    grid.push(rowGrid)
}
// const allBox = document.querySelectorAll('.box')

// allBox.forEach(box => {
//     box.addEventListener('click', function() {
//         const {i, j} = box.dataset
//         box.style.backgroundColor = 'black'
//         grid[i][j].isWall = true
//     })
// })

start = grid[getRandom(0, row - 1)][getRandom(0, col - 1)]
end = grid[getRandom(0, row - 1)][getRandom(0, col - 1)]
// start = grid[0][0]
// end = grid[row - 1][col - 1]

start.box.innerText = 'S'
start.box.style.color = 'blue'
end.box.innerText = 'F'
end.box.style.color = 'blue'
// Kasih Rintangan

const tempWall = []
while (tempWall.length < wall) {
    const x = getRandom(0, row - 1)
    const y = getRandom(0, col - 1)

    if (!grid[x][y].isWall) {
        grid[x][y].isWall = true
        tempWall.push('*')
    }
}

start.isWall = false
end.isWall = false

for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
        if (grid[i][j].isWall) grid[i][j].box.style.backgroundColor = 'black'
        grid[i][j].neighbors = getNeighbors(grid[i][j])
    }
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') run()
})

async function run() {
    
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
    
            console.log('Selesai')
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

function removeFromArray(arr, elm) {
    // return arr.filter(function(a) {
    //     a.i !== elm.i && a.j !== elm.y
    // })

    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === elm) arr.splice(i, 1)
    }
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

function heuresticDistance(from, to) {
    // return Math.abs(from.i - to.i) + Math.abs(from.j - to.j)
    const x = Math.pow(to.i - from.i)
    const y = Math.pow(to.j - from.j)
    return Math.sqrt(x + y)
}

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}