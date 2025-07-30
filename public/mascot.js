// Mascot AI Page JavaScript

// DOM Elements
const loadingEl = document.getElementById('loading');
const mainContentEl = document.getElementById('main-content');
const userNameEl = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const schoolNameEl = document.getElementById('school-name');
const aiAssistantNameEl = document.getElementById('ai-assistant-name');
const mascotPageTitleEl = document.getElementById('mascot-page-title');
const mascotHeaderIconEl = document.getElementById('mascot-header-icon');
const chatMessagesEl = document.getElementById('chat-messages');
const chatInputEl = document.getElementById('chat-input');
const sendMessageBtn = document.getElementById('send-message-btn');

// Chat state
let currentInstitution = null;
let currentMascot = null;
let chatHistory = [];
let scrollToBottomTimeout = null;

// Initialize the page
async function initMascot() {
    try {
        console.log('🔐 Checking authentication...');
        
        // Check authentication
        const profileResponse = await fetch('/api/user/profile');
        console.log('🔐 Profile response status:', profileResponse.status);
        
        if (!profileResponse.ok) {
            console.log('❌ Authentication failed, redirecting to login');
            window.location.href = '/';
            return;
        }
        
        const profile = await profileResponse.json();
        console.log('✅ User profile:', profile);
        
        // Update user name
        userNameEl.textContent = `${profile.name || 'User'} (${profile.canvas_email || profile.email || 'No email'})`;
        
        // Update mascot navigation button with institution info
        updateMascotNavButton();
        
        // Analyze school and mascot
        await analyzeSchoolAndMascot(profile);
        
        // Initialize chat
        initializeChat();
        
        // Hide loading and show content
        loadingEl.style.display = 'none';
        mainContentEl.style.display = 'block';
        
    } catch (error) {
        console.error('❌ Error initializing mascot page:', error);
        loadingEl.innerHTML = '<p>Error loading page. Please try again.</p>';
    }
}

// Update mascot navigation button with institution info
async function updateMascotNavButton() {
    try {
        const mascotNavBtn = document.getElementById('mascot-nav-btn');
        if (!mascotNavBtn) {
            console.log('Mascot nav button not found');
            return;
        }
        
        // Fetch institution info from server
        const response = await fetch('/api/institution-info');
        if (response.ok) {
            const institutionData = await response.json();
            console.log('🎓 Updating mascot nav button with:', institutionData);
            
            // Update the button text with the mascot name
            if (institutionData.mascot_name) {
                mascotNavBtn.innerHTML = `<i class="fas fa-magic"></i> ${institutionData.mascot_name}`;
                console.log('✅ Updated mascot nav button to:', institutionData.mascot_name);
            }
        } else {
            console.log('⚠️ Could not fetch institution info for nav button');
        }
    } catch (error) {
        console.error('Error updating mascot nav button:', error);
    }
}

// Analyze school and mascot
async function analyzeSchoolAndMascot(profile) {
    try {
        console.log('🔍 Starting school and mascot analysis...');
        
        // Fetch institution data from server
        const response = await fetch('/api/institution-info');
        if (response.ok) {
            const institutionData = await response.json();
            console.log('📊 Received institution data:', institutionData);
            
            currentInstitution = institutionData.institution;
            currentMascot = institutionData.mascot;
            
            // Update page elements
            updateSchoolInfo(institutionData);
            
        } else {
            console.log('⚠️ Could not fetch institution data, using fallback');
            // Fallback to domain-based detection
            const domain = profile.canvas_domain || 'unknown';
            const institutionData = {
                institution: 'Unknown University',
                mascot: 'Unknown Mascot',
                mascot_name: 'AI Assistant',
                domain: domain
            };
            updateSchoolInfo(institutionData);
        }
        
    } catch (error) {
        console.error('❌ Error analyzing school and mascot:', error);
    }
}

