marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
  gfm: true,
  breaks: true,
  sanitize: true,
});

// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatContainer = document.getElementById('chatContainer');
const newChatBtn = document.getElementById('newChatBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const chatHistory = document.querySelector('.chat-history');
const modelSelect = document.getElementById('modelSelect');

// State
let currentChatId = null;
let chats = {};

// Initialize
loadChatsFromStorage();
if (Object.keys(chats).length === 0) {
  createNewChat();
} else {
  const lastChatId = Object.keys(chats)[Object.keys(chats).length - 1];
  loadChat(lastChatId);
}

// Auto-resize textarea
messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto';
  messageInput.style.height = messageInput.scrollHeight + 'px';

  // Enable/disable send button
  sendBtn.disabled = messageInput.value.trim() === '';
});

// Send message on Enter (Shift+Enter for new line)
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Send button click
sendBtn.addEventListener('click', sendMessage);

// New chat button
newChatBtn.addEventListener('click', () => {
  createNewChat();
  // Close sidebar on mobile after creating new chat
  if (window.innerWidth <= 768) {
    sidebar.classList.add('hidden');
  }
});

// Menu toggle for mobile
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && !sidebar.classList.contains('hidden')) {
      sidebar.classList.add('hidden');
    }
  }
});

// Suggestion cards click
document.querySelectorAll('.suggestion-card').forEach((card) => {
  card.addEventListener('click', () => {
    const text = card.querySelector('span').textContent;
    messageInput.value = text;
    messageInput.dispatchEvent(new Event('input'));
    messageInput.focus();
  });
});

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove('hidden');
  }
});

