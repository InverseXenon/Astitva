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

# New association tables for enhanced features
comment_likes = db.Table('comment_likes',
    db.Column('user_id', db.String(36), db.ForeignKey('users.id'), primary_key=True),
    db.Column('comment_id', db.String(36), db.ForeignKey('comments.id'), primary_key=True)
)

post_awards = db.Table('post_awards',
    db.Column('user_id', db.String(36), db.ForeignKey('users.id'), primary_key=True),
    db.Column('post_id', db.String(36), db.ForeignKey('posts.id'), primary_key=True),
    db.Column('award_type', db.String(50), nullable=False),
    db.Column('awarded_at', db.DateTime(timezone=True), default=datetime.now(timezone.utc))
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

class VoteType(Enum):
    UPVOTE = "upvote"
    DOWNVOTE = "downvote"

class AwardType(Enum):
    HELPFUL = "helpful"
    INSPIRING = "inspiring"
    SUPPORTIVE = "supportive"
    INFORMATIVE = "informative"
    FUNNY = "funny"
    GOLD = "gold"

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
    
    # Reddit-like features
    karma_score = db.Column(db.Integer, default=0)
    post_karma = db.Column(db.Integer, default=0)
    comment_karma = db.Column(db.Integer, default=0)
    awards_given = db.Column(db.Integer, default=0)
    awards_received = db.Column(db.Integer, default=0)
    
    # User preferences
    preferred_categories = db.Column(db.JSON)  # Array of preferred categories
    notification_settings = db.Column(db.JSON)  # Notification preferences
    display_name = db.Column(db.String(100))  # Custom display name
    
    # Status and verification
    status = db.Column(db.Enum(UserStatus), default=UserStatus.ACTIVE, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    verified_at = db.Column(db.DateTime(timezone=True))
    is_moderator = db.Column(db.Boolean, default=False)
    
    # Privacy settings
    profile_public = db.Column(db.Boolean, default=True)
    show_email = db.Column(db.Boolean, default=False)
    show_phone = db.Column(db.Boolean, default=False)
    show_karma = db.Column(db.Boolean, default=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    last_seen = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    
    # Relationships
    posts = db.relationship('Post', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    votes = db.relationship('Vote', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
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
    liked_comments = db.relationship('Comment', secondary=comment_likes, backref=db.backref('liked_by', lazy='dynamic'))
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def update_karma(self):
        """Update user's karma based on their posts and comments"""
        self.post_karma = sum(post.score for post in self.posts)
        self.comment_karma = sum(comment.score for comment in self.comments)
        self.karma_score = self.post_karma + self.comment_karma
    
    def to_dict(self, include_private=False):
        data = {
            'id': self.id,
            'username': self.username,
            'display_name': self.display_name or self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'bio': self.bio,
            'avatar_url': self.avatar_url,
            'location': self.location,
            'website': self.website,
            'is_verified': self.is_verified,
            'is_moderator': self.is_moderator,
            'created_at': self.created_at.isoformat(),
            'followers_count': self.followers.count(),
            'following_count': self.followed.count(),
            'posts_count': self.posts.count(),
            'comments_count': self.comments.count(),
        }
        
        if self.show_karma:
            data.update({
                'karma_score': self.karma_score,
                'post_karma': self.post_karma,
                'comment_karma': self.comment_karma,
                'awards_given': self.awards_given,
                'awards_received': self.awards_received
            })
        
        if include_private:
            data.update({
                'email': self.email if self.show_email else None,
                'phone': self.phone if self.show_phone else None,
                'preferred_categories': self.preferred_categories,
                'notification_settings': self.notification_settings
            })
        
        return data

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.Enum(PostCategory), nullable=False)
    tags = db.Column(db.JSON)  # Array of tags
    image_url = db.Column(db.String(255))
    link_url = db.Column(db.String(500))  # For link posts
    post_type = db.Column(db.String(20), default='text')  # text, link, image
    
    # Author info
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    is_anonymous = db.Column(db.Boolean, default=False)
    
    # Reddit-like scoring
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    score = db.Column(db.Integer, default=0)  # upvotes - downvotes
    
    # Engagement metrics
    views_count = db.Column(db.Integer, default=0)
    likes_count = db.Column(db.Integer, default=0)  # Legacy, keeping for compatibility
    comments_count = db.Column(db.Integer, default=0)
    shares_count = db.Column(db.Integer, default=0)
    awards_count = db.Column(db.Integer, default=0)
    
    # Content quality
    is_pinned = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)
    quality_score = db.Column(db.Float, default=0.0)  # Algorithm-based quality score
    
    # Moderation
    is_reported = db.Column(db.Boolean, default=False)
    is_hidden = db.Column(db.Boolean, default=False)
    is_locked = db.Column(db.Boolean, default=False)  # Prevents new comments
    report_count = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), index=True)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    comments = db.relationship('Comment', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    reports = db.relationship('PostReport', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    votes = db.relationship('Vote', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Post {self.title[:50]}...>'
    
    def update_score(self):
        """Update post score based on votes"""
        self.score = self.upvotes - self.downvotes
        # Update quality score based on engagement
        if self.views_count > 0:
            engagement_rate = (self.upvotes + self.comments_count) / self.views_count
            self.quality_score = min(engagement_rate * 100, 100.0)
    
    def get_user_vote(self, user_id):
        """Get user's vote on this post"""
        if not user_id:
            return None
        vote = Vote.query.filter_by(user_id=user_id, post_id=self.id).first()
        return vote.vote_type.value if vote else None
    
    def to_dict(self, user_id=None):
        try:
            if not self.is_anonymous and self.author:
                author_data = {
                    'id': self.author.id,
                    'username': self.author.username,
                    'display_name': self.author.display_name or self.author.username,
                    'first_name': self.author.first_name,
                    'last_name': self.author.last_name,
                    'is_verified': self.author.is_verified,
                    'is_moderator': self.author.is_moderator,
                    'avatar_url': self.author.avatar_url,
                    'karma_score': self.author.karma_score if self.author.show_karma else None
                }
            else:
                author_data = {
                    'username': f'Anonymous_{self.id[:8]}',
                    'display_name': f'Anonymous_{self.id[:8]}',
                    'is_verified': False,
                    'is_moderator': False
                }
        except Exception:
            author_data = {
                'username': f'Anonymous_{self.id[:8]}',
                'display_name': f'Anonymous_{self.id[:8]}',
                'is_verified': False,
                'is_moderator': False
            }
        
        # Get awards summary
        awards_summary = {}
        if self.awards_count > 0:
            # This would be populated by actual award data
            awards_summary = {'total': self.awards_count}
            
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category.value,
            'tags': self.tags or [],
            'image_url': self.image_url,
            'link_url': self.link_url,
            'post_type': self.post_type,
            'author': author_data,
            'is_anonymous': self.is_anonymous,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            'score': self.score,
            'views_count': self.views_count,
            'comments_count': self.comments_count,
            'shares_count': self.shares_count,
            'awards_count': self.awards_count,
            'awards': awards_summary,
            'is_pinned': self.is_pinned,
            'is_featured': self.is_featured,
            'is_locked': self.is_locked,
            'quality_score': self.quality_score,
            'user_vote': self.get_user_vote(user_id),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'time_ago': self.get_time_ago()
        }
    
    def get_time_ago(self):
        try:
            now = datetime.now(timezone.utc)
            created_at = self.created_at
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
            
            diff = now - created_at
            
            if diff.days > 365:
                return f"{diff.days // 365}y ago"
            elif diff.days > 30:
                return f"{diff.days // 30}mo ago"
            elif diff.days > 0:
                return f"{diff.days}d ago"
            elif diff.seconds > 3600:
                hours = diff.seconds // 3600
                return f"{hours}h ago"
            elif diff.seconds > 60:
                minutes = diff.seconds // 60
                return f"{minutes}m ago"
            else:
                return "just now"
        except Exception:
            return "unknown"

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content = db.Column(db.Text, nullable=False)
    
    # Relationships
    post_id = db.Column(db.String(36), db.ForeignKey('posts.id'), nullable=False, index=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    parent_id = db.Column(db.String(36), db.ForeignKey('comments.id'), index=True)
    
    # Reddit-like scoring
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    score = db.Column(db.Integer, default=0)
    
    # Legacy engagement
    likes_count = db.Column(db.Integer, default=0)
    
    # Content features
    is_edited = db.Column(db.Boolean, default=False)
    edit_count = db.Column(db.Integer, default=0)
    
    # Moderation
    is_reported = db.Column(db.Boolean, default=False)
    is_hidden = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Self-referential relationship for nested comments
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    votes = db.relationship('Vote', backref='comment', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Comment {self.content[:30]}...>'
    
    def update_score(self):
        """Update comment score based on votes"""
        self.score = self.upvotes - self.downvotes
    
    def get_user_vote(self, user_id):
        """Get user's vote on this comment"""
        if not user_id:
            return None
        vote = Vote.query.filter_by(user_id=user_id, comment_id=self.id).first()
        return vote.vote_type.value if vote else None
    
    def to_dict(self, user_id=None, include_replies=True):
        try:
            author_data = {
                'id': self.author.id,
                'username': self.author.username,
                'display_name': self.author.display_name or self.author.username,
                'is_verified': self.author.is_verified,
                'is_moderator': self.author.is_moderator,
                'avatar_url': self.author.avatar_url,
                'karma_score': self.author.karma_score if self.author.show_karma else None
            }
        except Exception:
            author_data = {
                'username': 'deleted_user',
                'display_name': 'deleted_user',
                'is_verified': False,
                'is_moderator': False
            }
        
        data = {
            'id': self.id,
            'content': '[deleted]' if self.is_deleted else self.content,
            'author': author_data,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            'score': self.score,
            'is_edited': self.is_edited,
            'edit_count': self.edit_count,
            'user_vote': self.get_user_vote(user_id),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'time_ago': self.get_time_ago(),
            'replies_count': self.replies.count()
        }
        
        if include_replies and self.replies.count() > 0:
            data['replies'] = [reply.to_dict(user_id, include_replies=False) 
                             for reply in self.replies.order_by(Comment.score.desc())]
        
        return data
    
    def get_time_ago(self):
        try:
            now = datetime.now(timezone.utc)
            created_at = self.created_at
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
            
            diff = now - created_at
            
            if diff.days > 365:
                return f"{diff.days // 365}y"
            elif diff.days > 30:
                return f"{diff.days // 30}mo"
            elif diff.days > 0:
                return f"{diff.days}d"
            elif diff.seconds > 3600:
                return f"{diff.seconds // 3600}h"
            elif diff.seconds > 60:
                return f"{diff.seconds // 60}m"
            else:
                return "now"
        except Exception:
            return "?"

class Vote(db.Model):
    __tablename__ = 'votes'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    post_id = db.Column(db.String(36), db.ForeignKey('posts.id'), nullable=True, index=True)
    comment_id = db.Column(db.String(36), db.ForeignKey('comments.id'), nullable=True, index=True)
    vote_type = db.Column(db.Enum(VoteType), nullable=False)
    
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    
    # Ensure a user can only vote once per post/comment
    __table_args__ = (
        db.UniqueConstraint('user_id', 'post_id', name='unique_post_vote'),
        db.UniqueConstraint('user_id', 'comment_id', name='unique_comment_vote'),
    )

class Award(db.Model):
    __tablename__ = 'awards'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    giver_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.String(36), db.ForeignKey('posts.id'), nullable=True)
    comment_id = db.Column(db.String(36), db.ForeignKey('comments.id'), nullable=True)
    award_type = db.Column(db.Enum(AwardType), nullable=False)
    message = db.Column(db.Text)  # Optional message from giver
    
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    
    giver = db.relationship('User', foreign_keys=[giver_id], backref='awards_given_list')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='awards_received_list')
    post = db.relationship('Post', backref='awards_list')
    comment = db.relationship('Comment', backref='awards_list')

class PostReport(db.Model):
    __tablename__ = 'post_reports'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = db.Column(db.String(36), db.ForeignKey('posts.id'), nullable=False)
    reporter_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    reason = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    
    reporter = db.relationship('User', backref='reports_made')

class UserActivity(db.Model):
    __tablename__ = 'user_activities'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    activity_type = db.Column(db.String(50), nullable=False)
    activity_data = db.Column(db.JSON)
    
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
    job_type = db.Column(db.String(50))
    experience_level = db.Column(db.String(50))
    application_url = db.Column(db.String(255))
    
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
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'created_at': self.created_at.isoformat(),
            'poster': self.poster.username if self.poster else None
        } 