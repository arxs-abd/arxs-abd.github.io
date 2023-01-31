const container = document.querySelector('.container')
const containerResult = document.querySelector('.container-result')
const solveButton = document.querySelector('#solve')
let grid = []
let result = []
const max = 9
const template = false

const temp = [
    [3, 1, 6, 5, 0, 8, 4, 0, 0],
    [5, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 8, 7, 0, 0, 0, 0, 3, 1],
    [0, 0, 3, 0, 1, 0, 0, 8, 0],
    [9, 0, 0, 8, 6, 3, 0, 0, 5],
    [0, 5, 0, 0, 9, 0, 6, 0, 0],
    [1, 3, 0, 0, 0, 0, 2, 5, 0],
    [0, 0, 0, 0, 0, 0, 0, 7, 4],
    [0, 0, 5, 2, 0, 6, 3, 0, 0],
]
const color = [
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
]
// 1 2 3 4
// 4 3 2 1
// 3 1 4 2
// 2 4 1 3

for (let i = 0; i < max; i++) {
    const rowBox = document.createElement('div')
    const rowResultBox = document.createElement('div')
    rowBox.classList.add('row')
    rowResultBox.classList.add('row')
    const resultBox = []
    for (let j = 0; j < max; j++) {
        const input = document.createElement('input')
        input.type = 'text'
        if (template) input.value = temp[i][j] || '' 
        input.dataset.i = i
        input.dataset.j = j
        rowBox.appendChild(input)

        const box = document.createElement('div')
        box.classList.add('box')
        box.style.backgroundColor = color[i][j] ? 'darkgray' : ''
        // box.style.color = color[i][j] ? 'red' : ''
        rowResultBox.appendChild(box)
        resultBox.push(box)


    }
    container.appendChild(rowBox)
    containerResult.appendChild(rowResultBox)
    result.push(resultBox)
}

solveButton.addEventListener('click', async function() {
    grid = []
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
            result[i][j].innerText = input.value
            result[i][j].style.color = input.value !== '' ? 'red' : ''
    }
    // printGrid()
    if (await solveSudoku(grid, 0, 0)) console.log('Selesai')
    else console.log('No Solution')
})

async function solveSudoku(grid, col, row) {
    if (col === max - 1 && row === max) return true
    
    if (row === max) {
        col++
        row = 0
    }
    
    // console.log(col, row)

    if (grid[col][row].value !== 0) return await solveSudoku(grid, col, row + 1)

    for (let num = 1; num <= max; num++) {
        await sleep(10)
        if (validNumber(col, row, num)) {
            grid[col][row].value = num
            result[col][row].innerText = num
            if (await solveSudoku(grid, col, row + 1)) return true
        }
        // await sleep(10)
        result[col][row].innerText = ''
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

    for (let i = 0; i < max; i++) if (grid[col][i].value === value) return false
    for (let i = 0; i < max; i++) if (grid[i][row].value === value) return false

    // let startRow = (Math.floor(row / 3)) * 3
    // let startCol = (Math.floor(col / 3)) * 3
    let startCol = col - col % 3
    let startRow = row - row % 3
         
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // console.log(grid[i + startCol][j + startRow], value)
            if (grid[i + startCol][j + startRow].value === value) return false
        }
    }
    return true
}

function printGrid() {

    for (let i = 0; i < max; i++) {
        for (let j = 0; j < max; j++) {

        }
    }
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}