from app import create_app
from models import db, User, Post, Comment, JobPost, PostCategory, UserStatus
from datetime import datetime, timezone, timedelta
import random

def seed_database():
    app = create_app()
    
    with app.app_context():
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        print("Creating sample users...")
        
        # Sample users
        users_data = [
            {
                'clerk_id': 'user_1_clerk',
                'username': 'priya_sharma',
                'email': 'priya.sharma@example.com',
                'first_name': 'Priya',
                'last_name': 'Sharma',
                'bio': 'Software engineer passionate about women empowerment and tech education.',
                'location': 'Mumbai, India',
                'is_verified': True
            },
            {
                'clerk_id': 'user_2_clerk',
                'username': 'aisha_khan',
                'email': 'aisha.khan@example.com',
                'first_name': 'Aisha',
                'last_name': 'Khan',
                'bio': 'Healthcare professional advocating for women\'s health awareness.',
                'location': 'Delhi, India',
                'is_verified': True
            },
            {
                'clerk_id': 'user_3_clerk',
                'username': 'meera_patel',
                'email': 'meera.patel@example.com',
                'first_name': 'Meera',
                'last_name': 'Patel',
                'bio': 'Entrepreneur and startup founder in sustainable technology.',
                'location': 'Bangalore, India',
                'is_verified': False
            },
            {
                'clerk_id': 'user_4_clerk',
                'username': 'rina_desai',
                'email': 'rina.desai@example.com',
                'first_name': 'Rina',
                'last_name': 'Desai',
                'bio': 'Educator and advocate for women\'s rights and legal awareness.',
                'location': 'Pune, India',
                'is_verified': True
            },
            {
                'clerk_id': 'user_5_clerk',
                'username': 'neha_gupta',
                'email': 'neha.gupta@example.com',
                'first_name': 'Neha',
                'last_name': 'Gupta',
                'bio': 'Financial analyst helping women achieve financial independence.',
                'location': 'Hyderabad, India',
                'is_verified': False
            }
        ]
        
        users = []
        for user_data in users_data:
            user = User(**user_data)
            users.append(user)
            db.session.add(user)
        
        db.session.commit()
        print(f"Created {len(users)} users")
        
        print("Creating sample posts...")
        
        # Sample posts
        posts_data = [
            {
                'title': 'Breaking the Glass Ceiling: My Journey in Tech',
                'content': 'After 5 years in the tech industry, I want to share my experiences and the challenges I faced as a woman in a male-dominated field. From dealing with imposter syndrome to finding mentors, here\'s what I learned...',
                'category': PostCategory.CAREER,
                'tags': ['tech', 'career-growth', 'mentorship'],
                'is_anonymous': False
            },
            {
                'title': 'Understanding PCOS: A Comprehensive Guide',
                'content': 'PCOS affects 1 in 10 women of reproductive age. As a healthcare professional, I want to share important information about symptoms, diagnosis, and management strategies that can help...',
                'category': PostCategory.HEALTH,
                'tags': ['pcos', 'women-health', 'medical-advice'],
                'is_anonymous': False
            },
            {
                'title': 'How I Started My First Business with ₹50,000',
                'content': 'Starting a business seemed impossible until I took the first step. Here\'s how I bootstrapped my sustainable tech startup with minimal funding and the lessons I learned along the way...',
                'category': PostCategory.FINANCE,
                'tags': ['entrepreneurship', 'startup', 'business-tips'],
                'is_anonymous': False
            },
            {
                'title': 'Know Your Legal Rights: Workplace Harassment',
                'content': 'Every woman should know her rights when it comes to workplace harassment. This post covers the legal framework in India, how to document incidents, and steps to take for justice...',
                'category': PostCategory.LEGAL,
                'tags': ['legal-rights', 'workplace', 'harassment'],
                'is_anonymous': False
            },
            {
                'title': 'Building Financial Independence: My 5-Year Plan',
                'content': 'Financial independence seemed like a dream until I created a structured plan. Here\'s my step-by-step approach to budgeting, investing, and building wealth over 5 years...',
                'category': PostCategory.FINANCE,
                'tags': ['financial-planning', 'investing', 'budgeting'],
                'is_anonymous': False
            },
            {
                'title': 'Dealing with Anxiety and Depression',
                'content': 'Mental health is as important as physical health. I want to share my journey with anxiety and depression, the therapy techniques that helped, and resources available for women...',
                'category': PostCategory.MENTAL_HEALTH,
                'tags': ['mental-health', 'anxiety', 'therapy'],
                'is_anonymous': True
            },
            {
                'title': 'Safety Tips for Women Traveling Alone',
                'content': 'Solo travel can be empowering but requires preparation. Here are practical safety tips I\'ve learned from traveling across India and internationally as a woman...',
                'category': PostCategory.SAFETY,
                'tags': ['travel-safety', 'solo-travel', 'women-safety'],
                'is_anonymous': False
            },
            {
                'title': 'Negotiating Your Salary: A Woman\'s Guide',
                'content': 'The gender pay gap is real, but we can fight it by negotiating effectively. Here\'s how to research market rates, prepare your case, and confidently ask for what you deserve...',
                'category': PostCategory.CAREER,
                'tags': ['salary-negotiation', 'career-advice', 'pay-equity'],
                'is_anonymous': False
            }
        ]
        
        posts = []
        for i, post_data in enumerate(posts_data):
            post = Post(
                **post_data,
                user_id=users[i % len(users)].id,
                views_count=random.randint(50, 500),
                likes_count=random.randint(5, 50),
                comments_count=random.randint(2, 15),
                created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30))
            )
            posts.append(post)
            db.session.add(post)
        
        db.session.commit()
        print(f"Created {len(posts)} posts")
        
        print("Creating sample comments...")
        
        # Sample comments
        comments_data = [
            "Thank you for sharing this! Very inspiring story.",
            "This is exactly what I needed to read today. Great advice!",
            "Could you share more details about the resources you mentioned?",
            "I had a similar experience. It's so important to talk about these issues.",
            "Really helpful information. Bookmarking this for future reference.",
            "This changed my perspective completely. Thank you!",
            "More women need to see this. Sharing with my network.",
            "Great post! Do you have any book recommendations on this topic?",
            "I wish I had this information when I was starting out.",
            "Thank you for being so open about your experiences."
        ]
        
        comments = []
        for post in posts:
            num_comments = random.randint(2, 8)
            for _ in range(num_comments):
                comment = Comment(
                    content=random.choice(comments_data),
                    post_id=post.id,
                    user_id=random.choice(users).id,
                    likes_count=random.randint(0, 10),
                    created_at=post.created_at + timedelta(hours=random.randint(1, 48))
                )
                comments.append(comment)
                db.session.add(comment)
        
        db.session.commit()
        print(f"Created {len(comments)} comments")
        
        print("Creating sample job posts...")
        
        # Sample job posts
        jobs_data = [
            {
                'title': 'Senior Software Engineer - Women-Only Hiring',
                'company': 'TechCorp Solutions',
                'location': 'Mumbai, Maharashtra',
                'description': 'We are looking for a senior software engineer to join our diverse team. This is part of our women-in-tech initiative to create more inclusive workplaces.',
                'requirements': 'Bachelor\'s degree in Computer Science, 3+ years experience in Python/React, Strong problem-solving skills',
                'salary_range': '₹8-12 LPA',
                'job_type': 'full-time',
                'experience_level': 'mid'
            },
            {
                'title': 'Digital Marketing Manager',
                'company': 'GreenTech Innovations',
                'location': 'Bangalore, Karnataka',
                'description': 'Join our mission to promote sustainable technology through innovative digital marketing strategies. We encourage applications from women returners.',
                'requirements': 'MBA in Marketing, 2+ years experience in digital marketing, Knowledge of SEO/SEM',
                'salary_range': '₹6-9 LPA',
                'job_type': 'full-time',
                'experience_level': 'mid'
            },
            {
                'title': 'Financial Analyst - Flexible Hours',
                'company': 'InvestSmart Capital',
                'location': 'Delhi, NCR',
                'description': 'Seeking a detail-oriented financial analyst. We offer flexible working hours and remote work options to support work-life balance.',
                'requirements': 'CFA/CA preferred, 2+ years in financial analysis, Excel proficiency',
                'salary_range': '₹5-8 LPA',
                'job_type': 'full-time',
                'experience_level': 'entry'
            },
            {
                'title': 'Data Scientist - Remote',
                'company': 'AI Innovations Lab',
                'location': 'Remote',
                'description': 'Work on cutting-edge AI projects from anywhere. We believe in diversity driving innovation and actively encourage women to apply.',
                'requirements': 'Masters in Data Science/Statistics, Python/R proficiency, Machine Learning experience',
                'salary_range': '₹10-15 LPA',
                'job_type': 'remote',
                'experience_level': 'mid'
            },
            {
                'title': 'Content Writer - Part Time',
                'company': 'Creative Women Hub',
                'location': 'Pune, Maharashtra',
                'description': 'Perfect for women looking to restart their careers or seeking part-time opportunities. Create content that empowers and inspires.',
                'requirements': 'Excellent writing skills, Bachelor\'s degree, Experience in content creation',
                'salary_range': '₹15,000-25,000/month',
                'job_type': 'part-time',
                'experience_level': 'entry'
            }
        ]
        
        job_posts = []
        for job_data in jobs_data:
            job = JobPost(
                **job_data,
                posted_by=random.choice(users).id,
                expires_at=datetime.now(timezone.utc) + timedelta(days=30),
                created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 15))
            )
            job_posts.append(job)
            db.session.add(job)
        
        db.session.commit()
        print(f"Created {len(job_posts)} job posts")
        
        print("Setting up user relationships...")
        
        # Create some following relationships
        users[0].followed.append(users[1])
        users[0].followed.append(users[2])
        users[1].followed.append(users[0])
        users[1].followed.append(users[3])
        users[2].followed.append(users[0])
        users[3].followed.append(users[1])
        users[3].followed.append(users[4])
        users[4].followed.append(users[0])
        users[4].followed.append(users[2])
        
        # Add some likes to posts
        for user in users[:3]:
            liked_posts = random.sample(posts, random.randint(2, 5))
            for post in liked_posts:
                user.liked_posts.append(post)
        
        # Add some saved posts
        for user in users[:2]:
            saved_posts = random.sample(posts, random.randint(1, 3))
            for post in saved_posts:
                user.saved_posts.append(post)
        
        db.session.commit()
        print("Database seeded successfully!")
        
        # Print summary
        print(f"\nSummary:")
        print(f"Users: {User.query.count()}")
        print(f"Posts: {Post.query.count()}")
        print(f"Comments: {Comment.query.count()}")
        print(f"Job Posts: {JobPost.query.count()}")

if __name__ == "__main__":
    seed_database() 