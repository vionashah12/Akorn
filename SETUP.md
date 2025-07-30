# Canvas Tracker OAuth Setup Guide

## 🚀 Quick Setup

### Step 1: Canvas OAuth Application Registration

1. **Log into your Canvas instance** (e.g., https://osu.instructure.com)
2. **Go to Developer Keys**:
   - Click your profile picture → Settings
   - Scroll down to "Developer Keys" section
   - Click "Developer Keys"

3. **Create a new Developer Key**:
   - Click "New Developer Key"
   - Fill in the details:
     - **Name**: `Canvas Tracker`
     - **Key Type**: `API Key`
     - **Redirect URIs**: `http://localhost:2025/auth/callback`
     - **Scopes**: Select these permissions:
       - `url:GET|/api/v1/courses`
       - `url:GET|/api/v1/users/self/profile`
       - `url:GET|/api/v1/courses/:course_id/assignments`
       - `url:GET|/api/v1/courses/:course_id/assignments/:assignment_id/submissions/self`

4. **Save and copy credentials**:
   - Click "Save"
   - Copy the **Client ID** and **Client Secret**

### Step 2: Environment Configuration

1. **Create a `.env` file** in the project root:
   ```bash
   touch .env
   ```

2. **Add your OAuth credentials**:
   ```env
   CANVAS_CLIENT_ID=your_client_id_here
   CANVAS_CLIENT_SECRET=your_client_secret_here
   REDIRECT_URI=http://localhost:2025/auth/callback
   NODE_ENV=development
   ```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Application

```bash
npm run web
```

### Step 5: Test the Application

1. Open your browser to `http://localhost:2025`
2. Select your Canvas domain from the dropdown
3. Click "Sign in with Canvas"
4. Complete the OAuth flow on Canvas
5. You should be redirected back to the dashboard

## 🔧 Troubleshooting

### Common Issues:

1. **"Client ID not found" error**:
   - Make sure your `.env` file exists and has the correct Client ID
   - Check that the Client ID matches exactly what Canvas provided

2. **"Redirect URI mismatch" error**:
   - Ensure the redirect URI in Canvas matches exactly: `http://localhost:2025/auth/callback`
   - Check for extra spaces or typos

3. **"Insufficient scopes" error**:
   - Make sure all required scopes are selected in your Canvas Developer Key
   - The scopes must match exactly what's listed above

4. **Port 3000 already in use**:
   ```bash
   # Kill existing process
   pkill -f "node server.js"
   
   # Or use a different port
   PORT=3001 npm run web
   ```

### For Different Canvas Instances:

If you're using a different Canvas instance (not OSU), replace the domain in the setup:

- **OSU**: `osu.instructure.com`
- **UMich**: `canvas.umich.edu`
- **UCLA**: `canvas.ucla.edu`
- **Custom**: `your-institution.instructure.com`

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your Client Secret secure
- The application only requests read-only permissions
- All authentication happens through Canvas's official OAuth system

## 📱 Testing the OAuth Flow

1. **Select your institution** from the dropdown
2. **Click "Sign in with Canvas"**
3. **You'll be redirected to Canvas** to authenticate
4. **Canvas will ask for permission** to access your data
5. **After approval**, you'll be redirected back to the dashboard
6. **Your session will persist** until you log out or the token expires

## 🎯 What You'll See

After successful authentication, you'll have access to:

- **AI-Powered Recommendations**: Smart assignment prioritization
- **Assignment Organization**: Categorized by status (Missing, In Progress, Completed)
- **Course Filtering**: Focus on specific courses
- **Real-time Data**: Always up-to-date information
- **Responsive Design**: Works on all devices

## 🆘 Need Help?

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your `.env` file configuration
3. Ensure your Canvas Developer Key has the correct settings
4. Make sure all required scopes are selected

The OAuth system provides a much more secure and user-friendly experience compared to manual token management! 