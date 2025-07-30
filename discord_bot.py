import discord
import openai
import os
import json
from typing import Dict, Optional, List

# Load your keys from environment variables
DISCORD_TOKEN = os.getenv('DISCORD_BOT_TOKEN')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not DISCORD_TOKEN:
    print("⚠️  Warning: No Discord bot token found. Set DISCORD_BOT_TOKEN environment variable.")
if not OPENAI_API_KEY:
    print("⚠️  Warning: No OpenAI API key found. Set OPENAI_API_KEY environment variable.")

# Initialize OpenAI
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

# School-specific mascot personalities for Discord
MASCOT_PERSONALITIES = {
    'Ohio State University': {
        'name': 'Brutus AI',
        'personality': 'You are Brutus the Buckeye, the beloved mascot of Ohio State University. You are enthusiastic, knowledgeable about OSU traditions, football, academics, and campus life. You speak with Buckeye pride and always support the Scarlet and Gray! You help students with course information, campus resources, and OSU traditions.',
        'icon': '🌰',
        'color': 0xDC143C,  # Scarlet red
        'commands': ['!brutus', '!osuhelp', '!buckeye']
    },
    'University of Michigan': {
        'name': 'Wolverine AI',
        'personality': 'You are the University of Michigan Wolverine mascot. You are fierce, intelligent, and proud of UM traditions, academics, and athletics. You represent the Maize and Blue with pride! You help students with course information, campus resources, and UM traditions.',
        'icon': '🐺',
        'color': 0x00274C,  # Michigan blue
        'commands': ['!wolverine', '!umhelp', '!michigan']
    },
    'default': {
        'name': 'Akorn AI',
        'personality': 'You are Akorn AI, a helpful academic assistant. You help students with their studies, assignments, and academic questions. You are friendly, knowledgeable, and always encouraging!',
        'icon': '🌱',
        'color': 0x007bff,  # Akorn blue
        'commands': ['!akorn', '!help', '!assist']
    }
}

# Set up intents
intents = discord.Intents.default()
intents.messages = True
intents.message_content = True

# Create bot
client = discord.Client(intents=intents)

def get_mascot_info(institution: str) -> Dict:
    """Get mascot information for a specific institution."""
    return MASCOT_PERSONALITIES.get(institution, MASCOT_PERSONALITIES['default'])

def generate_ai_response(user_message: str, institution: str = None, chat_history: List[Dict] = None) -> str:
    """Generate an AI response using OpenAI."""
    if not OPENAI_API_KEY:
        return generate_fallback_response(user_message, institution)
    
    try:
        mascot_info = get_mascot_info(institution)
        
        # Build conversation context
        messages = [
            {"role": "system", "content": mascot_info['personality']}
        ]
        
        # Add chat history if provided
        if chat_history:
            for msg in chat_history[-10:]:  # Last 10 messages for context
                role = "user" if msg['sender'] == 'user' else "assistant"
                messages.append({"role": role, "content": msg['text']})
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Generate response using OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=200,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Error generating AI response: {e}")
        return generate_fallback_response(user_message, institution)

def generate_fallback_response(user_message: str, institution: str = None) -> str:
    """Generate a fallback response when OpenAI is not available."""
    mascot_info = get_mascot_info(institution)
    
    # Simple keyword-based responses
    message_lower = user_message.lower()
    
    if institution == 'Ohio State University':
        if any(word in message_lower for word in ['football', 'buckeyes', 'game', 'sport']):
            return "🏈 O-H! I-O! Buckeye football is the heart of Ohio State! The Horseshoe is where legends are made. Go Bucks! 🌰"
        elif any(word in message_lower for word in ['campus', 'columbus', 'ohio']):
            return "🌰 Welcome to the beautiful Ohio State campus! From the Oval to High Street, there's so much to explore. What would you like to know about campus life?"
        elif any(word in message_lower for word in ['class', 'study', 'academic', 'course']):
            return "📚 Academic excellence is what we're all about at Ohio State! Whether it's engineering, business, or the arts, we're here to help you succeed! 💪"
        elif any(word in message_lower for word in ['acctmis', 'accounting', '2200']):
            return "📊 ACCTMIS 2200 is Introduction to Accounting I! It covers financial statements, double-entry bookkeeping, and fundamental accounting principles. Perfect for business majors! 💼"
    
    elif institution == 'University of Michigan':
        if any(word in message_lower for word in ['football', 'wolverines', 'game', 'sport']):
            return "🏈 Go Blue! Michigan football tradition runs deep! The Big House is where champions are made. Hail to the Victors! 🐺"
        elif any(word in message_lower for word in ['campus', 'ann arbor', 'michigan']):
            return "🐺 Welcome to the University of Michigan! From the Diag to State Street, Ann Arbor is a wonderful college town. What would you like to know?"
        elif any(word in message_lower for word in ['class', 'study', 'academic', 'course']):
            return "📚 Michigan academics are world-class! Whether you're in engineering, business, or the liberal arts, we're here to support your academic journey! 🎓"
    
    # General responses
    if any(word in message_lower for word in ['hello', 'hi', 'hey']):
        return f"👋 Hello! I'm {mascot_info['name']}, your academic assistant! How can I help you today?"
    elif any(word in message_lower for word in ['help', 'assist', 'support']):
        return "🤝 I'm here to help with your academic questions, study tips, or just general support! What do you need assistance with?"
    elif any(word in message_lower for word in ['study', 'homework', 'assignment']):
        return "📖 I'm here to help with your studies! Whether it's organizing your assignments, study tips, or academic advice, just let me know what you need!"
    else:
        return f"💬 Thanks for your message! I'm {mascot_info['name']} and I'm here to help with your academic journey. How can I assist you today?"

