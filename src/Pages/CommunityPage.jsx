import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '../components/Button';
import { 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  MessageSquare, 
  Share2,
  Bookmark, 
  MoreVertical,
  TrendingUp,
  Clock,
  Flame,
  Search,
  Home,
  Users,
  Crown,
  Award,
  User,
  Calendar,
  Eye,
  ExternalLink,
  Gift,
  Filter
} from 'lucide-react';
import apiService from '../services/api';

const CommunityPage = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    category: 'Career', 
    anonymous: false,
    link: ''
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('hot');
  const [postType, setPostType] = useState('text'); // text, link, image
  const [votedPosts, setVotedPosts] = useState(new Map()); // postId -> 'up'/'down'/null

  // Reddit-style communities (subreddits)
  const communities = [
    { name: 'r/WomenInTech', members: '2.4k', icon: '💻', color: 'text-blue-600' },
    { name: 'r/HealthyLiving', members: '1.8k', icon: '🌱', color: 'text-green-600' },
    { name: 'r/CareerAdvice', members: '3.1k', icon: '📈', color: 'text-purple-600' },
    { name: 'r/LegalHelp', members: '890', icon: '⚖️', color: 'text-indigo-600' },
    { name: 'r/SafeSpace', members: '1.2k', icon: '🛡️', color: 'text-red-600' },
    { name: 'r/FinancialFreedom', members: '2.7k', icon: '💰', color: 'text-yellow-600' }
  ];

  const sortOptions = [
    { value: 'hot', label: 'Hot', icon: Flame },
    { value: 'recent', label: 'New', icon: Clock },
    { value: 'popular', label: 'Top', icon: TrendingUp }
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, sortBy]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        sort_by: sortBy === 'hot' ? 'popular' : sortBy,
        search: searchTerm || undefined,
        per_page: 20
      };
      
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      const response = await apiService.getPosts(params);
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    }
    setLoading(false);
  };

  const handleVote = async (postId, voteType) => {
    const currentVote = votedPosts.get(postId);
    let newVote = null;
    
    if (currentVote === voteType) {
      newVote = null; // Remove vote
    } else {
      newVote = voteType; // Set new vote
    }
    
    try {
      if (voteType === 'up') {
        await apiService.likePost(postId, user?.id || 'anonymous-user');
      }
      
      // Update local vote state
      setVotedPosts(prev => {
        const newMap = new Map(prev);
        if (newVote === null) {
          newMap.delete(postId);
        } else {
          newMap.set(postId, newVote);
        }
        return newMap;
      });
      
      // Update post score optimistically
      setPosts(posts.map(post => {
        if (post.id === postId) {
          let scoreChange = 0;
          if (currentVote === 'up' && newVote !== 'up') scoreChange -= 1;
          if (currentVote === 'down' && newVote !== 'down') scoreChange += 1;
          if (newVote === 'up' && currentVote !== 'up') scoreChange += 1;
          if (newVote === 'down' && currentVote !== 'down') scoreChange -= 1;
          
          return {
            ...post,
            likes_count: Math.max(0, (post.likes_count || 0) + scoreChange)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleSubmitPost = async () => {
    if (newPost.title && (newPost.content || newPost.link)) {
      try {
        const postData = {
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          user_id: user?.id || 'anonymous-user',
          anonymous: newPost.anonymous
        };
        
        await apiService.createPost(postData);
        setNewPost({ title: '', content: '', category: 'Career', anonymous: false, link: '' });
        setShowCreatePost(false);
        loadPosts();
      } catch (error) {
        console.error('Failed to create post:', error);
        alert('Failed to create post. Please try again.');
      }
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reddit-style Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-xl">r/AstitvaWomen</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{posts.length * 23} members</span>
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search r/AstitvaWomen"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Post
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg border border-gray-200 mb-4 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        sortBy === option.value
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
                <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-2">
              {loading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No posts yet. Be the first to share!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex">
                      {/* Vote Column */}
                      <div className="flex flex-col items-center p-2 bg-gray-50 w-10">
                        <button
                          onClick={() => handleVote(post.id, 'up')}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                            votedPosts.get(post.id) === 'up' 
                              ? 'text-orange-500' 
                              : 'text-gray-400 hover:text-orange-500'
                          }`}
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>
                        <span className={`text-xs font-bold py-1 ${
                          votedPosts.get(post.id) === 'up' ? 'text-orange-500' :
                          votedPosts.get(post.id) === 'down' ? 'text-blue-500' : 
                          'text-gray-600'
                        }`}>
                          {post.likes_count || 0}
                        </span>
                        <button
                          onClick={() => handleVote(post.id, 'down')}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                            votedPosts.get(post.id) === 'down' 
                              ? 'text-blue-500' 
                              : 'text-gray-400 hover:text-blue-500'
                          }`}
                        >
                          <ArrowDown className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-3">
                        {/* Post Header */}
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <span className="font-medium text-gray-900">r/{post.category}</span>
                          <span className="mx-1">•</span>
                          <span>Posted by u/{post.username || 'anonymous'}</span>
                          <span className="mx-1">•</span>
                          <span>{getTimeAgo(post.created_at || new Date())}</span>
                          {post.anonymous && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-orange-500">🔒 Anonymous</span>
                            </>
                          )}
                        </div>

                        {/* Post Title */}
                        <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                          {post.title}
                        </h3>

                        {/* Post Content */}
                        {post.content && (
                          <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">
                            {post.content}
                          </p>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <button className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments_count || 0} Comments</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded">
                            <Bookmark className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-4">
            {/* Community Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">r/AstitvaWomen</h3>
                  <p className="text-xs text-gray-500">Women Empowerment Hub</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                A supportive community for women's empowerment, career growth, health, and safety discussions.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Members</span>
                  <span className="font-medium">{posts.length * 23}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Online</span>
                  <span className="font-medium text-green-600">{Math.floor(posts.length * 2.3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">Jan 1, 2024</span>
                </div>
              </div>
              <Button
                onClick={() => setShowCreatePost(true)}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-medium"
              >
                Create Post
              </Button>
            </div>

            {/* Related Communities */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-sm mb-3">Related Communities</h3>
              <div className="space-y-2">
                {communities.slice(0, 4).map((community) => (
                  <div key={community.name} className="flex items-center justify-between py-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{community.icon}</span>
                      <div>
                        <p className={`text-sm font-medium ${community.color}`}>{community.name}</p>
                        <p className="text-xs text-gray-500">{community.members} members</p>
                      </div>
                    </div>
                    <button className="text-blue-500 text-xs font-medium hover:underline">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Rules */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-sm mb-3">Community Guidelines</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">1.</span>
                  <span>Be respectful and supportive</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">2.</span>
                  <span>No harassment or discrimination</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">3.</span>
                  <span>Keep discussions relevant</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">4.</span>
                  <span>Protect privacy and confidentiality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Create a post</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">u/{user?.firstName || 'anonymous'}</span>
              </div>
              
              <input
                type="text"
                placeholder="Title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
              
              <textarea
                placeholder="Text (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
              
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              >
                <option value="Career">Career</option>
                <option value="Health">Health</option>
                <option value="Safety">Safety</option>
                <option value="Legal">Legal</option>
                <option value="Finance">Finance</option>
                <option value="Mental Health">Mental Health</option>
              </select>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newPost.anonymous}
                  onChange={(e) => setNewPost({...newPost, anonymous: e.target.checked})}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-600">Post anonymously</span>
              </label>
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <Button
                onClick={handleSubmitPost}
                disabled={!newPost.title}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;