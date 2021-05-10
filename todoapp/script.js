const todoInput = document.querySelector('#inputList')
const listContainer = document.querySelector('#list')
const clearList = document.querySelector('#clearList')

let todo = [];
if (localStorage.getItem('todo') != null) {
    todo = JSON.parse(localStorage.getItem('todo'))
}
console.log(todo);

render()

clearList.addEventListener('click', function() {
    todo = []
    localStorage.setItem('todo', JSON.stringify(todo))
    const allTodo = document.querySelectorAll('.list-item')
    console.log(allTodo);
    allTodo.forEach(function(todo, index){
        todo.remove()
    })
})

todoInput.addEventListener('keyup', function(e) {
    let list = todoInput.value
    if (e.keyCode != 13) return
    if (list === '') return
    
    const newListDiv = document.createElement('div');
    newListDiv.classList.add('list-item')

    const newList = document.createElement('h2')
    newList.innerText = list
    newListDiv.append(newList)

    const buttonCheck = document.createElement('button')
    buttonCheck.innerText = '✔'
    buttonCheck.classList.add('checklist')
    newListDiv.append(buttonCheck)
    const buttonDelete = document.createElement('button')
    buttonDelete.innerText = 'X'
    buttonDelete.classList.add('delete')
    newListDiv.append(buttonDelete)
    
    listContainer.append(newListDiv)
    todoInput.value = ''

    let newTodo = {
        todo : list,
        check : false
    }
    todo.push(newTodo)
    localStorage.setItem('todo', JSON.stringify(todo))
    
    buttonCheck.addEventListener('click', function() {
        const listSibling = buttonCheck.previousSibling;
        listSibling.classList.toggle('finish')
        console.log(getIndexOf(todo, list));
        todo[getIndexOf(todo, list)].check = !todo[getIndexOf(todo, list)].check
        localStorage.setItem('todo', JSON.stringify(todo))

    })

    buttonDelete.addEventListener('click', function() {
        const items = buttonDelete.parentElement;
        items.remove();
        todo = delArray(todo, getIndexOf(todo, list))
        localStorage.setItem('todo', JSON.stringify(todo))
    })
});

function render() {
    todo.forEach(function(to, i) {
        const newListDiv = document.createElement('div');
        newListDiv.classList.add('list-item')

        const newList = document.createElement('h2')
        newList.innerText = to.todo
        newListDiv.append(newList)

        const buttonCheck = document.createElement('button')
        buttonCheck.innerText = '✔'
        buttonCheck.classList.add('checklist')
        newListDiv.append(buttonCheck)
        if (to.check) {
            const o = buttonCheck.previousSibling
            o.classList.add('finish')
        } 
        
        const buttonDelete = document.createElement('button')
        buttonDelete.innerText = 'X'
        buttonDelete.classList.add('delete')
        newListDiv.append(buttonDelete)

        listContainer.append(newListDiv)       

        buttonCheck.addEventListener('click', function() {
            const sibling = buttonCheck.previousElementSibling
            sibling.classList.toggle('finish')
            todo[i].check = !todo[i].check
            localStorage.setItem('todo', JSON.stringify(todo))
        })
        buttonDelete.addEventListener('click', function() {
            const items = buttonDelete.parentElement;
            items.remove()
            todo = delArray(todo, i)
            localStorage.setItem('todo', JSON.stringify(todo))
        })
    })
}

function delArray(arr, index) {
    let result = [];
    arr.forEach(function(a, i) {
        if (index != i) result.push(a)
    })

    return result
}

function getIndexOf(arr, search) {
    let result;
    arr.forEach(function(a, i){
        if (a.todo === search) result = i
    })

    return result
}