// Create new chat
function createNewChat() {
  const chatId = 'chat_' + Date.now();
  currentChatId = chatId;

  chats[chatId] = {
    id: chatId,
    title: 'New conversation',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveChatsToStorage();
  renderChatHistory();

  // Clear chat area
  messages.innerHTML = '';
  welcomeScreen.style.display = 'block';
  messageInput.value = '';
  messageInput.style.height = 'auto';
  sendBtn.disabled = true;
}

// Load chat
function loadChat(chatId) {
  if (!chats[chatId]) return;

  currentChatId = chatId;
  messages.innerHTML = '';

  const chat = chats[chatId];

  if (chat.messages.length === 0) {
    welcomeScreen.style.display = 'block';
  } else {
    welcomeScreen.style.display = 'none';
    chat.messages.forEach((msg) => {
      addMessageToDOM(msg.text, msg.role, false);
    });
    scrollToBottom();
  }
  //   applyHighlighting(chatContainer);
  //   addCopyButtonsToCodeBlocks(chatContainer);

  renderChatHistory();
}

// Delete chat
function deleteChat(chatId, event) {
  event.stopPropagation();

  if (confirm('Delete this conversation?')) {
    delete chats[chatId];
    saveChatsToStorage();

    if (currentChatId === chatId) {
      if (Object.keys(chats).length === 0) {
        createNewChat();
      } else {
        const firstChatId = Object.keys(chats)[0];
        loadChat(firstChatId);
      }
    } else {
      renderChatHistory();
    }
  }
}

// Render chat history in sidebar
function renderChatHistory() {
  const chatArray = Object.values(chats).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Group chats by date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = {
    today: [],
    yesterday: [],
    previous7Days: [],
    previous30Days: [],
    older: [],
  };

  chatArray.forEach((chat) => {
    const chatDate = new Date(chat.updatedAt);
    const diffTime = today - chatDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (chatDate.toDateString() === today.toDateString()) {
      groups.today.push(chat);
    } else if (chatDate.toDateString() === yesterday.toDateString()) {
      groups.yesterday.push(chat);
    } else if (diffDays <= 7) {
      groups.previous7Days.push(chat);
    } else if (diffDays <= 30) {
      groups.previous30Days.push(chat);
    } else {
      groups.older.push(chat);
    }
  });

  let historyHTML = '';

  if (groups.today.length > 0) {
    historyHTML += '<div class="history-section"><h3>Today</h3>';
    groups.today.forEach((chat) => {
      historyHTML += createHistoryItem(chat);
    });
    historyHTML += '</div>';
  }

  if (groups.yesterday.length > 0) {
    historyHTML += '<div class="history-section"><h3>Yesterday</h3>';
    groups.yesterday.forEach((chat) => {
      historyHTML += createHistoryItem(chat);
    });
    historyHTML += '</div>';
  }

  if (groups.previous7Days.length > 0) {
    historyHTML += '<div class="history-section"><h3>Previous 7 Days</h3>';
    groups.previous7Days.forEach((chat) => {
      historyHTML += createHistoryItem(chat);
    });
    historyHTML += '</div>';
  }

  if (groups.previous30Days.length > 0) {
    historyHTML += '<div class="history-section"><h3>Previous 30 Days</h3>';
    groups.previous30Days.forEach((chat) => {
      historyHTML += createHistoryItem(chat);
    });
    historyHTML += '</div>';
  }

  if (groups.older.length > 0) {
    historyHTML += '<div class="history-section"><h3>Older</h3>';
    groups.older.forEach((chat) => {
      historyHTML += createHistoryItem(chat);
    });
    historyHTML += '</div>';
  }

  chatHistory.innerHTML = historyHTML;

  // Add click listeners
  document.querySelectorAll('.history-item').forEach((item) => {
    const chatId = item.dataset.chatId;
    item.addEventListener('click', () => {
      loadChat(chatId);
      // Close sidebar on mobile after selecting chat
      if (window.innerWidth <= 768) {
        sidebar.classList.add('hidden');
      }
    });
  });

  // Add delete button listeners
  document.querySelectorAll('.delete-chat-btn').forEach((btn) => {
    const chatId = btn.dataset.chatId;
    btn.addEventListener('click', (e) => deleteChat(chatId, e));
  });
}

// Create history item HTML
function createHistoryItem(chat) {
  const isActive = chat.id === currentChatId ? 'active' : '';
  const title = chat.title || 'New conversation';

  return `
        <div class="history-item ${isActive}" data-chat-id="${chat.id}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span class="history-title">${title}</span>
            <button class="delete-chat-btn" data-chat-id="${chat.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `;
}

// Main send message function
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  // Hide welcome screen
  welcomeScreen.style.display = 'none';

  // Add user message
  addMessageToDOM(text, 'user', true);

  // Save to chat
  chats[currentChatId].messages.push({
    text: text,
    role: 'user',
    timestamp: new Date().toISOString(),
  });

  // Update chat title if first message
  // if (chats[currentChatId].messages.length === 1) {
  //   chats[currentChatId].title = text.substring(0, 50) + (text.length > 50 ? '...' : '');
  // }

  // chats[currentChatId].updatedAt = new Date().toISOString();
  // saveChatsToStorage();
  // renderChatHistory();

  // Clear input
  messageInput.value = '';
  messageInput.style.height = 'auto';
  sendBtn.disabled = true;

  // Show typing indicator
  const typingId = showTypingIndicator();

  // Call API with streaming
  try {
    // Remove typing indicator before streaming starts
    removeTypingIndicator(typingId);

    // Create empty assistant message for streaming
    const streamMessageId = createStreamingMessage();

    // Stream the response
    const messageData = chats[currentChatId].messages.map((msg) => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.text,
    }));
    await streamGeminiAPI(trimMessagesByCharacterCount(messageData), streamMessageId);

    // Get final text from the message
    const finalText = document.getElementById(streamMessageId).querySelector('.message-text').innerHTML;

    // Insert New Chat
    if (chats[currentChatId].messages.length === 1) {
      chats[currentChatId].title = text.substring(0, 50) + (text.length > 50 ? '...' : '');
    }

    chats[currentChatId].updatedAt = new Date().toISOString();
    saveChatsToStorage();
    renderChatHistory();

    // Save assistant message
    chats[currentChatId].messages.push({
      text: finalText,
      role: 'assistant',
      timestamp: new Date().toISOString(),
    });

    chats[currentChatId].updatedAt = new Date().toISOString();
    saveChatsToStorage();
    renderChatHistory();
  } catch (error) {
    removeTypingIndicator(typingId);
    const errorMsg = 'Sorry, something went wrong. Please try again.';
    addMessageToDOM(errorMsg, 'assistant', true);
    console.error('Error:', error);
  }

  // Scroll to bottom
  scrollToBottom();
}

// Add message to DOM
function addMessageToDOM(text, role, animate = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  if (animate) {
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
  }

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'user' ? 'U' : 'G';

  const content = document.createElement('div');
  content.className = 'message-content';

  const messageText = document.createElement('div');
  messageText.className = 'message-text';
  messageText.innerHTML = text;

  content.appendChild(messageText);
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  messages.appendChild(messageDiv);

  if (animate) {
    setTimeout(() => {
      messageDiv.style.transition = 'all 0.3s ease';
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    }, 10);
  }

  addCopyButtonsToCodeBlocks(messageDiv);

  scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
  const id = 'typing-' + Date.now();
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message assistant';
  messageDiv.id = id;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = 'G';

  const content = document.createElement('div');
  content.className = 'message-content';

  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

  content.appendChild(typingIndicator);
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  messages.appendChild(messageDiv);
  scrollToBottom();

  return id;
}

// Remove typing indicator
function removeTypingIndicator(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}

// Scroll to bottom
function scrollToBottom() {
  setTimeout(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 100);
}

