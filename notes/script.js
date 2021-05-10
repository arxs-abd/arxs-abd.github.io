// All Button Functionallity
const createNotes = document.querySelector('button#createNotes')
const changeNotes = document.querySelector('button#changeNotes')
const deleteNotes = document.querySelector('button#deleteNotes')

// All Container
const containerItems = document.querySelector('.container-items')
const containerResult = document.querySelector('.container-result')

// Result Container
const titleResult = document.querySelector('.container-result h1') 

// All Notes
let allNotes = []

// Temporary Notes
let note = {
    title : null,
    content : null
}

if (localStorage.getItem('notes') !== null) {
    allNotes = JSON.parse(localStorage.getItem('notes'))
    renderItems()
} 

// Eventlistener for Create Notes
createNotes.addEventListener('click', function() {
    // console.log('create');

    // Insert Titile Of Notes
    const title = window.prompt('Enter Your Notes Title : ')
    if (title === null) return
    note.title = title
    titleResult.innerHTML = note.title

    // Check Textare
    if (document.querySelector('textarea') !== null) document.querySelector('textarea').remove()
    // Append Textarea
    const textArea = document.createElement('textarea')
    if (document.querySelector('.container-result span')) document.querySelector('.container-result span').remove() ;
    containerResult.append(textArea)
})

// Eventlistener for Change Notes
changeNotes.addEventListener('click', function() {
    // console.log('change');
    
    // Check Condition
    const contetnFromTextArea = document.querySelector('textarea')
    // Save
    if (contetnFromTextArea !== null) {
        
        // Get Content and Save Them
        note.content = contetnFromTextArea.value
        contetnFromTextArea.remove()
        
        // Save Note to Local Storage
        if (note.title === null) {
            note.title = titleResult.innerHTML
            allNotes.forEach(function(notes, i) {
                if (notes.title === note.title) notes.content = note.content
            })
            localStorage.setItem('notes', JSON.stringify(allNotes))
            const spanContenResult = document.createElement('span')
            spanContenResult.innerText = note.content
            containerResult.append(spanContenResult)
            containerItems.innerHTML = ''
            renderItems()
            return
        }
        allNotes.push(note) 
        localStorage.setItem('notes', JSON.stringify(allNotes))
    
        // Show the Note
        const spanContenResult = document.createElement('span')
        spanContenResult.innerText = note.content
        containerResult.append(spanContenResult)
    
        // Append to Container Items
        const newItems = document.createElement('div')
        newItems.classList.add('items', 'selected')
        const titleH3 = document.createElement('h3')
        titleH3.innerText = note.title
        newItems.append(titleH3)
        const spanContent = document.createElement('span')
        spanContent.innerText = note.content
        newItems.append(spanContent)
        containerItems.append(newItems)
    
        // Listener For Items
        newItems.addEventListener('click', function() {
            // console.log('tes');
            reRenderSelected()
            this.classList.add('selected')
    
            forItemsClick(this)
            
        })
    
        // Re Render UI
        const allNoteItems = document.querySelectorAll('.items')
        // console.log(allNoteItems);
        allNoteItems.forEach(function(items, i) {
            if (i != allNoteItems.length - 1) {
                if (items.classList.contains('selected')) {
                    items.classList.remove('selected')
                }
            }
        })
    } else if (contetnFromTextArea === null) {  // Change
        // Remove Old Span
        // if (note.title == null || document.querySelector('.selected' === null)) return
        document.querySelector('.container-result span').remove()

        // Get Selected Items
        const selectedNotes = document.querySelector('.selected')
        

        const textAreContent = document.createElement('textarea')
        textAreContent.innerText = findByTitle(selectedNotes.firstChild.innerHTML)
        containerResult.append(textAreContent)
    }



    note = {
        title : null,
        content : null
    }
})

// Eventlistener for Delete Notes
deleteNotes.addEventListener('click', function() {
    // console.log('delete');
    if (document.querySelector('.selected') === null) return
    const itemsNote = document.querySelector('.selected')
    itemsNote.remove()
    console.log(itemsNote.firstChild.innerHTML);
    let newAllNotes = []
    allNotes.forEach(function(notes, i) {
        if (notes.title !== itemsNote.firstChild.innerHTML) newAllNotes.push(notes)
    })
    allNotes = newAllNotes
    localStorage.setItem('notes', JSON.stringify(allNotes))

    titleResult.innerHTML = `Click Create To Make a Notes`
    document.querySelector('.container-result span').innerHTML = ``
})

// Function
function renderItems() {
    
    allNotes.forEach(function(items, i) {
        // Append to Container Items
        const newItems = document.createElement('div')
        newItems.classList.add('items')
        const titleH3 = document.createElement('h3')
        titleH3.innerText = items.title
        newItems.append(titleH3)
        const spanContent = document.createElement('span')
        spanContent.innerText = (items.content.length > 100) ?  items.content.substring(0, 100) + '...' : items.content
        newItems.append(spanContent)
        containerItems.append(newItems)
    })

    const allINotesItems = document.querySelectorAll('.items')
    allINotesItems.forEach(function(items, i) {
        items.addEventListener('click', function() {
            reRenderSelected()
            items.classList.add('selected')
            forItemsClick(this)
        })
    })
}

function reRenderSelected() {
    const allINotesItems = document.querySelectorAll('.items') 
    allINotesItems.forEach(function(items, i) {
        if (items.classList.contains('selected')) items.classList.remove('selected')
    })
}

function forItemsClick(items) {
    // Clean the Container
    if (document.querySelector('.container-result textarea') !== null) {
        document.querySelector('textarea').remove()
        containerResult.append(document.createElement('span'))
    }
    const spanForContent = document.querySelector('.container-result span')
    titleResult.innerHTML = items.firstChild.innerHTML
    spanForContent.innerHTML = findByTitle(items.firstChild.innerHTML)
}

function findByTitle(title) {
    let result = '';
    allNotes.forEach(function(items, i) {
        if (items.title === title) {
            result = items.content
            return result
        }
    })
    return result
}