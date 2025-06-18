#!/usr/bin/env python3
"""
Test script to verify user creation and post creation functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User, Post, PostCategory
import json

def test_user_and_post_creation():
    """Test creating a user and post"""
    app = create_app()
    
    with app.app_context():
        # Test creating a user (simulating Clerk user)
        test_user_data = {
            'clerk_id': 'test_clerk_123',
            'username': 'test_user',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        # Check if user already exists
        existing_user = User.query.filter_by(clerk_id=test_user_data['clerk_id']).first()
        if existing_user:
            print(f"✅ User already exists: {existing_user.username}")
            test_user = existing_user
        else:
            print("Creating new test user...")
            test_user = User(**test_user_data)
            db.session.add(test_user)
            db.session.commit()
            print(f"✅ Created user: {test_user.username}")
        
        # Test creating a post
        test_post_data = {
            'title': 'Test Post Creation',
            'content': 'This is a test post to verify functionality.',
            'category': PostCategory.GENERAL,
            'user_id': test_user.id,
            'is_anonymous': False,
            'tags': ['test', 'functionality']
        }
        
        print("Creating test post...")
        test_post = Post(**test_post_data)
        db.session.add(test_post)
        db.session.commit()
        print(f"✅ Created post: {test_post.title} (ID: {test_post.id})")
        
        # Test the to_dict method
        print("\n📋 Post data as dict:")
        post_dict = test_post.to_dict(user_id=test_user.id)
        print(json.dumps(post_dict, indent=2, default=str))
        
        # Clean up test data
        db.session.delete(test_post)
        if not existing_user:  # Only delete if we created it
            db.session.delete(test_user)
        db.session.commit()
        print("\n🧹 Cleaned up test data")
        
        return True

def test_api_endpoint():
    """Test the actual API endpoint"""
    app = create_app()
    
    with app.test_client() as client:
        # Test health endpoint
        response = client.get('/api/health')
        print(f"\n🏥 Health check status: {response.status_code}")
        print(f"Response: {response.get_json()}")
        
        # Test posts endpoint
        response = client.get('/api/posts')
        print(f"\n📝 Posts endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.get_json()
            print(f"Posts count: {len(data.get('posts', []))}")
        else:
            print(f"Error: {response.get_data(as_text=True)}")
        
        return True

if __name__ == "__main__":
    print("🧪 Testing User and Post Creation...")
    try:
        test_user_and_post_creation()
        test_api_endpoint()
        print("\n✅ All tests passed!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc() 