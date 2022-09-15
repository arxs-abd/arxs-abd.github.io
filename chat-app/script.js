const login = document.querySelector('.user')
const containerUser = document.querySelector('.container-user')
const chatOutput = document.querySelector('.chat-output')
const inputMessage = document.querySelector('#text')
const sendMessageButton = document.querySelector('#send')
const channel = new BroadcastChannel('chat-channel')
const chatUser = document.querySelector('#user-to')
const chatStatus = document.querySelector('#user-to-status')

let statusLogin = false
let allUser = []
let userNow
let idChat = 0
let isLogin = false

let sendTo = ''
let conversation = []

// let conversation
// {
//     'sender' : 'id-sender',
//     'msg' : 'Isi Pesan',
//     'date' : 'Waktu'
// }

if (localStorage.getItem('chat-app-user') !== null) {
    allUser = JSON.parse(localStorage.getItem('chat-app-user'))
}
// user, id, pass

function addUser() {
    const user = {
        'username' : prompt('Input Username :'),
        'pass' : prompt('Input Username :'),
        'id' : Date.now(),
    }
    allUser.push(user)
    localStorage.setItem('chat-app-user', JSON.stringify(allUser))
}

window.onbeforeunload = function(e) {
    const msg = {
        'type' : 'offline',
        'id' : userNow.id
    }
    channel.postMessage(msg)
    channel.close()
}

login.addEventListener('click', function(e) {
    // if (login) {
    //     login = !login
    //     userNow = {}
    // }
    const userLogin = prompt('Input Username')
    const passLogin = prompt('Input Password')
    let isFail = true

    allUser.forEach(function(u, i) {
        if (u.username === userLogin) {
            if (u.pass === passLogin) {
                userNow = u
                login.innerHTML = u.username
                isFail = false
                isLogin = true
                const msg = {
                    'type' : 'online',
                    'id' : u.id
                }
                channel.postMessage(msg)
                return
            }
            return
        }
    })
    if (isFail) {
        alert('Username or Password is Wrong')
    } else {
        allUser.forEach(function(u, i) {
            if (u.username !== userLogin) {
                createUserChat(u)
            }
        })
    }


})

inputMessage.addEventListener('keyup', function(e) {
    // const msg = {
    //     type : 'status',
    //     id : userNow.id
    // }
    // channel.postMessage(msg)
    if (e.keyCode == 13) sendMessage(e)
})

sendMessageButton.addEventListener('click', function(e) {
    sendMessage(e)
})

channel.addEventListener('message', function(e) {
    if (!isLogin) return
    if (e.data.type === 'status') {

    } else if (e.data.type === 'online') {
        // console.log('Tes');
        const newStatus = document.querySelector(`[data-id*="${e.data.id}"]`)
        // console.log(newStatus);
        newStatus.nextSibling.innerText = 'Online'
        // console.log('object');
        const msg = {
            'type' : 'online-x',
            'id' : userNow.id,
        }
        channel.postMessage(msg)
    } else if (e.data.type === 'online-x') {
        const newStatus = document.querySelector(`[data-id*="${e.data.id}"]`)
        // newStatus.nextSibling.innerText = 'Online'
        console.log('TEs');
        chatStatus.innerText = 'Online'
    } else if (e.data.type === 'offline') {
        const newStatus = document.querySelector(`[data-id*="${e.data.id}"]`)
        newStatus.nextSibling.innerText = 'Offline'
    } else {
        // console.log(`${e.data.uid}  ${sendTo}`)
        conversation = JSON.parse(localStorage.getItem((`chat-conversation-${idChat}`)))
        if (e.data.receiver === userNow.id + '' && e.data.uid === sendTo) createChatByOtherUser(e.data)
    }
})

