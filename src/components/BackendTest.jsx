import React, { useState, useEffect } from 'react';
import { Activity, MessageCircle, Users, Briefcase, CheckCircle, XCircle, Loader } from 'lucide-react';
import apiService from '../services/api';

const BackendTest = () => {
  const [healthStatus, setHealthStatus] = useState('checking');
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Check backend health on component mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setHealthStatus('checking');
      const response = await apiService.healthCheck();
      if (response.status === 'healthy') {
        setHealthStatus('healthy');
      } else {
        setHealthStatus('unhealthy');
      }
    } catch (error) {
      setHealthStatus('error');
      console.error('Health check failed:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    
    setChatLoading(true);
    try {
      const response = await apiService.sendChatMessage(chatMessage);
      setChatResponse(response.response);
    } catch (error) {
      setChatResponse('Error: ' + error.message);
    }
    setChatLoading(false);
  };

  const loadPosts = async () => {
    setPostsLoading(true);
    try {
      const response = await apiService.getPosts({ per_page: 5 });
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
    setPostsLoading(false);
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const createTestPost = async () => {
    try {
      const testPost = {
        title: 'Test Post from Frontend',
        content: 'This is a test post created to verify the backend connection.',
        category: 'Career',
        user_id: 'test-user-123',
        anonymous: false,
        tags: ['test', 'backend', 'frontend']
      };
      
      const response = await apiService.createPost(testPost);
      alert('Post created successfully!');
      loadPosts(); // Reload posts
    } catch (error) {
      alert('Failed to create post: ' + error.message);
    }
  };

  const getStatusIcon = () => {
    switch (healthStatus) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unhealthy':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Loader className="w-5 h-5 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (healthStatus) {
      case 'healthy':
        return 'Backend is running!';
      case 'unhealthy':
        return 'Backend is unhealthy';
      case 'error':
        return 'Cannot connect to backend';
      default:
        return 'Checking backend...';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🧪 Backend Testing Dashboard</h1>
        <p className="text-gray-600">Test the connection and functionality of your Astitva backend</p>
      </div>

      {/* Health Check */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Backend Health Check
          </h2>
          <button 
            onClick={checkHealth}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <span className="text-lg">{getStatusText()}</span>
        </div>
        {healthStatus === 'healthy' && (
          <p className="text-sm text-green-600 mt-2">✅ Backend server is responding at http://localhost:5000</p>
        )}
      </div>

      {/* AI Chat Test */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          AI Chat Test
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ask Sakhi AI something:</label>
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="e.g., What are women's rights in India?"
              className="w-full p-3 border rounded-lg"
              rows="3"
            />
          </div>
          <button
            onClick={sendChatMessage}
            disabled={chatLoading || !chatMessage.trim()}
            className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            {chatLoading ? 'Asking...' : 'Send Message'}
          </button>
          {chatResponse && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Response:</h4>
              <p className="whitespace-pre-wrap">{chatResponse}</p>
            </div>
          )}
        </div>
      </div>

      {/* Posts API Test */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Community Posts API
        </h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={loadPosts}
            disabled={postsLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {postsLoading ? 'Loading...' : 'Load Posts'}
          </button>
          <button
            onClick={createTestPost}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create Test Post
          </button>
        </div>
        {posts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Recent Posts:</h4>
            {posts.map((post, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                <h5 className="font-medium">{post.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{post.content?.substring(0, 100)}...</p>
                <p className="text-xs text-gray-500 mt-2">Category: {post.category} | Likes: {post.likes_count || 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Test */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Platform Statistics
        </h2>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors mb-4"
        >
          Load Stats
        </button>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{stats.total_users || 0}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-green-600">{stats.total_posts || 0}</div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-purple-600">{stats.total_jobs || 0}</div>
              <div className="text-sm text-gray-600">Job Listings</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-orange-600">{stats.active_users || 0}</div>
              <div className="text-sm text-gray-600">Active Today</div>
            </div>
          </div>
        )}
      </div>

      {/* API Endpoints Info */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-semibold mb-4">Available API Endpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-green-600">GET Endpoints:</h4>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• /api/health - Health check</li>
              <li>• /api/posts - Get community posts</li>
              <li>• /api/jobs - Get job listings</li>
              <li>• /api/stats - Platform statistics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-600">POST Endpoints:</h4>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• /api/chat - AI chat messages</li>
              <li>• /api/posts - Create new posts</li>
              <li>• /api/posts/:id/like - Like posts</li>
              <li>• /api/upload - File uploads</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendTest; 