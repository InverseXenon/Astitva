from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from enum import Enum

db = SQLAlchemy()

# Association Tables for Many-to-Many relationships
user_followers = db.Table('user_followers',
    db.Column('follower_id', db.String(36), db.ForeignKey('users.id'), primary_key=True),
    db.Column('followed_id', db.String(36), db.ForeignKey('users.id'), primary_key=True)
)

post_likes = db.Table('post_likes',
    db.Column('user_id', db.String(36), db.ForeignKey('users.id'), primary_key=True),
    db.Column('post_id', db.String(36), db.ForeignKey('posts.id'), primary_key=True)
)

post_saves = db.Table('post_saves',
    db.Column('user_id', db.String(36), db.ForeignKey('users.id'), primary_key=True),
    db.Column('post_id', db.String(36), db.ForeignKey('posts.id'), primary_key=True)
)

class UserStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    VERIFIED = "verified"

class PostCategory(Enum):
    CAREER = "Career"
    HEALTH = "Health"
    SAFETY = "Safety"
    LEGAL = "Legal"
    FINANCE = "Finance"
    MENTAL_HEALTH = "Mental Health"
    EDUCATION = "Education"
    GENERAL = "General"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_id = db.Column(db.String(100), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(255))
    location = db.Column(db.String(100))
    website = db.Column(db.String(255))
    birth_date = db.Column(db.Date)
    phone = db.Column(db.String(20))
    
    # Status and verification
    status = db.Column(db.Enum(UserStatus), default=UserStatus.ACTIVE, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    verified_at = db.Column(db.DateTime(timezone=True))
    
    # Privacy settings
    profile_public = db.Column(db.Boolean, default=True)
    show_email = db.Column(db.Boolean, default=False)
    show_phone = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    last_seen = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    
    # Relationships
    posts = db.relationship('Post', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    
    # Following relationships
    followed = db.relationship(
        'User', secondary=user_followers,
        primaryjoin=(user_followers.c.follower_id == id),
        secondaryjoin=(user_followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'), lazy='dynamic'
    )
    
    # Liked and saved posts
    liked_posts = db.relationship('Post', secondary=post_likes, backref=db.backref('liked_by', lazy='dynamic'))
    saved_posts = db.relationship('Post', secondary=post_saves, backref=db.backref('saved_by', lazy='dynamic'))
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email if self.show_email else None,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'bio': self.bio,
            'avatar_url': self.avatar_url,
            'location': self.location,
            'website': self.website,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
            'followers_count': self.followers.count(),
            'following_count': self.followed.count(),
            'posts_count': self.posts.count()
        }

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.Enum(PostCategory), nullable=False)
    tags = db.Column(db.JSON)  # Array of tags
    image_url = db.Column(db.String(255))
    
    # Author info
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    is_anonymous = db.Column(db.Boolean, default=False)
    
    # Engagement metrics
    views_count = db.Column(db.Integer, default=0)
    likes_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    shares_count = db.Column(db.Integer, default=0)
    
    # Moderation
    is_reported = db.Column(db.Boolean, default=False)
    is_hidden = db.Column(db.Boolean, default=False)
    report_count = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), index=True)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    comments = db.relationship('Comment', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    reports = db.relationship('PostReport', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Post {self.title[:50]}...>'
    
    def to_dict(self):
        try:
            if not self.is_anonymous and self.author:
                author_data = {
                    'id': self.author.id,
                    'username': self.author.username,
                    'first_name': self.author.first_name,
                    'last_name': self.author.last_name,
                    'is_verified': self.author.is_verified,
                    'avatar_url': self.author.avatar_url
                }
            else:
                author_data = {
                    'username': f'Anonymous_{self.id[:8]}',
                    'is_verified': False
                }
        except Exception:
            author_data = {
                'username': f'Anonymous_{self.id[:8]}',
                'is_verified': False
            }
            
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category.value,
            'tags': self.tags or [],
            'image_url': self.image_url,
            'author': author_data,
            'is_anonymous': self.is_anonymous,
            'views_count': self.views_count,
            'likes_count': self.likes_count,
            'comments_count': self.comments_count,
            'shares_count': self.shares_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'time_ago': self.get_time_ago()
        }
    
    def get_time_ago(self):
        try:
            now = datetime.now(timezone.utc)
            # Ensure created_at is timezone-aware
            created_at = self.created_at
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
            
            diff = now - created_at
            
            if diff.days > 0:
                return f"{diff.days}d ago"
            elif diff.seconds > 3600:
                hours = diff.seconds // 3600
                return f"{hours}h ago"
            elif diff.seconds > 60:
                minutes = diff.seconds // 60
                return f"{minutes}m ago"
            else:
                return "Just now"
        except Exception:
            return "Recently"

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content = db.Column(db.Text, nullable=False)
    
    # Relationships
    post_id = db.Column(db.String(36), db.ForeignKey('posts.id'), nullable=False, index=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    parent_id = db.Column(db.String(36), db.ForeignKey('comments.id'), index=True)  # For nested comments
    
    # Engagement
    likes_count = db.Column(db.Integer, default=0)
    
    # Moderation
    is_reported = db.Column(db.Boolean, default=False)
    is_hidden = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Self-referential relationship for nested comments
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    
    def __repr__(self):
        return f'<Comment {self.content[:50]}...>'
    
    def to_dict(self):
        try:
            if self.author:
                author_data = {
                    'id': self.author.id,
                    'username': self.author.username,
                    'first_name': self.author.first_name,
                    'last_name': self.author.last_name,
                    'is_verified': self.author.is_verified,
                    'avatar_url': self.author.avatar_url
                }
            else:
                author_data = {'username': 'Unknown', 'is_verified': False}
        except Exception:
            author_data = {'username': 'Unknown', 'is_verified': False}
            
        return {
            'id': self.id,
            'content': self.content,
            'author': author_data,
            'likes_count': self.likes_count,
            'created_at': self.created_at.isoformat(),
            'replies_count': self.replies.count() if self.replies else 0,
            'time_ago': self.get_time_ago()
        }
    
    def get_time_ago(self):
        try:
            now = datetime.now(timezone.utc)
            # Ensure created_at is timezone-aware
            created_at = self.created_at
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
            
            diff = now - created_at
            
            if diff.days > 0:
                return f"{diff.days}d ago"
            elif diff.seconds > 3600:
                hours = diff.seconds // 3600
                return f"{hours}h ago"
            elif diff.seconds > 60:
                minutes = diff.seconds // 60
                return f"{minutes}m ago"
            else:
                return "Just now"
        except Exception:
            return "Recently"

class PostReport(db.Model):
    __tablename__ = 'post_reports'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = db.Column(db.String(36), db.ForeignKey('posts.id'), nullable=False)
    reporter_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    reason = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, reviewed, resolved
    
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    
    reporter = db.relationship('User', backref='reports_made')

class UserActivity(db.Model):
    __tablename__ = 'user_activities'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    activity_type = db.Column(db.String(50), nullable=False)  # post_created, comment_added, user_followed, etc.
    activity_data = db.Column(db.JSON)  # Additional activity data
    
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), index=True)
    
    user = db.relationship('User', backref='activities')

class JobPost(db.Model):
    __tablename__ = 'job_posts'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    salary_range = db.Column(db.String(50))
    job_type = db.Column(db.String(50))  # full-time, part-time, contract, remote
    experience_level = db.Column(db.String(50))  # entry, mid, senior
    application_url = db.Column(db.String(255))
    
    # Metadata
    posted_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    is_active = db.Column(db.Boolean, default=True)
    expires_at = db.Column(db.DateTime(timezone=True))
    
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    poster = db.relationship('User', backref='job_posts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'description': self.description,
            'requirements': self.requirements,
            'salary_range': self.salary_range,
            'job_type': self.job_type,
            'experience_level': self.experience_level,
            'application_url': self.application_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        } 