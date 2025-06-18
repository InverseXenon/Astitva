#!/usr/bin/env python3
"""
Build script for Astitva - Merges frontend and backend
"""
import os
import subprocess
import sys
import shutil

def run_command(command, cwd=None):
    """Run a command and return success status"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, 
                              capture_output=True, text=True)
        print(f"✅ {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {command}")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("🚀 Building Astitva Application")
    print("=" * 50)
    
    # Check if we're in the root directory
    if not os.path.exists('package.json'):
        print("❌ package.json not found. Please run this script from the root directory.")
        sys.exit(1)
    
    # Step 1: Install frontend dependencies
    print("📦 Installing frontend dependencies...")
    if not run_command("npm install"):
        print("❌ Failed to install frontend dependencies")
        sys.exit(1)
    
    # Step 2: Build frontend
    print("🔨 Building frontend...")
    if not run_command("npm run build"):
        print("❌ Failed to build frontend")
        sys.exit(1)
    
    # Step 3: Install backend dependencies
    print("🐍 Installing backend dependencies...")
    if not run_command("pip install -r requirements.txt", cwd="backend"):
        print("❌ Failed to install backend dependencies")
        sys.exit(1)
    
    # Step 4: Check if dist directory exists
    if not os.path.exists('dist'):
        print("❌ Frontend build failed - dist directory not found")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("🎉 Build completed successfully!")
    print("📁 Frontend built in: ./dist")
    print("🔧 Backend configured to serve frontend")
    print("=" * 50)
    print("\n📋 Next steps:")
    print("1. Create a .env file in the backend directory with your API keys:")
    print("   GEMINI_API_KEY=your-gemini-api-key-here")
    print("2. Start the application:")
    print("   cd backend && python app.py")
    print("3. Open http://localhost:5000 in your browser")
    print("\n🌟 Your frontend and backend are now merged!")

if __name__ == "__main__":
    main() 