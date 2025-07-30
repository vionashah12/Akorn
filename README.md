# Akorn

A comprehensive academic management platform that integrates with Learning Management Systems (Canvas, Blackboard, D2L) to help students track assignments, sync with Google Calendar, and manage their academic journey.

## Features

- 🔐 **Secure LMS Integration** - Connect to Canvas, Blackboard, or D2L
- 🏫 Multi-institution support (OSU, UMich, UCLA, UC Berkeley, etc.)
- 📚 Fetch all courses for the authenticated user
- 📝 Get assignments for specific courses with submission status
- 👤 Retrieve user profile information
- 🎯 Get detailed assignment information
- 🤖 **AI-Powered Recommendations** - Smart prioritization and time estimates
- 📊 **Assignment Organization** - Categorized by status (Missing, In Progress, Completed)
- 🌐 Beautiful web dashboard interface
- 📱 Responsive design for mobile and desktop
- 🔄 Real-time data refresh capabilities
- 🚪 Secure session management
- 📅 **Google Calendar Integration** - Real OAuth sync with your calendar
- 📋 **Applications Tracking** - Manage academic applications and deadlines
- 📖 **Syllabus Analysis** - Upload and analyze course syllabi

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Canvas OAuth Application (see setup below)

### LMS Integration Setup

#### Canvas Access Token Setup

To connect to Canvas, you need to get an access token:

1. **Log into your Canvas instance** (e.g., canvas.osu.edu)
2. **Go to Settings**: Click your profile picture → Settings
3. **Scroll to Approved Integrations**
4. **Click "New Access Token"**
5. **Enter a purpose** like "Akorn"
6. **Set expiration** to "Never" or choose a future date
7. **Click "Generate Token"**
8. **Copy the token immediately** (you won't see it again!)

#### Google Calendar Integration Setup

For Google Calendar sync, follow the detailed guide in [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md):

1. **Create a Google Cloud Project**
2. **Enable Google Calendar API**
3. **Set up OAuth 2.0 credentials**
4. **Create a `.env` file** with your credentials:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:2025/api/auth/google/callback
   SESSION_SECRET=your_random_session_secret_here
   ```

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the web server:**
   ```bash
   npm run web
   ```

3. **Open your browser:**
   Navigate to `http://localhost:2025`

4. **Login with your Canvas account:**
   - Select your institution from the dropdown
   - Click "Sign in with Canvas"
   - Complete the OAuth flow on Canvas
   - Access your dashboard with AI-powered insights

### Features:
- **Secure OAuth Authentication** - No manual tokens needed
- **AI-Powered Recommendations** - Smart assignment prioritization
- **Assignment Organization** - Categorized by status
- **Real-time Data Loading** - Always up-to-date information
- **Course Filtering** - Focus on specific courses
- **Responsive Design** - Works on all devices
- **Multi-institution Support** - Works with any Canvas instance

### Python Version

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python3 canvas_api.py
   ```

3. **Simple example:**
   ```bash
   python3 simple_example.py
   ```

## Usage

### Basic Usage

#### Node.js
Run the main application to see your courses and assignments:

```bash
npm start
```

#### Python
Run the main application to see your courses and assignments:

```bash
python3 canvas_api.py
```

### Programmatic Usage

#### Node.js
```javascript
const CanvasAPI = require('./canvas-api');

const canvas = new CanvasAPI();

// Get all courses
const courses = await canvas.getCourses();

// Get assignments for a specific course
const assignments = await canvas.getAssignments(courseId);

// Get user profile
const profile = await canvas.getUserProfile();
```

#### Python
```python
from canvas_api import CanvasAPI

canvas = CanvasAPI()

# Get all courses
courses = canvas.get_courses()

# Get assignments for a specific course
assignments = canvas.get_assignments(course_id)

# Get user profile
profile = canvas.get_user_profile()
```

### API Methods

#### `getCourses(options)`
Fetches all courses for the authenticated user.

#### `getCourse(courseId)`
Gets details for a specific course.

#### `getAssignments(courseId, options)`
Fetches all assignments for a specific course.

#### `getAssignment(courseId, assignmentId)`
Gets details for a specific assignment.

#### `getUserProfile()`
Retrieves the authenticated user's profile information.

## API Endpoints Used

- `GET /api/v1/courses` - List all courses
- `GET /api/v1/courses/:course_id` - Get course details
- `GET /api/v1/courses/:course_id/assignments` - List course assignments
- `GET /api/v1/courses/:course_id/assignments/:assignment_id` - Get assignment details
- `GET /api/v1/users/self/profile` - Get user profile

## Example Output

```
🎓 Canvas API Client
===================

📋 Fetching user profile...
👤 User: John Doe (john.doe@university.edu)
🆔 User ID: 12345

📚 Fetching courses...
Found 3 courses:

📖 Introduction to Computer Science (ID: 123)
   Code: CS101
   State: available

📖 Advanced Mathematics (ID: 124)
   Code: MATH201
   State: available

📝 Fetching assignments for: Introduction to Computer Science
Found 5 assignments:

📋 Programming Assignment 1
   Due: 2024-01-15T23:59:00Z
   Points: 100
   Status: published
```

## Error Handling

The application includes comprehensive error handling for:
- Network errors
- Authentication failures
- Invalid course/assignment IDs
- API rate limiting

## Security Notes

- Never commit your API token to version control
- Use environment variables for production deployments
- The token provided has access to your Canvas account - keep it secure

## Dependencies

- `axios` - HTTP client for API requests
- `dotenv` - Environment variable management

## License

MIT 