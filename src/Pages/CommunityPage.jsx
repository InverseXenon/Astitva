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
  Filter,
  Heart,
  Repeat2,
  ImagePlus,
  Link2,
  Smile,
  Send,
  UserPlus,
  UserCheck,
  Star,
  Medal,
  Zap,
  ThumbsUp,
  Coffee,
  Sparkles,
  Trophy,
  Settings,
  Bell,
  Hash,
  Shield
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
    link: '',
    type: 'text'
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // home, following, trending
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [userStats, setUserStats] = useState({});
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const categories = [
    'all', 'Career', 'Health', 'Safety', 'Legal', 'Finance', 
    'Mental Health', 'Education', 'General'
  ];

  const awardTypes = [
    { type: 'helpful', icon: ThumbsUp, label: 'Helpful', color: 'text-blue-500' },
    { type: 'inspiring', icon: Sparkles, label: 'Inspiring', color: 'text-purple-500' },
    { type: 'supportive', icon: Heart, label: 'Supportive', color: 'text-pink-500' },
    { type: 'informative', icon: Zap, label: 'Informative', color: 'text-yellow-500' },
    { type: 'funny', icon: Smile, label: 'Funny', color: 'text-green-500' },
    { type: 'gold', icon: Trophy, label: 'Gold', color: 'text-yellow-600' }
  ];

  const postTypes = [
    { type: 'text', icon: MessageSquare, label: 'Text Post' },
    { type: 'link', icon: Link2, label: 'Link Post' },
    { type: 'image', icon: ImagePlus, label: 'Image Post' }
  ];

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchUserStats();
    }
  }, [sortBy, selectedCategory, activeTab, user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        sort: sortBy,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        user_id: user?.id
      };

      let endpoint = '/api/posts';
      if (activeTab === 'following') {
        endpoint = `/api/users/${user?.id}/feed`;
      }

      const response = await apiService.get(endpoint, { params });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await apiService.get(`/api/users/${user.id}`);
      setUserStats(response.data.user);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleVote = async (postId, voteType) => {
    if (!user) return;
    
    try {
      const response = await apiService.post(`/api/posts/${postId}/vote`, {
        user_id: user.id,
        vote_type: voteType
      });

      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              upvotes: response.data.upvotes,
              downvotes: response.data.downvotes,
              score: response.data.score,
              user_vote: response.data.user_vote
            }
          : post
      ));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleCommentVote = async (commentId, voteType) => {
    if (!user) return;
    
    try {
      const response = await apiService.post(`/api/comments/${commentId}/vote`, {
        user_id: user.id,
        vote_type: voteType
      });

      // Update comment in the posts state
      setPosts(posts.map(post => ({
        ...post,
        comments: post.comments?.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
                score: response.data.score,
                user_vote: response.data.user_vote
              }
            : comment
        )
      })));
    } catch (error) {
      console.error('Error voting on comment:', error);
    }
  };

  const handleAward = async (postId, awardType) => {
    if (!user) return;
    
    try {
      await apiService.post(`/api/posts/${postId}/award`, {
        user_id: user.id,
        award_type: awardType,
        message: `Awarded ${awardType} by ${user.username}`
      });

      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              awards_count: post.awards_count + 1,
              awards: {
                ...post.awards,
                [awardType]: (post.awards?.[awardType] || 0) + 1
              }
            }
          : post
      ));
    } catch (error) {
      console.error('Error giving award:', error);
    }
  };

  const handleFollow = async (userId) => {
    if (!user) return;
    
    try {
      const response = await apiService.post(`/api/users/${userId}/follow`, {
        user_id: user.id
      });

      if (response.data.following) {
        setFollowingUsers(prev => new Set([...prev, userId]));
      } else {
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const response = await apiService.post('/api/posts', {
        ...newPost,
        user_id: user.id
      });

      setPosts([response.data.post, ...posts]);
      setNewPost({ title: '', content: '', category: 'Career', anonymous: false, link: '', type: 'text' });
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleCreateComment = async (postId) => {
    if (!user || !newComment[postId]?.trim()) return;

    try {
      const response = await apiService.post(`/api/posts/${postId}/comments`, {
        content: newComment[postId],
        user_id: user.id
      });

      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments_count: post.comments_count + 1,
              comments: [...(post.comments || []), response.data.comment]
            }
          : post
      ));

      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const loadComments = async (postId) => {
    try {
      const response = await apiService.get(`/api/posts/${postId}/comments`, {
        params: { user_id: user?.id }
      });
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: response.data.comments }
          : post
      ));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const toggleComments = (postId) => {
    const isShowing = showComments[postId];
    setShowComments({ ...showComments, [postId]: !isShowing });
    
    if (!isShowing) {
      loadComments(postId);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const renderPost = (post) => (
    <div key={post.id} className="bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-xl p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={post.author.avatar_url || `https://ui-avatars.com/api/?name=${post.author.username}&background=random`}
            alt={post.author.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 hover:text-purple-600 cursor-pointer">
                {post.author.display_name || post.author.username}
              </span>
              {post.author.is_verified && (
                <Crown className="w-4 h-4 text-yellow-500" />
              )}
              {post.author.is_moderator && (
                <Shield className="w-4 h-4 text-green-500" />
              )}
              <span className="text-gray-500 text-sm">@{post.author.username}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 text-sm">{post.time_ago}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {post.category}
              </span>
              {post.author.karma_score && (
                <span className="text-xs text-gray-500">
                  {formatNumber(post.author.karma_score)} karma
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!followingUsers.has(post.author.id) && post.author.id !== user?.id && (
            <Button
              onClick={() => handleFollow(post.author.id)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Follow
            </Button>
          )}
          <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
          {post.title}
        </h3>
        
        <div className={`text-gray-700 leading-relaxed ${
          expandedPosts.has(post.id) ? '' : 'overflow-hidden'
        }`} style={!expandedPosts.has(post.id) ? {
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        } : {}}>
          {post.content}
        </div>
        
        {post.content.length > 300 && (
          <button
            onClick={() => {
              const newExpanded = new Set(expandedPosts);
              if (expandedPosts.has(post.id)) {
                newExpanded.delete(post.id);
              } else {
                newExpanded.add(post.id);
              }
              setExpandedPosts(newExpanded);
            }}
            className="text-purple-600 hover:text-purple-700 text-sm mt-2 font-medium"
          >
            {expandedPosts.has(post.id) ? 'Show less' : 'Show more'}
          </button>
        )}

        {post.link_url && (
          <a 
            href={post.link_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
          >
            <div className="flex items-center space-x-2 text-purple-600">
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium">View Link</span>
            </div>
          </a>
        )}

        {post.image_url && (
          <img 
            src={post.image_url} 
            alt="Post attachment"
            className="mt-3 rounded-lg max-w-full h-auto border border-gray-200"
          />
        )}
      </div>

      {/* Awards Display */}
      {post.awards_count > 0 && (
        <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-100">
          {awardTypes.map(award => {
            const count = post.awards?.[award.type] || 0;
            if (count === 0) return null;
            
            const IconComponent = award.icon;
            return (
              <div key={award.type} className="flex items-center space-x-1">
                <IconComponent className={`w-4 h-4 ${award.color}`} />
                <span className="text-xs text-gray-600">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Voting and Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          {/* Voting */}
          <div className="flex items-center bg-gray-50 rounded-full p-1">
            <button
              onClick={() => handleVote(post.id, post.user_vote === 'upvote' ? 'remove' : 'upvote')}
              className={`p-2 rounded-full transition-colors ${
                post.user_vote === 'upvote' 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <span className={`px-2 font-medium text-sm ${
              post.score > 0 ? 'text-orange-600' : 
              post.score < 0 ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {formatNumber(post.score)}
            </span>
            <button
              onClick={() => handleVote(post.id, post.user_vote === 'downvote' ? 'remove' : 'downvote')}
              className={`p-2 rounded-full transition-colors ${
                post.user_vote === 'downvote' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Comments */}
          <button
            onClick={() => toggleComments(post.id)}
            className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">{formatNumber(post.comments_count)}</span>
          </button>

          {/* Share */}
          <button className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Awards Dropdown */}
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <Gift className="w-4 h-4" />
            </button>
            <div className="absolute right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
              <div className="grid grid-cols-2 gap-1 w-48">
                {awardTypes.map(award => {
                  const IconComponent = award.icon;
                  return (
                    <button
                      key={award.type}
                      onClick={() => handleAward(post.id, award.type)}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <IconComponent className={`w-4 h-4 ${award.color}`} />
                      <span className="text-xs">{award.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bookmark */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments[post.id] && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Comment Input */}
          <div className="flex space-x-3 mb-4">
            <img 
              src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newComment[post.id] || ''}
                onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <Button
                  onClick={() => handleCreateComment(post.id)}
                  disabled={!newComment[post.id]?.trim()}
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments?.map(comment => (
              <div key={comment.id} className="flex space-x-3">
                <img 
                  src={comment.author.avatar_url || `https://ui-avatars.com/api/?name=${comment.author.username}&background=random`}
                  alt={comment.author.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {comment.author.display_name || comment.author.username}
                      </span>
                      {comment.author.is_verified && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                      <span className="text-xs text-gray-500">{comment.time_ago}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleCommentVote(comment.id, comment.user_vote === 'upvote' ? 'remove' : 'upvote')}
                        className={`p-1 rounded transition-colors ${
                          comment.user_vote === 'upvote' 
                            ? 'text-orange-600' 
                            : 'text-gray-500 hover:text-orange-600'
                        }`}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium text-gray-600">
                        {comment.score}
                      </span>
                      <button
                        onClick={() => handleCommentVote(comment.id, comment.user_vote === 'downvote' ? 'remove' : 'downvote')}
                        className={`p-1 rounded transition-colors ${
                          comment.user_vote === 'downvote' 
                            ? 'text-blue-600' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    <button className="text-xs text-gray-500 hover:text-gray-700">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-gray-900">Community</h1>
              
              {/* Navigation Tabs */}
              <div className="flex space-x-1">
                {[
                  { id: 'home', label: 'Home', icon: Home },
                  { id: 'following', label: 'Following', icon: Users },
                  { id: 'trending', label: 'Trending', icon: TrendingUp }
                ].map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search and Create */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search community..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>
              
              <Button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span className="text-sm capitalize">{category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* User Stats */}
            {user && userStats.karma_score && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Karma</span>
                    <span className="font-semibold text-purple-600">
                      {formatNumber(userStats.karma_score)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Posts</span>
                    <span className="font-semibold">{userStats.posts_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Comments</span>
                    <span className="font-semibold">{userStats.comments_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Awards</span>
                    <span className="font-semibold text-yellow-600">
                      {userStats.awards_received}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1">
                {[
                  { id: 'recent', label: 'Recent', icon: Clock },
                  { id: 'hot', label: 'Hot', icon: Flame },
                  { id: 'top', label: 'Top', icon: TrendingUp }
                ].map(sort => {
                  const IconComponent = sort.icon;
                  return (
                    <button
                      key={sort.id}
                      onClick={() => setSortBy(sort.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        sortBy === sort.id 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{sort.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Posts Feed */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(renderPost)}
                {posts.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to share something with the community!</p>
                    <Button onClick={() => setShowCreatePost(true)}>
                      Create Your First Post
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Community Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold">1.</span>
                  <span>Be respectful and supportive</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold">2.</span>
                  <span>Share authentic experiences</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span>Keep content relevant</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold">4.</span>
                  <span>No spam or self-promotion</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Award Types</h3>
              <div className="grid grid-cols-2 gap-2">
                {awardTypes.map(award => {
                  const IconComponent = award.icon;
                  return (
                    <div key={award.type} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                      <IconComponent className={`w-4 h-4 ${award.color}`} />
                      <span className="text-xs font-medium">{award.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Post Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Type
                </label>
                <div className="flex space-x-2">
                  {postTypes.map(type => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.type}
                        onClick={() => setNewPost({ ...newPost, type: type.type })}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                          newPost.type === type.type
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="What's your post about?"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share your thoughts, experiences, or questions..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="6"
                />
              </div>

              {/* Link (if link post) */}
              {newPost.type === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL
                  </label>
                  <input
                    type="url"
                    value={newPost.link}
                    onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {/* Options */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newPost.anonymous}
                    onChange={(e) => setNewPost({ ...newPost, anonymous: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Post anonymously</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowCreatePost(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                >
                  Create Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;