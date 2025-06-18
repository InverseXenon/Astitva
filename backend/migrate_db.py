#!/usr/bin/env python3
"""
Database Migration Script for Astitva - Reddit-like Features
This script updates the database schema to include new features:
- Voting system (upvotes/downvotes)
- Awards system
- Enhanced user profiles with karma
- Comment voting
- User following
"""

import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

# Add the current directory to the path so we can import our models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User, Post, Comment, Vote, Award, VoteType, AwardType

def migrate_database():
    """Run database migrations to add new features"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🔄 Starting database migration...")
            
            # Create all new tables
            print("📋 Creating new tables...")
            db.create_all()
            
            # Add new columns to existing tables
            print("🔧 Adding new columns to existing tables...")
            
            # Add new columns to users table
            user_columns = [
                "ALTER TABLE users ADD COLUMN karma_score INTEGER DEFAULT 0",
                "ALTER TABLE users ADD COLUMN post_karma INTEGER DEFAULT 0", 
                "ALTER TABLE users ADD COLUMN comment_karma INTEGER DEFAULT 0",
                "ALTER TABLE users ADD COLUMN awards_given INTEGER DEFAULT 0",
                "ALTER TABLE users ADD COLUMN awards_received INTEGER DEFAULT 0",
                "ALTER TABLE users ADD COLUMN preferred_categories JSON",
                "ALTER TABLE users ADD COLUMN notification_settings JSON",
                "ALTER TABLE users ADD COLUMN display_name VARCHAR(100)",
                "ALTER TABLE users ADD COLUMN is_moderator BOOLEAN DEFAULT FALSE",
                "ALTER TABLE users ADD COLUMN show_karma BOOLEAN DEFAULT TRUE"
            ]
            
            # Add new columns to posts table
            post_columns = [
                "ALTER TABLE posts ADD COLUMN link_url VARCHAR(500)",
                "ALTER TABLE posts ADD COLUMN post_type VARCHAR(20) DEFAULT 'text'",
                "ALTER TABLE posts ADD COLUMN upvotes INTEGER DEFAULT 0",
                "ALTER TABLE posts ADD COLUMN downvotes INTEGER DEFAULT 0",
                "ALTER TABLE posts ADD COLUMN score INTEGER DEFAULT 0",
                "ALTER TABLE posts ADD COLUMN awards_count INTEGER DEFAULT 0",
                "ALTER TABLE posts ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE",
                "ALTER TABLE posts ADD COLUMN is_featured BOOLEAN DEFAULT FALSE",
                "ALTER TABLE posts ADD COLUMN quality_score REAL DEFAULT 0.0",
                "ALTER TABLE posts ADD COLUMN is_locked BOOLEAN DEFAULT FALSE"
            ]
            
            # Add new columns to comments table
            comment_columns = [
                "ALTER TABLE comments ADD COLUMN upvotes INTEGER DEFAULT 0",
                "ALTER TABLE comments ADD COLUMN downvotes INTEGER DEFAULT 0", 
                "ALTER TABLE comments ADD COLUMN score INTEGER DEFAULT 0",
                "ALTER TABLE comments ADD COLUMN is_edited BOOLEAN DEFAULT FALSE",
                "ALTER TABLE comments ADD COLUMN edit_count INTEGER DEFAULT 0",
                "ALTER TABLE comments ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE"
            ]
            
            # Execute column additions (ignore errors if columns already exist)
            all_columns = user_columns + post_columns + comment_columns
            
            for sql in all_columns:
                try:
                    db.session.execute(text(sql))
                    print(f"✅ Added: {sql.split('ADD COLUMN')[1].split()[0] if 'ADD COLUMN' in sql else sql}")
                except Exception as e:
                    if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                        print(f"⚠️  Column already exists: {sql.split('ADD COLUMN')[1].split()[0] if 'ADD COLUMN' in sql else sql}")
                    else:
                        print(f"❌ Error adding column: {e}")
            
            # Commit the changes
            db.session.commit()
            
            # Update existing data
            print("📊 Updating existing data...")
            
            # Update all users' karma scores
            users = User.query.all()
            for user in users:
                user.update_karma()
                print(f"Updated karma for user: {user.username}")
            
            # Update all posts' scores
            posts = Post.query.all()
            for post in posts:
                post.update_score()
                print(f"Updated score for post: {post.title[:50]}...")
            
            # Update all comments' scores
            comments = Comment.query.all()
            for comment in comments:
                comment.update_score()
                print(f"Updated score for comment: {comment.content[:30]}...")
            
            db.session.commit()
            
            print("✅ Database migration completed successfully!")
            print(f"📈 Updated {len(users)} users, {len(posts)} posts, and {len(comments)} comments")
            
            # Show statistics
            print("\n📊 Database Statistics:")
            print(f"👥 Total Users: {User.query.count()}")
            print(f"📝 Total Posts: {Post.query.count()}")
            print(f"💬 Total Comments: {Comment.query.count()}")
            print(f"🗳️ Total Votes: {Vote.query.count() if 'votes' in db.engine.table_names() else 0}")
            print(f"🏆 Total Awards: {Award.query.count() if 'awards' in db.engine.table_names() else 0}")
            
        except Exception as e:
            print(f"❌ Migration failed: {e}")
            db.session.rollback()
            return False
        
    return True

def rollback_migration():
    """Rollback database changes (use with caution!)"""
    app = create_app()
    
    with app.app_context():
        try:
            print("⚠️  WARNING: This will remove all new features and data!")
            confirm = input("Type 'CONFIRM' to proceed with rollback: ")
            
            if confirm != 'CONFIRM':
                print("❌ Rollback cancelled.")
                return False
            
            print("🔄 Rolling back database changes...")
            
            # Drop new tables
            tables_to_drop = ['votes', 'awards']
            for table in tables_to_drop:
                try:
                    db.session.execute(text(f"DROP TABLE IF EXISTS {table}"))
                    print(f"🗑️  Dropped table: {table}")
                except Exception as e:
                    print(f"⚠️  Could not drop table {table}: {e}")
            
            # Remove new columns (SQLite doesn't support DROP COLUMN easily)
            print("⚠️  Note: New columns will remain but won't be used")
            
            db.session.commit()
            print("✅ Rollback completed!")
            
        except Exception as e:
            print(f"❌ Rollback failed: {e}")
            db.session.rollback()
            return False
    
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--rollback":
        rollback_migration()
    else:
        migrate_database() 