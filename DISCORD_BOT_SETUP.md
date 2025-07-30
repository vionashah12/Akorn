# Discord Bot Setup for Akorn Mascot AI

This guide will help you set up the Discord bot integration for the Akorn mascot AI chatbot.

## Prerequisites

1. **Discord Bot Token**: You need to create a Discord application and bot
2. **OpenAI API Key**: For AI-powered responses
3. **Python Environment**: With the required packages installed

## Step 1: Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "Akorn Mascot AI")
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot"
5. Under "Token", click "Copy" to get your bot token
6. Save this token securely - you'll need it later

## Step 2: Configure Bot Permissions

1. In the Bot section, scroll down to "Privileged Gateway Intents"
2. Enable:
   - ✅ Message Content Intent
   - ✅ Server Members Intent
   - ✅ Presence Intent

## Step 3: Invite Bot to Your Server

1. Go to the "OAuth2" → "URL Generator" section
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
   - ✅ Use Slash Commands
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

## Step 4: Set Environment Variables

Create a `.env` file in your project root:

```bash
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

Or set them in your terminal:

```bash
export DISCORD_BOT_TOKEN='your_discord_bot_token_here'
export OPENAI_API_KEY='your_openai_api_key_here'
```

## Step 5: Install Dependencies

```bash
pip3 install openai discord.py
```

## Step 6: Run the Discord Bot

```bash
python3 discord_bot.py
```

## Available Commands

### Ohio State University
- `!brutus <question>` - Ask Brutus about OSU
- `!osuhelp <question>` - Get OSU help
- `!buckeye <question>` - Buckeye assistance

### University of Michigan
- `!wolverine <question>` - Ask Wolverine about UM
- `!umhelp <question>` - Get UM help
- `!michigan <question>` - Michigan assistance

### General Academic Help
- `!akorn <question>` - General academic help
- `!help <question>` - Get assistance
- `!assist <question>` - Academic support

### Help Command
- `!mascothelp` - Show all available commands

## Example Usage

```
User: !brutus What does ACCTMIS 2200 cover?
Bot: 📊 ACCTMIS 2200 is Introduction to Accounting I! It covers financial statements, double-entry bookkeeping, and fundamental accounting principles. Perfect for business majors! 💼

User: !osuhelp Tell me about Ohio State football
Bot: 🏈 O-H! I-O! Buckeye football is the heart of Ohio State! The Horseshoe is where legends are made. Go Bucks! 🌰

User: !wolverine What's campus like?
Bot: 🐺 Welcome to the University of Michigan! From the Diag to State Street, Ann Arbor is a wonderful college town. What would you like to know?
```

## Features

- **School-Specific Personalities**: Each school has its own mascot AI with unique personality
- **Embedded Responses**: Rich Discord embeds with school colors and branding
- **Fallback Responses**: Works even without OpenAI API key
- **Context Awareness**: Maintains conversation context for better responses
- **Multiple Commands**: Different command aliases for each school

## Troubleshooting

### Bot Not Responding
1. Check if the bot is online in your Discord server
2. Verify the bot has the correct permissions
3. Ensure the bot token is correct

### OpenAI Errors
1. Check your OpenAI API key is valid
2. Ensure you have sufficient API credits
3. The bot will use fallback responses if OpenAI is unavailable

### Permission Errors
1. Make sure the bot has "Send Messages" permission
2. Check that "Message Content Intent" is enabled
3. Verify the bot is in the correct channel

## Integration with Akorn Web App

The Discord bot works alongside the web-based mascot AI. Both use the same AI logic and school-specific personalities, providing a consistent experience across platforms.

## Security Notes

- Never share your bot token publicly
- Use environment variables for sensitive data
- Regularly rotate your API keys
- Monitor bot usage and API costs 