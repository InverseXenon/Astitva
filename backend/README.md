# Astitva Backend API

A comprehensive Flask-based backend for the Astitva women empowerment platform providing community features, job listings, AI chat assistance, and more.

## Features

- **Community System**: Posts, comments, likes, follows, and user interactions
- **AI Chat Assistant**: Powered by Google Gemini AI for women-specific guidance
- **Job Board**: Job posting and searching functionality
- **User Management**: Profile management integrated with Clerk authentication
- **File Upload**: Image upload with processing and optimization
- **Rate Limiting**: Protection against abuse and spam
- **Real-time Stats**: Platform analytics and metrics

## Tech Stack

- **Flask**: Web framework
- **SQLAlchemy**: Database ORM
- **PostgreSQL/SQLite**: Database (configurable)
- **Google Gemini AI**: AI-powered chat assistant
- **Redis**: Rate limiting and caching
- **PIL**: Image processing
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-Limiter**: Rate limiting

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Flask Configuration
   FLASK_ENV=development
   FLASK_DEBUG=True
   SECRET_KEY=your-secret-key-here-generate-a-random-string
   
   # Database Configuration
   DATABASE_URL=sqlite:///astitva.db
   
   # Google Gemini AI Configuration (Required)
   GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
   
   # CORS Configuration (for development)
   FRONTEND_URL=http://localhost:5173
   
   # Rate Limiting
   RATELIMIT_STORAGE_URL=memory://
   
   # Security
   SESSION_COOKIE_SECURE=False
   SESSION_COOKIE_HTTPONLY=True
   ```
   
   **Getting your Gemini API Key:**
   1. Go to [Google AI Studio](https://aistudio.google.com/)
   2. Sign in with your Google account
   3. Click "Get API Key" → "Create API Key"
   4. Copy the key and paste it in your `.env` file

5. **Database Setup**
   ```bash
   python app.py  # This will create the database tables
   ```

6. **Seed Database (Optional)**
   ```bash
   python seed_data.py
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Health check endpoint

### Authentication & Users
- User management is handled through Clerk on the frontend
- Backend stores user profiles and relationships

### Community Features
- `GET /api/posts` - Get posts with filtering and pagination
- `POST /api/posts` - Create a new post
- `POST /api/posts/{id}/like` - Toggle like on a post
- `GET /api/posts/{id}/comments` - Get comments for a post
- `POST /api/posts/{id}/comments` - Add comment to a post

### Job Board
- `GET /api/jobs` - Get job listings with filtering
- Job posting is handled through admin interface

### AI Chat
- `POST /api/chat` - Chat with AI assistant (rate limited)

### File Upload
- `POST /api/upload` - Upload images and files
- `GET /api/uploads/{filename}` - Serve uploaded files

### Analytics
- `GET /api/stats` - Get platform statistics

## Query Parameters

### Posts (`/api/posts`)
- `page` (int): Page number (default: 1)
- `per_page` (int): Items per page (max: 50, default: 20)
- `category` (string): Filter by category (Career, Health, Safety, Legal, Finance, Mental Health)
- `sort_by` (string): Sort by 'recent', 'popular', or 'discussed'
- `search` (string): Search in title and content

### Jobs (`/api/jobs`)
- `page` (int): Page number
- `per_page` (int): Items per page
- `location` (string): Filter by location
- `job_type` (string): Filter by job type
- `search` (string): Search in title, company, description

## Rate Limits

- Chat endpoint: 10 requests per minute
- Post creation: 5 requests per minute
- File upload: 5 requests per minute
- Like actions: 30 requests per minute
- Comment creation: 10 requests per minute
- Default: 100 requests per hour

## Database Models

### User
- Profile information and settings
- Following/followers relationships
- Liked and saved posts

### Post
- Community posts with categories
- Engagement metrics (views, likes, comments)
- Tag system and anonymous posting

### Comment
- Nested comments support
- Engagement tracking

### JobPost
- Job listings with detailed information
- Expiration dates and status

## File Upload

- Supports: PNG, JPG, JPEG, GIF, WebP
- Max size: 16MB
- Automatic image optimization and resizing
- Unique filename generation

## Development

1. **Run the development server**
   ```bash
   python app.py
   ```

2. **Run with debug mode**
   ```bash
   FLASK_ENV=development python app.py
   ```

3. **Database migrations**
   ```bash
   # Reset database
   python seed_data.py
   ```

## Production Deployment

1. **Set environment variables**
   ```env
   FLASK_ENV=production
   SECRET_KEY=strong-production-secret
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   REDIS_URL=redis://production-redis-host:6379/0
   ```

2. **Use a production WSGI server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Set up reverse proxy** (nginx recommended)

4. **Enable SSL/TLS** for production

## Security Features

- Rate limiting on all endpoints
- Input validation and sanitization
- CORS protection
- File type validation
- SQL injection protection via ORM
- Error handling without data exposure

## AI Assistant

The Sakhi AI assistant is configured to help with:
- Judiciary rights and legal advice
- Career guidance and success stories
- Mental, physical, and menstrual health
- Safety and overall empowerment
- Cultural sensitivity for Indian women

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## API Response Format

All API responses follow this format:
```json
{
  "data": {...},
  "message": "Success message",
  "error": "Error message (if any)",
  "pagination": {...} // For paginated endpoints
}
```

## Error Codes

- `400`: Bad Request - Invalid input
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error 