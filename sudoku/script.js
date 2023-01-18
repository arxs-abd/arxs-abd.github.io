const container = document.querySelector('.container')
const solveButton = document.querySelector('#solve')
const grid = []
const max = 4

const temp = [
    [1, 0, 3, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 2],
    [2, 4, 1, 0],
]
// 1 2 3 4
// 4 3 2 1
// 3 1 4 2
// 2 4 1 3

for (let i = 0; i < max; i++) {
    const rowBox = document.createElement('div')
    rowBox.classList.add('row')
    for (let j = 0; j < max; j++) {
        const input = document.createElement('input')
        input.type = 'text'
        input.value = temp[i][j] || '' 
        input.dataset.i = i
        input.dataset.j = j
        rowBox.appendChild(input)
    }
    container.appendChild(rowBox)
}

solveButton.addEventListener('click', function() {
    for (let i = 0; i < max; i++) {
        const rowGrid = []
        for (let j = 0; j < max; j++) {
            const newGrid = []
            rowGrid.push(newGrid)
        }
        grid.push(rowGrid)
    }

    const allInput = document.querySelectorAll('input')
    for (const input of allInput) {
            const i = Number(input.dataset.i)
            const j = Number(input.dataset.j)
            grid[i][j] = {
                i,
                j,
                value : Number(input.value),
            }
    }
    // printGrid()
    if (solveSudoku(grid, 0, 0)) printGrid()
    else console.log('No Solution')
})

function solveSudoku(grid, col, row) {
    if (col === max - 1 && row === max) return true
    
    if (row === max) {
        col++
        row = 0
    }
    
    // console.log(col, row)

    if (grid[col][row].value !== 0) return solveSudoku(grid, col, row + 1)

    for (let num = 1; num <= max; num++) {
        
        if (validNumber(col, row, num)) {
            grid[col][row].value = num
            if (solveSudoku(grid, col, row + 1)) return true
        }
        grid[col][row].value = 0
    }
    return false
}

function findUnAssigned(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].value === 0) return true
        }
    }

    return false
}

function validNumber(col, row , value) {

    for (let i = 0; i < grid.length; i++) {
        if (grid[col][i].value === value) return false
    }
    for (let i = 0; i < grid.length; i++) {
        if (grid[i][row].value === value) return false
    }

    return true
}

function printGrid() {
    for (let i = 0; i < max; i++) {
        console.log(grid[i])
    }
}