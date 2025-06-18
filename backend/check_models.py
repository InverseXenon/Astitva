#!/usr/bin/env python3
"""
Check available Gemini models for your API key
"""
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
api_key = os.environ.get('GEMINI_API_KEY')
if not api_key:
    print("❌ GEMINI_API_KEY not found in .env file")
    exit(1)

genai.configure(api_key=api_key)

print("🔍 Checking available Gemini models...")
print("=" * 50)

try:
    models = genai.list_models()
    
    print("✅ Available models:")
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            print(f"  • {model.name}")
            print(f"    Display: {model.display_name}")
            print(f"    Version: {model.version}")
            print()
    
    # Test the model we're using
    print("🧪 Testing gemini-1.5-flash...")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say hello!")
    print(f"✅ Test successful: {response.text}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n💡 Suggestions:")
    print("1. Check your API key is correct")
    print("2. Try 'gemini-1.0-pro' model instead")
    print("3. Ensure you have Gemini API access enabled") 