// Create streaming message container
function createStreamingMessage() {
  const id = 'stream-' + Date.now();
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message assistant';
  messageDiv.id = id;
  messageDiv.style.opacity = '0';
  messageDiv.style.transform = 'translateY(10px)';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = 'G';

  const content = document.createElement('div');
  content.className = 'message-content';

  const messageText = document.createElement('div');
  messageText.className = 'message-text';
  messageText.textContent = '';

  // Add cursor for streaming effect
  const cursor = document.createElement('span');
  cursor.className = 'streaming-cursor';
  cursor.textContent = '▊';
  messageText.appendChild(cursor);

  content.appendChild(messageText);
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  messages.appendChild(messageDiv);

  // Animate in
  setTimeout(() => {
    messageDiv.style.transition = 'all 0.3s ease';
    messageDiv.style.opacity = '1';
    messageDiv.style.transform = 'translateY(0)';
  }, 10);

  scrollToBottom();

  return id;
}

// Update streaming message
function updateStreamingMessage(messageId, text) {
  const messageDiv = document.getElementById(messageId);
  if (messageDiv) {
    const messageText = messageDiv.querySelector('.message-text');
    const cursor = messageText.querySelector('.streaming-cursor');

    // Update text but keep cursor
    messageText.innerHTML = text;
    if (cursor) {
      messageText.appendChild(cursor);
    }

    applyHighlighting(messageDiv);
    addCopyButtonsToCodeBlocks(messageDiv);

    scrollToBottom();
  }
}

// Finish streaming message (remove cursor)
function finishStreamingMessage(messageId) {
  const messageDiv = document.getElementById(messageId);
  if (messageDiv) {
    const cursor = messageDiv.querySelector('.streaming-cursor');
    if (cursor) {
      cursor.remove();
    }
  }
}

// LocalStorage functions
function saveChatsToStorage() {
  try {
    localStorage.setItem('gemini_chats', JSON.stringify(chats));
    localStorage.setItem('gemini_current_chat', currentChatId);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

function loadChatsFromStorage() {
  try {
    const storedChats = localStorage.getItem('gemini_chats');
    const storedCurrentChat = localStorage.getItem('gemini_current_chat');

    if (storedChats) {
      chats = JSON.parse(storedChats);
    }

    if (storedCurrentChat && chats[storedCurrentChat]) {
      currentChatId = storedCurrentChat;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    chats = {};
  }
}

// SETUP STREAMING FUNCTION
async function streamGeminiAPI(userMessage, messageId) {
  const API_URL = 'https://text.pollinations.ai/openai';

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer arwjVIyZyjplOPN5`,
    },
    body: JSON.stringify({
      model: modelSelect.value,
      messages: userMessage,
      stream: true,
    }),
  });
  console.log(modelSelect.value);

  if (!response.ok) throw new Error('Network response was not ok');

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('data: ')) {
        const jsonStr = line.replace('data: ', '');
        if (jsonStr === '[DONE]') continue;

        try {
          const json = JSON.parse(jsonStr);
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            // fullText += marked.parse(currentAiContent);
            updateStreamingMessage(messageId, marked.parse(fullText));
            // hljs.highlightAll();
          }
        } catch (e) {
          // console.warn('Error parsing JSON line:', e);
        }
      }
    }

    buffer = lines[lines.length - 1];
  }
  finishStreamingMessage(messageId);
}

// Fungsi helper untuk menerapkan highlighting pada elemen tertentu
function applyHighlighting(container) {
  container.querySelectorAll('pre code').forEach((block) => {
    block.removeAttribute('data-highlighted');
    hljs.highlightElement(block);
  });
}

function addCopyButtonsToCodeBlocks(container) {
  // Cari semua elemen <pre> di dalam container
  container.querySelectorAll('pre').forEach((preBlock) => {
    // Pastikan tombol copy belum ditambahkan sebelumnya
    if (preBlock.querySelector('.copy-code-btn')) return;

    const codeElement = preBlock.querySelector('code');
    if (codeElement) {
      const codeText = codeElement.textContent;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">content_copy</span> Copy code';

      copyBtn.onclick = function (e) {
        e.stopPropagation();
        copyCode(this, codeText);
      };

      preBlock.prepend(copyBtn);
    }
  });
}

window.copyCode = (button, code) => {
  navigator.clipboard
    .writeText(code)
    .then(() => {
      // Feedback visual
      button.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">check</span> Copied!';
      setTimeout(() => {
        button.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">content_copy</span> Copy code';
      }, 2000);
    })
    .catch((err) => {
      console.error('Gagal menyalin:', err);
    });
};

function trimMessagesByCharacterCount(messages, maxChars = 5000) {
  let totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);

  // Kalau total karakter masih di bawah batas, langsung return
  if (totalChars <= maxChars) {
    return messages;
  }

  // Loop untuk hapus pesan dari awal sampai totalnya di bawah batas
  let trimmedMessages = [...messages];
  while (totalChars > maxChars && trimmedMessages.length > 0) {
    const removedMsg = trimmedMessages.shift(); // hapus pesan paling awal
    totalChars -= removedMsg.content.length; // kurangi total karakter
  }

  return trimmedMessages;
}
