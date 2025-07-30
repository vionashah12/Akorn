# Google Calendar Integration Setup Guide

## Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Name it: "Akorn Calendar Integration"
   - Click "Create"

3. **Enable Google Calendar API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

## Step 2: OAuth 2.0 Configuration

1. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"

2. **Configure OAuth Consent Screen**
   - Choose "External" user type
   - Fill in required information:
     - App name: "Akorn"
     - User support email: Your email
     - Developer contact email: Your email
   - Click "Save and Continue"
   - Skip scopes section, click "Save and Continue"
   - Add test users (your email), click "Save and Continue"

3. **Create OAuth Client ID**
   - Application type: "Web application"
   - Name: "Akorn Web Client"
   - Authorized redirect URIs:
     - `http://localhost:2025/auth/google/callback`
- `http://localhost:2025/api/auth/google/callback`
   - Click "Create"

4. **Save Your Credentials**
   - Download the JSON file
   - Save it as `google-credentials.json` in your project root
   - **IMPORTANT**: Never commit this file to version control!

## Step 3: Environment Variables

1. **Create a `.env` file** in your project root:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:2025/api/auth/google/callback
SESSION_SECRET=your_random_session_secret_here
```

2. **Install required packages**:
```bash
npm install googleapis express-session
```

## Step 4: Implementation

The integration includes:
- ✅ OAuth 2.0 authentication flow
- ✅ Google Calendar API integration
- ✅ Real calendar event creation
- ✅ Session management
- ✅ Secure token storage

## Step 5: Testing

1. **Start the server**: `node server.js`
2. **Go to**: http://localhost:2025
3. **Navigate to Calendar tab**
4. **Click "Connect Google Calendar"**
5. **Complete OAuth flow**
6. **Test syncing assignments**

## Security Notes

- ✅ OAuth 2.0 secure authentication
- ✅ Session-based token storage
- ✅ HTTPS redirect URIs for production
- ✅ Environment variable protection
- ✅ No hardcoded secrets

## Production Deployment

For production, update:
- Redirect URIs to your domain
- Add HTTPS URLs
- Set up proper session storage
- Configure environment variables on your hosting platform 