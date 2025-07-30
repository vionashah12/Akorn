import openai
import os
from typing import List, Dict, Optional

class AkornAIChatbot:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Akorn AI Chatbot with OpenAI integration.
        
        Args:
            api_key: OpenAI API key. If not provided, will try to get from environment.
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if self.api_key:
            openai.api_key = self.api_key
        else:
            print("⚠️  Warning: No OpenAI API key found. Set OPENAI_API_KEY environment variable.")
        
        # School-specific mascot personalities
        self.mascot_personalities = {
            'Ohio State University': {
                'name': 'Brutus AI',
                'personality': 'You are Brutus the Buckeye, the beloved mascot of Ohio State University. You are enthusiastic, knowledgeable about OSU traditions, football, and campus life. You speak with Buckeye pride and always support the Scarlet and Gray!',
                'icon': 'fas fa-leaf',
                'color': '#DC143C'  # Scarlet red
            },
            'University of Michigan': {
                'name': 'Wolverine AI',
                'personality': 'You are the University of Michigan Wolverine mascot. You are fierce, intelligent, and proud of UM traditions, academics, and athletics. You represent the Maize and Blue with pride!',
                'icon': 'fas fa-paw',
                'color': '#00274C'  # Michigan blue
            },
            'default': {
                'name': 'Akorn AI',
                'personality': 'You are Akorn AI, a helpful academic assistant. You help students with their studies, assignments, and academic questions. You are friendly, knowledgeable, and always encouraging!',
                'icon': 'fas fa-seedling',
                'color': '#007bff'  # Akorn blue
            }
        }
    
    def get_mascot_info(self, institution: str) -> Dict:
        """
        Get mascot information for a specific institution.
        
        Args:
            institution: The institution name
            
        Returns:
            Dictionary with mascot information
        """
        return self.mascot_personalities.get(institution, self.mascot_personalities['default'])
    
    def generate_response(self, user_message: str, institution: str = None, chat_history: List[Dict] = None) -> str:
        """
        Generate an AI response using OpenAI.
        
        Args:
            user_message: The user's message
            institution: The user's institution (for mascot personality)
            chat_history: Previous conversation history
            
        Returns:
            Generated AI response
        """
        if not self.api_key:
            return self._generate_fallback_response(user_message, institution)
        
        try:
            mascot_info = self.get_mascot_info(institution)
            
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
                max_tokens=150,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating AI response: {e}")
            return self._generate_fallback_response(user_message, institution)
    
    def _generate_fallback_response(self, user_message: str, institution: str = None) -> str:
        """
        Generate a fallback response when OpenAI is not available.
        
        Args:
            user_message: The user's message
            institution: The user's institution
            
        Returns:
            Fallback response
        """
        mascot_info = self.get_mascot_info(institution)
        
        # Simple keyword-based responses
        message_lower = user_message.lower()
        
        if institution == 'Ohio State University':
            if any(word in message_lower for word in ['football', 'buckeyes', 'game', 'sport']):
                return "🏈 O-H! I-O! Buckeye football is the heart of Ohio State! The Horseshoe is where legends are made. Go Bucks! 🌰"
            elif any(word in message_lower for word in ['campus', 'columbus', 'ohio']):
                return "🌰 Welcome to the beautiful Ohio State campus! From the Oval to High Street, there's so much to explore. What would you like to know about campus life?"
            elif any(word in message_lower for word in ['class', 'study', 'academic']):
                return "📚 Academic excellence is what we're all about at Ohio State! Whether it's engineering, business, or the arts, we're here to help you succeed! 💪"
        
        elif institution == 'University of Michigan':
            if any(word in message_lower for word in ['football', 'wolverines', 'game', 'sport']):
                return "🏈 Go Blue! Michigan football tradition runs deep! The Big House is where champions are made. Hail to the Victors! 🐺"
            elif any(word in message_lower for word in ['campus', 'ann arbor', 'michigan']):
                return "🐺 Welcome to the University of Michigan! From the Diag to State Street, Ann Arbor is a wonderful college town. What would you like to know?"
            elif any(word in message_lower for word in ['class', 'study', 'academic']):
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
    
    def get_mascot_icon(self, institution: str) -> str:
        """
        Get the Font Awesome icon for the mascot.
        
        Args:
            institution: The institution name
            
        Returns:
            Font Awesome icon class
        """
        mascot_info = self.get_mascot_info(institution)
        return mascot_info['icon']
    
    def get_mascot_color(self, institution: str) -> str:
        """
        Get the color theme for the mascot.
        
        Args:
            institution: The institution name
            
        Returns:
            Color hex code
        """
        mascot_info = self.get_mascot_info(institution)
        return mascot_info['color']

# Example usage
if __name__ == "__main__":
    # Initialize the chatbot
    chatbot = AkornAIChatbot()
    
    # Test responses
    print("Testing Akorn AI Chatbot...")
    print("=" * 50)
    
    # Test Ohio State responses
    print("Ohio State University:")
    print(chatbot.generate_response("Tell me about Buckeye football", "Ohio State University"))
    print()
    
    # Test Michigan responses
    print("University of Michigan:")
    print(chatbot.generate_response("What's campus like?", "University of Michigan"))
    print()
    
    # Test default responses
    print("Default Akorn AI:")
    print(chatbot.generate_response("Hello!", None))
    print() 