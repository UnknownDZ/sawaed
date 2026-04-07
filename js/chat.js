// ========== نظام الشات المتكامل ==========
let currentUser = null;
let currentConversation = null;
let messagesInterval = null;
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

// تحميل البيانات عند بدء الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = JSON.parse(userStr);
    
    await loadConversations();
    startPolling();
});

// تحميل قائمة المحادثات
async function loadConversations() {
    const conversations = await getUserConversations(currentUser.email);
    const container = document.getElementById('conversationsList');
    
    if (conversations.length === 0) {
        container.innerHTML = '<div class="empty-state">📭 لا توجد محادثات بعد<br>ابدأ محادثة من صفحة الإعلان أو البروفايل</div>';
        return;
    }
    
    container.innerHTML = '';
    for (const conv of conversations) {
        const otherEmail = conv.participants.find(e => e !== currentUser.email);
        const otherUser = await getUserByEmail(otherEmail);
        const isActive = currentConversation && currentConversation.id === conv.id;
        
        const div = document.createElement('div');
        div.className = `conversation-item ${isActive ? 'active' : ''}`;
        div.innerHTML = `
            <div class="conv-avatar">👤</div>
            <div class="conv-info">
                <div class="conv-name">${otherUser?.name || otherEmail}</div>
                <div class="conv-last-message">${conv.lastMessage || 'بدء المحادثة'}</div>
            </div>
            <div class="conv-time">${new Date(conv.lastMessageTime).toLocaleTimeString('ar')}</div>
        `;
        div.onclick = () => openConversation(conv, otherUser);
        container.appendChild(div);
    }
}

// فتح محادثة
async function openConversation(conversation, otherUser) {
    currentConversation = conversation;
    
    // تحديث الواجهة
    document.querySelectorAll('.conversation-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.conversation-item')?.classList.add('active');
    
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.innerHTML = `
        <div class="chat-header">
            <h3>${otherUser?.name || otherUser?.email}</h3>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input-area">
            <input type="text" id="messageInput" placeholder="اكتب رسالتك...">
            <button id="sendMessageBtn">📤 إرسال</button>
            <button id="voiceRecordBtn" class="voice-record-btn">🎙️</button>
        </div>
    `;
    
    await loadMessages();
    
    document.getElementById('sendMessageBtn').onclick = sendTextMessage;
    document.getElementById('voiceRecordBtn').onclick = toggleVoiceRecording;
    document.getElementById('messageInput').onkeypress = (e) => {
        if (e.key === 'Enter') sendTextMessage();
    };
}

// تحميل الرسائل
async function loadMessages() {
    if (!currentConversation) return;
    
    const messages = await getMessages(currentConversation.id);
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    container.innerHTML = '';
    for (const msg of messages) {
        const isSent = msg.sender === currentUser.email;
        const div = document.createElement('div');
        div.className = `message ${isSent ? 'message-sent' : 'message-received'}`;
        
        if (msg.audio) {
            div.innerHTML = `
                <div class="message-audio">
                    <button onclick="playAudio('${msg.audio}')">▶️</button>
                    <span>رسالة صوتية</span>
                </div>
                <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString('ar')}</div>
            `;
        } else {
            div.innerHTML = `
                <div>${msg.text}</div>
                <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString('ar')}</div>
            `;
        }
        container.appendChild(div);
    }
    container.scrollTop = container.scrollHeight;
}

// إرسال رسالة نصية
async function sendTextMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text || !currentConversation) return;
    
    const otherEmail = currentConversation.participants.find(e => e !== currentUser.email);
    await sendMessage(currentConversation.id, currentUser.email, otherEmail, text);
    
    input.value = '';
    await loadMessages();
    await loadConversations();
}

// التسجيل الصوتي
async function toggleVoiceRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
        mediaRecorder.onstop = async () => {
            const blob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(blob);
            
            const otherEmail = currentConversation.participants.find(e => e !== currentUser.email);
            await sendMessage(currentConversation.id, currentUser.email, otherEmail, '', audioUrl);
            
            stream.getTracks().forEach(track => track.stop());
            await loadMessages();
            await loadConversations();
            
            const btn = document.getElementById('voiceRecordBtn');
            if (btn) {
                btn.textContent = '🎙️';
                btn.style.background = '';
            }
        };
        
        mediaRecorder.start();
        isRecording = true;
        
        const btn = document.getElementById('voiceRecordBtn');
        btn.textContent = '⏹️ إيقاف';
        btn.style.background = '#e53e3e';
        
    } catch (err) {
        alert('لا يمكن الوصول إلى الميكروفون');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
    }
}

function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}

// تحديث تلقائي للرسائل كل 3 ثواني
function startPolling() {
    if (messagesInterval) clearInterval(messagesInterval);
    messagesInterval = setInterval(async () => {
        if (currentConversation) {
            await loadMessages();
            await loadConversations();
        }
    }, 3000);
}