// Update school information
function updateSchoolInfo(institutionData) {
    console.log('🎯 Updating school info with:', institutionData);
    
    // Update school name
    if (schoolNameEl) {
        schoolNameEl.textContent = institutionData.institution || 'Unknown University';
    }
    
    // Update AI assistant name
    if (aiAssistantNameEl) {
        aiAssistantNameEl.textContent = institutionData.mascot_name || 'AI Assistant';
    }
    
    // Update page title
    if (mascotPageTitleEl && institutionData.mascot_name) {
        mascotPageTitleEl.textContent = institutionData.mascot_name;
        console.log('🎯 Updating page title to:', institutionData.mascot_name);
    }
    
    // Update header icon based on mascot
    if (mascotHeaderIconEl) {
        const iconClass = getMascotIcon(institutionData.mascot);
        mascotHeaderIconEl.className = `fas ${iconClass}`;
    }
}

// Get appropriate icon for mascot
function getMascotIcon(mascot) {
    if (!mascot) return 'fa-magic';
    
    const mascotLower = mascot.toLowerCase();
    if (mascotLower.includes('buckeye') || mascotLower.includes('brutus')) return 'fa-leaf';
    if (mascotLower.includes('wolverine')) return 'fa-paw';
    if (mascotLower.includes('eagle')) return 'fa-dove';
    if (mascotLower.includes('tiger')) return 'fa-paw';
    if (mascotLower.includes('bear')) return 'fa-paw';
    if (mascotLower.includes('lion')) return 'fa-paw';
    if (mascotLower.includes('hawk')) return 'fa-dove';
    if (mascotLower.includes('cardinal')) return 'fa-dove';
    
    return 'fa-magic';
}

// Initialize chat functionality
function initializeChat() {
    // Add event listeners
    sendMessageBtn.addEventListener('click', sendMessage);
    chatInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Add welcome message
    addWelcomeMessage();
}

// Add welcome message
function addWelcomeMessage() {
    const mascotName = currentMascot || 'AI Assistant';
    const institution = currentInstitution || 'your school';
    
    const welcomeMessage = `
        <div class="chat-message assistant">
            <div class="message-avatar assistant">
                <i class="fas ${getMascotIcon(currentMascot)}"></i>
            </div>
            <div class="message-bubble assistant">
                <div class="welcome-message">
                    <h4>👋 Hello! I'm ${mascotName}</h4>
                    <p>I'm your AI assistant from ${institution}.</p>
                    <p>Ask me anything about:</p>
                    <p>• School traditions and history</p>
                    <p>• Campus life and activities</p>
                    <p>• Academic resources and tips</p>
                    <p>• General questions and advice</p>
                </div>
            </div>
        </div>
    `;
    
    chatMessagesEl.innerHTML = welcomeMessage;
    scrollToBottom();
}

// Send message
async function sendMessage() {
    const message = chatInputEl.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    chatInputEl.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addMessage(response, 'assistant');
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
}

// Add message to chat with performance optimization
function addMessage(text, sender) {
    // Create message element with better performance
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${sender}`;
    
    const icon = document.createElement('i');
    if (sender === 'user') {
        icon.className = 'fas fa-user';
    } else {
        icon.className = `fas ${getMascotIcon(currentMascot)}`;
    }
    avatar.appendChild(icon);
    
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}`;
    bubble.textContent = text;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    fragment.appendChild(messageDiv);
    chatMessagesEl.appendChild(fragment);
    
    // Debounce scroll to bottom
    if (scrollToBottomTimeout) {
        clearTimeout(scrollToBottomTimeout);
    }
    scrollToBottomTimeout = setTimeout(scrollToBottom, 10);
    
    // Add to chat history
    chatHistory.push({ sender, text, timestamp: new Date() });
}

// Show typing indicator with performance optimization
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message assistant';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar assistant';
    const icon = document.createElement('i');
    icon.className = `fas ${getMascotIcon(currentMascot)}`;
    avatar.appendChild(icon);
    
    const typingBubble = document.createElement('div');
    typingBubble.className = 'typing-indicator';
    typingBubble.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(typingBubble);
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    fragment.appendChild(typingDiv);
    chatMessagesEl.appendChild(fragment);
    
    // Debounce scroll to bottom
    if (scrollToBottomTimeout) {
        clearTimeout(scrollToBottomTimeout);
    }
    scrollToBottomTimeout = setTimeout(scrollToBottom, 10);
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Scroll to bottom of chat with performance optimization
function scrollToBottom() {
    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    });
}