function sendMessage(e) {
    const date = new Date()
    const message = {
        'type' : 'msg',
        'user' : userNow.username,
        'uid' : userNow.id + '',
        'msg' : inputMessage.value,
        'receiver' : sendTo,
        'date' : `${date.getHours() < 9 ? '0' : ''}${date.getHours()}:${date.getMinutes() < 9 ? '0' : ''}${date.getMinutes()}`
    }
    inputMessage.value = ''
    const newMsgConversation = {
        'sender' : userNow.id,
        'msg' : message.msg,
        'date' : message.date
    }
    conversation.push(newMsgConversation)
    localStorage.setItem(`chat-conversation-${idChat}`, JSON.stringify(conversation))

    channel.postMessage(message)
    createChatByUser(message)
    // console.table(conversation)
}

// COMPONENTS

function createUserChat(user) {
    const div = document.createElement('div')
    div.classList.add('item-card')
    const spanUser = document.createElement('span')
    const spanStatus = document.createElement('span')
    const spanLastChat = document.createElement('span')
    
    spanUser.dataset.id = user.id
    spanUser.textContent = user.username

    spanStatus.classList.add('status')
    spanStatus.textContent = 'Offline'

    spanLastChat.classList.add('last-chat')
    const idConversation = Number(userNow.id) + Number(user.id)
    if (localStorage.getItem(`chat-conversation-${idConversation}`)) {
        // spanLastChat.textContent = JSON.parse(localStorage.getItem(`chat-conversation-${idConversation}`))[0].last().msg
        // console.log(JSON.parse(localStorage.getItem(`chat-conversation-${idConversation}`))[0])
        spanLastChat.textContent = JSON.parse(localStorage.getItem(`chat-conversation-${idConversation}`))[0].msg
    } else {
        spanLastChat.textContent = 'Chat Terakhirnya'
    }

    div.appendChild(spanUser)
    // div.appendChild(spanStatus)
    div.appendChild(spanLastChat)
    containerUser.appendChild(div)

    div.addEventListener('click', function() {
        reRenderSelected()
        sendTo = div.children[0].dataset.id
        this.classList.toggle('selected')
        idChat = Number(userNow.id) + Number(sendTo)
        chatUser.innerText = user.username


        if (localStorage.getItem(`chat-conversation-${idChat}`) !== null) {
            conversation = JSON.parse(localStorage.getItem((`chat-conversation-${idChat}`)))
        } else {
            conversation = []
        }
        renderChat(conversation)
        // console.log(userNow.id, sendTo);
    })
}

function renderChat(conv) {
    chatOutput.innerHTML = ''
    conv.forEach(function(c, i) {
        if (c.sender === userNow.id) {
            createChatByUser(c)
        } else {
            createChatByOtherUser(c)
        }
    })
}

function createChatByUser(msg) {
    const div = document.createElement('div')
    div.classList.add('chat', 'by-user')
    const divChat = document.createElement('div')
    divChat.classList.add('chat-text')
    const spanTxt = document.createElement('span')
    spanTxt.classList.add('chat-txt')
    spanTxt.textContent = msg.msg

    const spanDate = document.createElement('span')
    spanDate.classList.add('chat-date')
    spanDate.textContent = msg.date

    divChat.appendChild(spanTxt)
    divChat.appendChild(spanDate)
    div.appendChild(divChat)
    chatOutput.appendChild(div)
    chatOutput.scrollBy(0, chatOutput.clientHeight)
}

function createChatByOtherUser(msg) {
    const div = document.createElement('div')
    div.classList.add('chat')
    const divChat = document.createElement('div')
    divChat.classList.add('chat-text')
    const spanTxt = document.createElement('span')
    spanTxt.classList.add('chat-txt')
    spanTxt.textContent = msg.msg

    const spanDate = document.createElement('span')
    spanDate.classList.add('chat-date')
    spanDate.textContent = msg.date

    divChat.appendChild(spanTxt)
    divChat.appendChild(spanDate)
    div.appendChild(divChat)
    chatOutput.appendChild(div)
    chatOutput.scrollBy(0, chatOutput.clientHeight)
}

// Utility

function reRenderSelected() {
    const allUser = document.querySelectorAll('.item-card') 
    allUser.forEach(function(items, i) {
        if (items.classList.contains('selected')) items.classList.remove('selected')
    })
}