# 🎓 Akorn - Canvas Tracker - AI-Powered Academic Assistant

A modern web application that integrates with Canvas LMS to provide students with assignment tracking, calendar integration, and an AI-powered chat assistant featuring school-specific mascots.

## ✨ Features

### 📚 **Canvas LMS Integration**
- **Assignment Tracking**: View all your Canvas assignments in one place
- **Course Management**: Organize and track your courses
- **Submission Status**: Monitor assignment submission status
- **Real-time Updates**: Stay updated with your academic progress

### 🤖 **AI Chat Assistant**
- **School Mascot AI**: Personalized AI assistant based on your institution
- **Dynamic Detection**: Automatically detects your school (Ohio State, Michigan, etc.)
- **Academic Support**: Get help with courses, assignments, and study tips
- **School Traditions**: Learn about campus life and traditions

### 📅 **Google Calendar Integration**
- **Assignment Sync**: Automatically add Canvas assignments to Google Calendar
- **OAuth Authentication**: Secure Google Calendar access
- **Embedded Calendar**: View your calendar directly in the app

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean Interface**: Intuitive navigation and user experience
- **Performance Optimized**: Smooth scrolling and fast loading

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+ (for optional Discord bot)
- Canvas LMS account
- Google account (for calendar integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vionashah12/Akorn.git
   cd Akorn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:2025/api/auth/google/callback
   SESSION_SECRET=your_random_session_secret
   PORT=2025
   ```

4. **Start the application**
   ```bash
   npm run web
   ```

5. **Open your browser**
   Navigate to `http://localhost:2025`

## 📖 Setup Guides

### Canvas LMS Setup
1. Log in to your Canvas account
2. Go to Settings → Developer Keys
3. Create a new developer key with appropriate permissions
4. Use the generated token in the application

### Google Calendar Setup
See [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md) for detailed instructions.

### Discord Bot Setup (Optional)
See [DISCORD_BOT_SETUP.md](DISCORD_BOT_SETUP.md) for Discord bot configuration.

## 🏫 Supported Institutions

The AI assistant automatically detects and adapts to your institution:

- **Ohio State University** → Brutus AI 🏈
- **University of Michigan** → Wolverine AI 🐺
- **Other Institutions** → Generic AI Assistant 🤖

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Session-based (can be extended to MongoDB/PostgreSQL)
- **APIs**: Canvas LMS API, Google Calendar API
- **AI**: Custom mascot-based responses
- **Authentication**: OAuth 2.0, Session management

## 📁 Project Structure

```
Akorn/
├── public/                 # Frontend files
│   ├── dashboard.html     # Main dashboard
│   ├── profile.html       # User profile page
│   ├── mascot.html       # AI chat interface
│   ├── styles.css        # Main stylesheet
│   └── mascot.js         # AI chat logic
├── server.js             # Express server
├── canvas_api.py         # Canvas API utilities
├── discord_bot_simple.py # Discord bot (optional)
├── requirements.txt      # Python dependencies
├── package.json         # Node.js dependencies
└── README.md           # This file
```

## 🎯 Usage Examples

### AI Chat Assistant
```
User: "Tell me about Ohio State football"
Brutus AI: "🏈 O-H! I-O! Buckeye football is the heart of Ohio State! 
The Horseshoe is where legends are made. Go Bucks! 🌰"

User: "What is ACCTMIS 2200?"
Brutus AI: "📊 ACCTMIS 2200 is Introduction to Accounting I! 
It covers financial statements, double-entry bookkeeping, 
and fundamental accounting principles. Perfect for business majors! 💼"
```

### Assignment Tracking
- View all Canvas assignments in a unified dashboard
- Track submission status and due dates
- Sync assignments to Google Calendar
- Get notifications for upcoming deadlines

## 🔧 Configuration

### Environment Variables
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: OAuth callback URL
- `SESSION_SECRET`: Session encryption key
- `PORT`: Server port (default: 2025)

### Canvas API Configuration
The application automatically detects your Canvas domain and institution based on your login credentials.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Canvas LMS API for educational data integration
- Google Calendar API for calendar functionality
- Font Awesome for icons
- Express.js community for web framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [SETUP.md](SETUP.md) for detailed setup instructions
2. Review the existing issues on GitHub
3. Create a new issue with detailed information about your problem

---

**Made with ❤️ for students everywhere**
