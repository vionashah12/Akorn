#!/usr/bin/env python3
"""
Test script for the Akorn Discord Bot functionality
This demonstrates the mascot AI responses without needing to run the actual Discord bot.
"""

from discord_bot_simple import generate_response, MASCOT_PERSONALITIES

def test_mascot_responses():
    """Test various mascot AI responses."""
    
    print("🎓 Testing Akorn Discord Bot - Mascot AI Responses")
    print("=" * 60)
    
    # Test Ohio State University responses
    print("\n🌰 Testing Brutus AI (Ohio State University):")
    print("-" * 40)
    
    test_questions = [
        "What does ACCTMIS 2200 cover?",
        "Tell me about Ohio State football",
        "What's campus like?",
        "Hello Brutus!",
        "Help me with my studies"
    ]
    
    for question in test_questions:
        response = generate_response(question, 'Ohio State University')
        print(f"Q: {question}")
        print(f"A: {response}")
        print()
    
    # Test University of Michigan responses
    print("\n🐺 Testing Wolverine AI (University of Michigan):")
    print("-" * 40)
    
    test_questions = [
        "What's campus like?",
        "Tell me about Michigan football",
        "Help with academics",
        "Hello Wolverine!",
        "What courses should I take?"
    ]
    
    for question in test_questions:
        response = generate_response(question, 'University of Michigan')
        print(f"Q: {question}")
        print(f"A: {response}")
        print()
    
    # Test default Akorn AI responses
    print("\n🌱 Testing Akorn AI (Default):")
    print("-" * 40)
    
    test_questions = [
        "Hello!",
        "Help me with my homework",
        "What is Akorn?",
        "Tell me about the app",
        "I need academic support"
    ]
    
    for question in test_questions:
        response = generate_response(question, None)
        print(f"Q: {question}")
        print(f"A: {response}")
        print()
    
    # Show available commands
    print("\n📚 Available Discord Commands:")
    print("-" * 40)
    
    for institution, info in MASCOT_PERSONALITIES.items():
        if institution != 'default':
            print(f"{info['icon']} {institution}:")
            for cmd in info['commands']:
                print(f"  {cmd} <question>")
            print()

def test_discord_commands():
    """Show example Discord command usage."""
    
    print("\n💬 Example Discord Commands:")
    print("-" * 40)
    
    examples = [
        ("!brutus What does ACCTMIS 2200 cover?", "Ask Brutus about OSU courses"),
        ("!osuhelp Tell me about Ohio State football", "Get OSU help"),
        ("!buckeye What's campus like?", "Buckeye assistance"),
        ("!wolverine What's campus like?", "Ask Wolverine about UM"),
        ("!umhelp Tell me about Michigan football", "Get UM help"),
        ("!michigan Help with academics", "Michigan assistance"),
        ("!akorn What is Akorn?", "General academic help"),
        ("!help I need study tips", "Get assistance"),
        ("!assist Help with homework", "Academic support"),
        ("!mascothelp", "Show all available commands")
    ]
    
    for command, description in examples:
        print(f"  {command:<35} - {description}")

if __name__ == "__main__":
    test_mascot_responses()
    test_discord_commands()
    
    print("\n✅ Discord Bot Test Complete!")
    print("🚀 To run the actual Discord bot:")
    print("   1. Set your Discord bot token: export DISCORD_BOT_TOKEN='your_token'")
    print("   2. Run: python3 discord_bot_simple.py")
    print("   3. Use the commands in your Discord server!")
    print("\n📖 See DISCORD_BOT_SETUP.md for detailed setup instructions") 