@client.event
async def on_ready():
    print(f'✅ Discord Bot logged in as {client.user}')
    print(f'🤖 Bot is ready to help with academic questions!')
    print(f'📚 Available commands:')
    for institution, info in MASCOT_PERSONALITIES.items():
        if institution != 'default':
            print(f'   {info["icon"]} {institution}: {", ".join(info["commands"])}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    content = message.content.lower()
    
    # Ohio State University commands
    if content.startswith('!brutus') or content.startswith('!osuhelp') or content.startswith('!buckeye'):
        query = message.content.split(' ', 1)[1] if len(message.content.split(' ', 1)) > 1 else "Hello Brutus!"
        
        # Create embed for Ohio State responses
        embed = discord.Embed(
            title=f"🌰 Brutus AI Response",
            description=generate_ai_response(query, 'Ohio State University'),
            color=MASCOT_PERSONALITIES['Ohio State University']['color']
        )
        embed.set_footer(text="Brutus the Buckeye • Ohio State University")
        
        await message.channel.send(embed=embed)
    
    # University of Michigan commands
    elif content.startswith('!wolverine') or content.startswith('!umhelp') or content.startswith('!michigan'):
        query = message.content.split(' ', 1)[1] if len(message.content.split(' ', 1)) > 1 else "Hello Wolverine!"
        
        # Create embed for Michigan responses
        embed = discord.Embed(
            title=f"🐺 Wolverine AI Response",
            description=generate_ai_response(query, 'University of Michigan'),
            color=MASCOT_PERSONALITIES['University of Michigan']['color']
        )
        embed.set_footer(text="Wolverine • University of Michigan")
        
        await message.channel.send(embed=embed)
    
    # Default Akorn commands
    elif content.startswith('!akorn') or content.startswith('!help') or content.startswith('!assist'):
        query = message.content.split(' ', 1)[1] if len(message.content.split(' ', 1)) > 1 else "Hello Akorn AI!"
        
        # Create embed for default responses
        embed = discord.Embed(
            title=f"🌱 Akorn AI Response",
            description=generate_ai_response(query, None),
            color=MASCOT_PERSONALITIES['default']['color']
        )
        embed.set_footer(text="Akorn AI • Academic Assistant")
        
        await message.channel.send(embed=embed)
    
    # Help command
    elif content.startswith('!mascothelp'):
        embed = discord.Embed(
            title="🎓 Mascot AI Commands",
            description="Here are the available commands for different schools:",
            color=0x007bff
        )
        
        embed.add_field(
            name="🌰 Ohio State University",
            value="`!brutus <question>` - Ask Brutus about OSU\n`!osuhelp <question>` - Get OSU help\n`!buckeye <question>` - Buckeye assistance",
            inline=False
        )
        
        embed.add_field(
            name="🐺 University of Michigan",
            value="`!wolverine <question>` - Ask Wolverine about UM\n`!umhelp <question>` - Get UM help\n`!michigan <question>` - Michigan assistance",
            inline=False
        )
        
        embed.add_field(
            name="🌱 General Academic Help",
            value="`!akorn <question>` - General academic help\n`!help <question>` - Get assistance\n`!assist <question>` - Academic support",
            inline=False
        )
        
        embed.set_footer(text="Use any command followed by your question!")
        
        await message.channel.send(embed=embed)

# Run the bot
if __name__ == "__main__":
    if not DISCORD_TOKEN:
        print("❌ Error: DISCORD_BOT_TOKEN environment variable is required!")
        print("💡 Set it with: export DISCORD_BOT_TOKEN='your_token_here'")
    else:
        print("🚀 Starting Discord Bot...")
        client.run(DISCORD_TOKEN) 