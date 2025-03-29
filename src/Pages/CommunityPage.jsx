import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { FiArrowUp, FiArrowDown, FiPlus, FiLock, FiMapPin, FiMessageSquare, FiSave, FiShare2 } from 'react-icons/fi';
import { FaRegComments, FaFirstAid, FaBalanceScale } from 'react-icons/fa';
import { mockPosts } from '../mockData';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Career', anonymous: false });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  // Core Categories from POC
  const categories = [
    { name: 'Career', icon: <FaRegComments className="w-6 h-6" />, color: 'bg-purple-100' },
    { name: 'Health', icon: <FaFirstAid className="w-6 h-6" />, color: 'bg-green-100' },
    { name: 'Safety', icon: <FiLock className="w-6 h-6" />, color: 'bg-red-100' },
    { name: 'Legal', icon: <FaBalanceScale className="w-6 h-6" />, color: 'bg-blue-100' },
  ];

  // Load posts with random usernames on mount
  useEffect(() => {
    setPosts(
      mockPosts.map((post) => ({
        ...post,
        username: post.anonymous ? `AnonymousUser${Math.floor(Math.random() * 1000)}` : 'DefaultUser',
        upvotes: post.upvotes || 0,
        downvotes: post.downvotes || 0,
      }))
    );
  }, []);

  // Handle submitting a new post
  const handleSubmitPost = () => {
    if (newPost.title && newPost.content) {
      const username = newPost.anonymous
        ? `AnonymousUser${Math.floor(Math.random() * 1000)}`
        : 'DefaultUser';
      setPosts([
        {
          id: posts.length + 1,
          ...newPost,
          username,
          upvotes: 0,
          downvotes: 0,
          comments: [],
          date: new Date().toISOString(),
          resources: null,
          media: null,
        },
        ...posts,
      ]);
      setNewPost({ title: '', content: '', category: 'Career', anonymous: false });
      setShowModal(false);
    }
  };

  // Handle upvoting a post
  const handleUpvote = (postId) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post)));
  };

  // Handle downvoting a post
  const handleDownvote = (postId) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, downvotes: post.downvotes + 1 } : post)));
  };

  // Filter posts based on search term and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="mt-19 bg-gradient-to-r from-purple-700 to-indigo-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Empower Through Shared Experiences
            </h1>
            <p className="text-xl text-white/90">
              Connect, share, and grow with a supportive network of women
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search discussions..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {categories.map((cat) => (
              <Card
                key={cat.name}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className={`p-6 rounded-lg ${cat.color} flex flex-col items-center`}>
                  <div className="mb-4 text-purple-600">{cat.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                </div>
              </Card>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Voting */}
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" size="sm" onClick={() => handleUpvote(post.id)}>
                        <FiArrowUp className="w-5 h-5 text-gray-600" />
                      </Button>
                      <span className="my-1 font-medium text-gray-700">
                        {post.upvotes - post.downvotes}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => handleDownvote(post.id)}>
                        <FiArrowDown className="w-5 h-5 text-gray-600" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1">
                      {/* Post Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={categories.find((c) => c.name === post.category)?.color}>
                          {post.category}
                        </Badge>
                        {post.anonymous && (
                          <Badge variant="outline" className="border-gray-300">
                            <FiLock className="mr-2 w-4 h-4" />
                            Anonymous
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">Posted by {post.username}</span>
                      </div>

                      {/* Post Body */}
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.content}</p>

                      {/* Media */}
                      {post.media && (
                        <div className="mb-4 rounded-lg overflow-hidden border">
                          <img
                            src={post.media.image}
                            alt={post.media.caption}
                            className="w-full h-48 object-cover"
                          />
                          <p className="p-3 text-sm bg-gray-50">{post.media.caption}</p>
                        </div>
                      )}

                      {/* Post Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            className="text-gray-600"
                            onClick={() => navigate(`/post/${post.id}`)}
                          >
                            <FiMessageSquare className="mr-2 w-5 h-5" />
                            {post.comments.length} Responses
                          </Button>
                          {post.resources?.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <FiMapPin className="mr-2 w-4 h-4" />
                              Verified Resource
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <FiSave className="w-5 h-5 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FiShare2 className="w-5 h-5 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Create Post Button */}
          <div className="fixed bottom-25 right-8">
            <Button size="lg" className="rounded-full shadow-xl" onClick={() => setShowModal(true)}>
              <FiPlus className="mr-2 w-5 h-5" />
              New Post
            </Button>
          </div>

          {/* Create Post Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FiLock className="text-purple-600" />
                    Create Secure Post
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Post Title"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Share your experience or resource..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 h-32"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={newPost.anonymous}
                        onChange={(e) => setNewPost({ ...newPost, anonymous: e.target.checked })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="anonymous" className="text-sm text-gray-600">
                        Post Anonymously
                      </label>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitPost}>Share Post</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CommunityPage;