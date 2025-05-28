document.addEventListener('DOMContentLoaded', function() {
    // SDG color mapping (for icon and accent)
    const sdgColors = {
        1: { main: '#E5243B', dark: '#C01031' }, 
        2: { main: '#DDA63A', dark: '#B78728' },
        3: { main: '#4C9F38', dark: '#3A7C2A' }, 
        4: { main: '#C5192D', dark: '#9E1424' },
        5: { main: '#FF3A21', dark: '#D42D19' }, 
        6: { main: '#26BDE2', dark: '#1E9BBB' },
        7: { main: '#FCC30B', dark: '#D9A609' }, 
        8: { main: '#A21942', dark: '#801334' },
        9: { main: '#FD6925', dark: '#DC571D' }, 
        10: { main: '#DD1367', dark: '#B10F53' },
        11: { main: '#FD9D24', dark: '#D9841D' }, 
        12: { main: '#BF8B2E', dark: '#9C7225' },
        13: { main: '#3F7E44', dark: '#2F6033' }, 
        14: { main: '#0A97D9', dark: '#0878AD' },
        15: { main: '#56C02B', dark: '#449D22' }, 
        16: { main: '#00689D', dark: '#00507A' },
        17: { main: '#19486A', dark: '#123552' }
    };

    // Get SDG info from localStorage or fallback
    const sdgNumber = localStorage.getItem('currentSDG') || '1';
    const sdgTitle = localStorage.getItem('sdgTitle') || 'No Poverty';
    const sdgDescription = localStorage.getItem('sdgDescription') || 'End poverty in all its forms everywhere';
    const sdgColor = (sdgColors[sdgNumber] || sdgColors[1]).main;
    const sdgColorDark = (sdgColors[sdgNumber] || sdgColors[1]).dark;

    // Set theme colors for CSS variables
    document.documentElement.style.setProperty('--sdg-color', sdgColor);
    document.documentElement.style.setProperty('--sdg-color-dark', sdgColorDark);

    // Set SDG info in the header
    document.title = `SDG ${sdgNumber}: ${sdgTitle} - Sustaina AI`;
    document.getElementById('sdg-number').textContent = sdgNumber;
    document.getElementById('sdg-title').textContent = `SDG ${sdgNumber}: ${sdgTitle}`;
    document.getElementById('sdg-icon').style.backgroundColor = '#fff';
    document.getElementById('sdg-number').style.color = sdgColor;

    // Set welcome message
    document.getElementById('welcome-title').textContent = `Welcome to the SDG ${sdgNumber}: ${sdgTitle}`;
    document.getElementById('welcome-description').textContent = sdgDescription;

    // Load chat history if exists
    loadChatHistory();

    // Chat logic
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const clearBtn = document.getElementById('clear-chat');

    // Helper: scroll to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Helper: create message bubble
    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = text;
        msgDiv.appendChild(bubble);
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    // Typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.id = 'typing-indicator';
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = `
            <span class="dot-flashing"></span>
        `;
        typingDiv.appendChild(bubble);
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    // Save chat history
    function saveChatHistory() {
        localStorage.setItem(`chatHistory-${sdgNumber}`, chatMessages.innerHTML);
    }

    // Load chat history
    function loadChatHistory() {
        const chatHistory = localStorage.getItem(`chatHistory-${sdgNumber}`);
        if (chatHistory) {
            chatMessages.innerHTML = chatHistory;
        }
    }

    // Clear chat
    function clearChat() {
        chatMessages.innerHTML = `
            <div class="welcome-message" id="welcome-message">
                <h2 id="welcome-title">Welcome to the SDG ${sdgNumber}: ${sdgTitle}</h2>
                <p id="welcome-description">${sdgDescription}</p>
            </div>
        `;
        localStorage.removeItem(`chatHistory-${sdgNumber}`);
    }

    // Send message handler
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;
        addMessage('user', text);
        userInput.value = '';
        showTypingIndicator();

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    sdg: sdgNumber
                })
            });
            const data = await response.json();
            hideTypingIndicator();
            addMessage('bot', data.reply || "Sorry, I couldn't get a response.");
            saveChatHistory();
        } catch (err) {
            hideTypingIndicator();
            addMessage('bot', "Sorry, there was a network error.");
            saveChatHistory();
        }
    });

    // Enter to send
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Clear chat button
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            clearChat();
        }
    });

    // Add typing indicator CSS if not present
    if (!document.getElementById('dot-flashing-style')) {
        const style = document.createElement('style');
        style.id = 'dot-flashing-style';
        style.innerHTML = `
        .dot-flashing {
            position: relative;
            width: 1em;
            height: 1em;
            border-radius: 50%;
            background-color: var(--sdg-color, #00689D);
            color: var(--sdg-color, #00689D);
            animation: dotFlashing 1s infinite linear alternate;
            display: inline-block;
        }
        @keyframes dotFlashing {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
        `;
        document.head.appendChild(style);
    }
});
