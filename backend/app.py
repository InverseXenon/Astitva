from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import google.generativeai as genai
from datetime import datetime, timezone
from werkzeug.utils import secure_filename
import uuid
from PIL import Image
import io

from config import config
from models import db, User, Post, Comment, JobPost, PostCategory, UserActivity

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__, static_folder='../dist', static_url_path='')
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Initialize rate limiter
    limiter = Limiter(
        key_func=get_remote_address,
        app=app,
        default_limits=["100/hour"]
    )
    
    # Setup Gemini AI
    genai.configure(api_key=app.config['GEMINI_API_KEY'])
    
    # Create upload directory
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    def allowed_file(filename):
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']
    
    def build_refined_prompt(user_query: str) -> str:
        prompt = (
            "You are Sakhi (Hindi: सखी, meaning 'trusted female friend'), an AI assistant specifically designed to empower women "
            "in India and globally. You are warm, empathetic, knowledgeable, and culturally sensitive.\n\n"
            
            "🌟 **YOUR CORE MISSION:** Provide comprehensive support for women's empowerment across all life stages\n\n"
            
            "📋 **YOUR EXPERTISE AREAS:**\n"
            "🏛️ **Legal Rights & Justice:**\n"
            "   • Women's legal rights under Indian Constitution\n"
            "   • Domestic violence protection (DV Act 2005)\n"
            "   • Workplace harassment (POSH Act 2013)\n"
            "   • Property rights, inheritance, divorce laws\n"
            "   • How to file complaints, legal procedures\n\n"
            
            "💼 **Career & Financial Empowerment:**\n"
            "   • Job search strategies, interview tips\n"
            "   • Skill development recommendations\n"
            "   • Entrepreneurship guidance\n"
            "   • Financial planning, investments, budgeting\n"
            "   • Work-life balance strategies\n\n"
            
            "🏥 **Health & Wellness:**\n"
            "   • Menstrual health, reproductive health\n"
            "   • Mental health support, stress management\n"
            "   • Nutrition during pregnancy, breastfeeding\n"
            "   • Self-care routines, fitness tips\n"
            "   • Healthcare access and rights\n\n"
            
            "🛡️ **Safety & Security:**\n"
            "   • Personal safety tips, self-defense\n"
            "   • Digital safety, online harassment\n"
            "   • Emergency contact information\n"
            "   • Safe travel guidelines\n\n"
            
            "👥 **Community & Relationships:**\n"
            "   • Building support networks\n"
            "   • Dealing with family pressures\n"
            "   • Communication skills\n"
            "   • Leadership development\n\n"
            
            "📚 **Education & Growth:**\n"
            "   • Educational opportunities, scholarships\n"
            "   • Skill certifications\n"
            "   • Personal development resources\n\n"
            
            "🌈 **RESPONSE STYLE:**\n"
            "• Use warm, encouraging tone with empathy\n"
            "• Include practical, actionable advice\n"
            "• Provide specific resources when possible\n"
            "• Use emojis and formatting for clarity\n"
            "• Respect cultural sensitivities\n"
            "• Maintain strict confidentiality\n"
            "• If question is outside scope, redirect supportively\n\n"
            
            "💝 **SPECIAL FEATURES:**\n"
            "• Share inspiring success stories when relevant\n"
            "• Provide emergency resources for critical situations\n"
            "• Offer step-by-step guidance for complex issues\n"
            "• Connect users with appropriate helplines/services\n\n"
            
            f"👩‍💬 **User's Question:** {user_query}\n\n"
            "🎯 **Your Response:** (Start with a warm greeting and provide comprehensive, helpful guidance)"
        )
        return prompt
    
    def generate_ai_response(user_query: str) -> str:
        try:
            # Updated model name for current Gemini API
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = build_refined_prompt(user_query)
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"I apologize, but I'm having trouble connecting right now. Please try again later. Error: {str(e)}"
    
    # Frontend Routes - Serve React App
    @app.route('/')
    def serve_react_app():
        return send_from_directory(app.static_folder, 'index.html')
    
    @app.route('/<path:path>')
    def serve_static_files(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    
    # Routes
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'version': '1.0.0'
        })
    
    @app.route('/api/chat', methods=['POST'])
    @limiter.limit("10/minute")
    def chat():
        data = request.get_json()
        user_query = data.get("query")
        
        if not user_query:
            return jsonify({"error": "No query provided"}), 400
        
        if len(user_query) > 1000:
            return jsonify({"error": "Query too long. Maximum 1000 characters allowed."}), 400
        
        response_text = generate_ai_response(user_query)
        return jsonify({"response": response_text})
    
    @app.route('/api/posts', methods=['GET'])
    def get_posts():
        try:
            page = request.args.get('page', 1, type=int)
            per_page = min(request.args.get('per_page', 20, type=int), 50)
            category = request.args.get('category')
            sort_by = request.args.get('sort_by', 'recent')
            search = request.args.get('search')
            
            query = Post.query.filter_by(is_hidden=False)
            
            if category and category != 'All':
                try:
                    category_enum = PostCategory(category)
                    query = query.filter_by(category=category_enum)
                except ValueError:
                    return jsonify({'error': 'Invalid category'}), 400
            
            if search:
                query = query.filter(
                    db.or_(
                        Post.title.ilike(f'%{search}%'),
                        Post.content.ilike(f'%{search}%')
                    )
                )
            
            if sort_by == 'popular':
                query = query.order_by(Post.likes_count.desc())
            elif sort_by == 'discussed':
                query = query.order_by(Post.comments_count.desc())
            else:  # recent
                query = query.order_by(Post.created_at.desc())
            
            posts = query.paginate(page=page, per_page=per_page, error_out=False)
            
            return jsonify({
                'posts': [post.to_dict() for post in posts.items],
                'pagination': {
                    'page': page,
                    'pages': posts.pages,
                    'per_page': per_page,
                    'total': posts.total,
                    'has_next': posts.has_next,
                    'has_prev': posts.has_prev
                }
            })
        except Exception as e:
            return jsonify({'error': 'Failed to fetch posts'}), 500
    
    @app.route('/api/posts', methods=['POST'])
    @limiter.limit("5/minute")
    def create_post():
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['title', 'content', 'category', 'user_id']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
            # Validate category
            try:
                category = PostCategory(data['category'])
            except ValueError:
                return jsonify({'error': 'Invalid category'}), 400
            
            # Create post
            post = Post(
                title=data['title'][:255],  # Limit title length
                content=data['content'],
                category=category,
                user_id=data['user_id'],
                is_anonymous=data.get('anonymous', False),
                tags=data.get('tags', [])
            )
            
            db.session.add(post)
            db.session.commit()
            
            # Log activity
            activity = UserActivity(
                user_id=data['user_id'],
                activity_type='post_created',
                activity_data={'post_id': post.id, 'category': category.value}
            )
            db.session.add(activity)
            db.session.commit()
            
            return jsonify({
                'message': 'Post created successfully',
                'post': post.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to create post'}), 500
    
    @app.route('/api/posts/<post_id>/like', methods=['POST'])
    @limiter.limit("30/minute")
    def toggle_like_post(post_id):
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            
            if not user_id:
                return jsonify({'error': 'User ID required'}), 400
            
            post = Post.query.get_or_404(post_id)
            user = User.query.get_or_404(user_id)
            
            if post in user.liked_posts:
                user.liked_posts.remove(post)
                post.likes_count = max(0, post.likes_count - 1)
                liked = False
            else:
                user.liked_posts.append(post)
                post.likes_count += 1
                liked = True
            
            db.session.commit()
            
            return jsonify({
                'liked': liked,
                'likes_count': post.likes_count
            })
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to toggle like'}), 500
    
    @app.route('/api/posts/<post_id>/comments', methods=['GET'])
    def get_comments(post_id):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = min(request.args.get('per_page', 20, type=int), 50)
            
            comments = Comment.query.filter_by(
                post_id=post_id,
                parent_id=None,  # Only top-level comments
                is_hidden=False
            ).order_by(Comment.created_at.desc()).paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            return jsonify({
                'comments': [comment.to_dict() for comment in comments.items],
                'pagination': {
                    'page': page,
                    'pages': comments.pages,
                    'per_page': per_page,
                    'total': comments.total
                }
            })
            
        except Exception as e:
            return jsonify({'error': 'Failed to fetch comments'}), 500
    
    @app.route('/api/posts/<post_id>/comments', methods=['POST'])
    @limiter.limit("10/minute")
    def create_comment(post_id):
        try:
            data = request.get_json()
            
            if not data.get('content') or not data.get('user_id'):
                return jsonify({'error': 'Content and user_id are required'}), 400
            
            # Verify post exists
            post = Post.query.get_or_404(post_id)
            
            comment = Comment(
                content=data['content'],
                post_id=post_id,
                user_id=data['user_id'],
                parent_id=data.get('parent_id')
            )
            
            db.session.add(comment)
            
            # Update post comments count
            post.comments_count += 1
            
            db.session.commit()
            
            return jsonify({
                'message': 'Comment created successfully',
                'comment': comment.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to create comment'}), 500
    
    @app.route('/api/jobs', methods=['GET'])
    def get_jobs():
        try:
            page = request.args.get('page', 1, type=int)
            per_page = min(request.args.get('per_page', 20, type=int), 50)
            location = request.args.get('location')
            job_type = request.args.get('job_type')
            search = request.args.get('search')
            
            query = JobPost.query.filter_by(is_active=True)
            
            if location:
                query = query.filter(JobPost.location.ilike(f'%{location}%'))
            
            if job_type:
                query = query.filter_by(job_type=job_type)
            
            if search:
                query = query.filter(
                    db.or_(
                        JobPost.title.ilike(f'%{search}%'),
                        JobPost.company.ilike(f'%{search}%'),
                        JobPost.description.ilike(f'%{search}%')
                    )
                )
            
            jobs = query.order_by(JobPost.created_at.desc()).paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            return jsonify({
                'jobs': [job.to_dict() for job in jobs.items],
                'pagination': {
                    'page': page,
                    'pages': jobs.pages,
                    'per_page': per_page,
                    'total': jobs.total
                }
            })
            
        except Exception as e:
            return jsonify({'error': 'Failed to fetch jobs'}), 500
    
    @app.route('/api/upload', methods=['POST'])
    @limiter.limit("5/minute")
    def upload_file():
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if file and allowed_file(file.filename):
                # Generate unique filename
                filename = f"{uuid.uuid4()}.{file.filename.rsplit('.', 1)[1].lower()}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                
                # Process image
                if file.content_type.startswith('image/'):
                    image = Image.open(file.stream)
                    # Resize if too large
                    if image.width > 1200 or image.height > 1200:
                        image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                    
                    # Convert to RGB if needed
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    
                    image.save(filepath, 'JPEG', quality=85, optimize=True)
                else:
                    file.save(filepath)
                
                return jsonify({
                    'message': 'File uploaded successfully',
                    'filename': filename,
                    'url': f'/api/uploads/{filename}'
                }), 201
            
            return jsonify({'error': 'Invalid file type'}), 400
            
        except Exception as e:
            return jsonify({'error': 'Failed to upload file'}), 500
    
    @app.route('/api/uploads/<filename>')
    def uploaded_file(filename):
        try:
            return send_file(
                os.path.join(app.config['UPLOAD_FOLDER'], filename),
                as_attachment=False
            )
        except Exception as e:
            return jsonify({'error': 'File not found'}), 404
    
    @app.route('/api/stats', methods=['GET'])
    def get_platform_stats():
        try:
            stats = {
                'total_users': User.query.count(),
                'total_posts': Post.query.filter_by(is_hidden=False).count(),
                'total_comments': Comment.query.filter_by(is_hidden=False).count(),
                'total_jobs': JobPost.query.filter_by(is_active=True).count(),
                'categories': {}
            }
            
            # Get posts by category
            for category in PostCategory:
                count = Post.query.filter_by(category=category, is_hidden=False).count()
                stats['categories'][category.value] = count
            
            return jsonify(stats)
            
        except Exception as e:
            return jsonify({'error': 'Failed to fetch stats'}), 500
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429
    
    return app

if __name__ == "__main__":
    app = create_app()
    
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
