const loadMore = document.querySelector('#load-more')
const body = document.body


loadMore.addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) {
        const newChild = document.createElement('div')
        newChild.classList.add('card')
        body.insertBefore(newChild, loadMore)
    }
})