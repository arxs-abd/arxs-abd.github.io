const addCols = document.querySelector('#addCols')
const addRows = document.querySelector('#addRows')

// Get Cols and Rows From Local Storage
let col = (localStorage.getItem('table-col') != null) ? JSON.parse(localStorage.getItem('table-col')) : ['No']
let row = (localStorage.getItem('table-row') != null) ? JSON.parse(localStorage.getItem('table-row')) : []
console.log(col, row)

// fetch("https://api.db-ip.com/v2/free/self")
// .then(result => result.json())
// .then(result => console.log(result.stateProv)
// )

// Render Col
const parentAddCols = addCols.parentNode.parentNode
col.forEach(function(c, i) {
    if (i != 0) {
        const newTh = document.createElement('th')
        let newCol = c
        newTh.innerHTML = newCol
        parentAddCols.insertBefore(newTh, addCols.parentNode)
    }
})

// Render Rows
const getCols = document.querySelector('tr.header')
const forNewElement = document.querySelector('tbody')
const lastRows = document.querySelector('tr.rows > th#lastRow')
lastRow.setAttribute('colspan', getCols.children.length)

row.forEach(function(r, i) {
    let header = getHeader()
    const newTr = document.createElement('tr')
    header.forEach((h) => {
        const newTh = document.createElement('th')
        let data = r[h] != undefined ? r[h] : ''
        newTh.innerText = data
        newTr.appendChild(newTh)
    })
    const newTh = document.createElement('th')
    newTh.id = 'lastCol'
    const changeButton = document.createElement('button')
    changeButton.innerText = 'Change'
    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Delete'
    newTh.appendChild(changeButton)
    newTh.appendChild(deleteButton)
    newTr.appendChild(newTh)

    forNewElement.insertBefore(newTr, lastRows.parentNode)

    deleteButton.addEventListener('click', function() {
        newTr.remove()
        let newRow = row.filter(function(r, index) {
            return i != index
        })
        localStorage.setItem('table-row', JSON.stringify(newRow))
    })

    changeButton.addEventListener('click', function() {
        const allData = this.parentNode.parentNode
        let newH = getHeader()
        allData.childNodes.forEach(function(data, i) {
            if (i != allData.childNodes.length - 1) {
                data.innerText = prompt(`Insert New ${newH[i]}`, data.innerText)
            }
        })
    })

})



addCols.addEventListener('click', function(e) {
    // Add New Rows
    const parentAddCols = addCols.parentNode.parentNode

    const newTh = document.createElement('th')
    let newCol = window.prompt('Insert New Rows')
    newTh.innerHTML = newCol
    parentAddCols.insertBefore(newTh, addCols.parentNode)

    newTh.addEventListener('dblclick', function(e) {
        const newInput = document.createElement('input')
        newInput.value = newTh.innerText
        newTh.innerText = ''
        newTh.appendChild(newInput)

        newInput.addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                newTh.innerText = this.value
            }
        })
    })


    // Update Last Rows
    const getCols = document.querySelector('tr.header')
    const lastRow = document.querySelector('th#lastRow')
    lastRow.setAttribute('colspan', getCols.children.length)

    // Rerender Table
    const allRows = document.querySelectorAll('tr.rows')
    allRows.forEach(function(row, i) {
        if (i != allRows.length - 1) {
            // Create New Cols
            const newTh = document.createElement('th')
            row.insertBefore(newTh, row.lastChild)
        }
    })

    // Update Add Col
    col.push(newCol)
    localStorage.setItem('table-col', JSON.stringify(col))
    
})

addRows.addEventListener('click', function(e) {
    let newRow = {}
    // Get Last Row
    const lastRows = document.querySelector('tr.rows > th#lastRow')
    const forNewElement = document.querySelector('tbody')

    // Create New Row
    let header = getHeader()
    
    const newTr = document.createElement('tr')
    newTr.className = 'rows'
    for (let i = 0; i < header.length; i++) {
        const newTh = document.createElement('th')
        let data = window.prompt(`Input For Coloumns ${header[i]}`)
        newRow[header[i]] = data
        newTh.innerText = data
        newTr.appendChild(newTh)
    }

    // Update Rows
    row.push(newRow)
    localStorage.setItem('table-row', JSON.stringify(row))
    console.log(row)
    

    const newTh = document.createElement('th')
    newTh.id = 'lastCol'
    const changeButton = document.createElement('button')
    changeButton.innerText = 'Change'
    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Delete'
    newTh.appendChild(changeButton)
    newTh.appendChild(deleteButton)
    newTr.appendChild(newTh)

    forNewElement.insertBefore(newTr, lastRows.parentNode)

    deleteButton.addEventListener('click', function() {
        newTr.remove()
    })

    changeButton.addEventListener('click', function() {
        const allData = this.parentNode.parentNode
        let newH = getHeader()
        allData.childNodes.forEach(function(data, i) {
            if (i != allData.childNodes.length - 1) {
                data.innerText = prompt(`Insert New ${newH[i]}`, data.innerText)
            }
        })
    })

})

function getHeader() {
    let header = []

    const allHeader = document.querySelector('tr.header')
    // console.log(allHeader.childNodes);
    allHeader.childNodes.forEach(function(h, i) {
        if (h.innerText !== undefined && h.innerText !== 'Add Cols') header.push(h.innerText)
    })
    return header
}