// Generate AI response
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    const mascotName = currentMascot || 'AI Assistant';
    const institution = currentInstitution || 'your school';
    
    // School-specific responses
    if (institution.toLowerCase().includes('ohio state') || institution.toLowerCase().includes('osu')) {
        if (message.includes('buckeye') || message.includes('brutus')) {
            return "🌰 That's right! I'm Brutus the Buckeye, the official mascot of The Ohio State University! Buckeyes are the fruit of the Ohio buckeye tree, and they're a symbol of good luck. I've been representing OSU since 1965!";
        }
        if (message.includes('football') || message.includes('game')) {
            return "🏈 O-H! I-O! Ohio State football is legendary! The Horseshoe (Ohio Stadium) is one of the most iconic venues in college sports. We've won multiple national championships and have one of the most passionate fan bases in the country!";
        }
        if (message.includes('campus') || message.includes('columbus')) {
            return "🏛️ Ohio State's campus in Columbus is beautiful! From the iconic Oval to the Thompson Library, there's so much to explore. The campus is huge - over 1,900 acres! And don't forget about High Street with all the restaurants and shops.";
        }
    }
    
    // General responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return `👋 Hello! I'm ${mascotName}, your AI assistant from ${institution}. How can I help you today?`;
    }
    
    if (message.includes('help') || message.includes('what can you do')) {
        return `I'm here to help you with anything about ${institution}! I can tell you about school traditions, campus life, academic resources, or just chat about general topics. What would you like to know?`;
    }
    
    if (message.includes('weather') || message.includes('temperature')) {
        return "🌤️ I can't check the weather in real-time, but I can tell you that campus weather varies throughout the year! Make sure to check a weather app before heading to class.";
    }
    
    if (message.includes('food') || message.includes('dining') || message.includes('eat')) {
        return "🍕 Campus dining is great! There are dining halls, food courts, coffee shops, and plenty of restaurants nearby. The meal plans are convenient, and there are lots of options for different dietary preferences.";
    }
    
    if (message.includes('study') || message.includes('academic') || message.includes('class')) {
        return "📚 Academic success is important! Make sure to attend classes, take good notes, use the library resources, and don't hesitate to reach out to professors or tutors if you need help. Time management is key!";
    }
    
    if (message.includes('social') || message.includes('friends') || message.includes('meet')) {
        return "👥 Making friends in college is exciting! Join clubs, attend campus events, participate in orientation activities, and don't be afraid to introduce yourself to people in your classes or dorm.";
    }
    
    if (message.includes('stress') || message.includes('anxiety') || message.includes('worried')) {
        return "😌 It's normal to feel stressed in college. Remember to take breaks, practice self-care, use campus counseling services if needed, and don't be too hard on yourself. You've got this!";
    }
    
    if (message.includes('fun') || message.includes('entertainment') || message.includes('activities')) {
        return "🎉 Campus life is full of fun activities! There are sports games, concerts, theater performances, club events, intramural sports, and so much more. Check out the campus events calendar!";
    }
    
    // Default responses
    const defaultResponses = [
        `That's an interesting question! As ${mascotName}, I'm here to help you with anything about ${institution}.`,
        `I'd be happy to help with that! What specific aspect would you like to know more about?`,
        `Great question! ${institution} has so much to offer. Is there something particular you're curious about?`,
        `I'm here to support you! Whether it's about academics, campus life, or just general advice, feel free to ask.`,
        `That's something I can definitely help with! What would you like to know more about?`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Logout functionality
function logout() {
    fetch('/api/logout', { method: 'POST' })
        .then(() => {
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Logout error:', error);
            window.location.href = '/';
        });
}

// Event listeners
logoutBtn.addEventListener('click', logout);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initMascot); 