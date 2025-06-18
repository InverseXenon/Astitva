# Astitva - Women's Empowerment Platform

A comprehensive platform designed to empower women through AI-powered assistance, community support, job opportunities, health tracking, and resource finding.

## ✨ Features

- **🤖 AI Chat Assistant (Sakhi)** - Powered by Google Gemini AI for women-specific guidance
- **👥 Community Platform** - Share experiences, ask questions, and connect with other women
- **💼 Job Board** - Find and apply for job opportunities
- **🏥 Health & Wellness Tracking** - Monitor your physical and mental well-being
- **📚 Educational Resources** - Access courses, workshops, and learning materials
- **🗺️ Resource Finder** - Locate nearby healthcare, legal aid, and support services
- **📊 Personal Dashboard** - Track your progress and activities

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Your own Google Gemini AI API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Astitva
   ```

2. **Get your Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key for the next step

3. **Create environment file**
   Create a `.env` file in the `backend` directory:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   FLASK_ENV=development
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:///astitva.db
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Build and setup the application**
   ```bash
   python build.py
   ```

5. **Start the application**
   ```bash
   cd backend
   python app.py
   ```

6. **Access the application**
   Open your browser and go to: `http://localhost:5000`

## 🛠️ Development Setup

If you want to run frontend and backend separately for development:

### Frontend Development
```bash
npm install
npm run dev
```
This will start the frontend at `http://localhost:5173`

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python app.py
```
This will start the backend at `http://localhost:5000`

## 📁 Project Structure

```
Astitva/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── Pages/             # Main application pages
│   └── services/          # API service layer
├── backend/               # Flask backend application
│   ├── app.py            # Main application file
│   ├── models.py         # Database models
│   ├── config.py         # Configuration settings
│   └── requirements.txt  # Python dependencies
├── public/               # Static assets
├── build.py             # Build script
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini AI API key |
| `SECRET_KEY` | Yes | Flask secret key for sessions |
| `DATABASE_URL` | No | Database connection string (defaults to SQLite) |
| `FLASK_ENV` | No | Environment mode (development/production) |
| `CORS_ORIGINS` | No | Allowed origins for CORS |

### Database

The application uses SQLite by default for development. For production, you can use PostgreSQL by setting the `DATABASE_URL` environment variable:

```env
DATABASE_URL=postgresql://username:password@localhost/astitva
```

## 🎯 Key Features Explained

### AI Chat Assistant (Sakhi)
- Powered by Google Gemini AI
- Specialized for women's empowerment topics
- Covers judiciary rights, health, safety, career guidance, and more
- Maintains conversation context

### Community Platform
- Create and share posts anonymously or with your identity
- Categorized discussions (Career, Health, Safety, Legal, Finance, Mental Health)
- Like, comment, and save posts
- Real-time interaction with other community members

### Job Board
- Browse job opportunities
- Filter by location, job type, and keywords
- Save jobs for later application
- Direct application links

### Health & Wellness
- Track menstrual cycles and symptoms
- Monitor mental health indicators
- Set medication reminders
- Health analytics and insights

## 🔐 Security & Privacy

- User authentication via Clerk
- Anonymous posting options
- Secure API endpoints with rate limiting
- Data encryption in transit
- Privacy-focused design

## 🚀 Deployment

### Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   FLASK_ENV=production
   SECRET_KEY=your-secure-production-secret
   GEMINI_API_KEY=your-gemini-api-key
   DATABASE_URL=your-production-database-url
   ```

3. **Deploy to your preferred platform**
   - The application serves both frontend and backend from the same Flask server
   - Ensure your deployment platform supports Python and serves static files

### Recommended Platforms
- **Heroku** - Easy deployment with Heroku CLI
- **Railway** - Simple Git-based deployment
- **DigitalOcean App Platform** - Scalable and reliable
- **AWS/GCP/Azure** - For enterprise deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 API Documentation

### Main Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - AI chat interaction
- `GET /api/posts` - Get community posts
- `POST /api/posts` - Create a new post
- `POST /api/posts/:id/like` - Like a post
- `GET /api/jobs` - Get job listings
- `POST /api/upload` - Upload files
- `GET /api/stats` - Platform statistics

## 🆘 Support

If you encounter any issues:

1. Check that your Gemini API key is correctly set
2. Ensure all dependencies are installed
3. Check the browser console for frontend errors
4. Check the backend logs for API errors

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for women's empowerment**
