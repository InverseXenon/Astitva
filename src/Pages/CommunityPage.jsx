// src/pages/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiArrowDown, FiPlus, FiLock, FiMapPin, FiShield } from 'react-icons/fi';
import { FaRegComments, FaFirstAid, FaBalanceScale } from 'react-icons/fa';
import { mockPosts } from '../mockData';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', category: 'Career', anonymous: false });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Core Categories from POC
  const categories = [
    { name: 'Career', icon: <FaRegComments />, color: 'bg-blue-100' },
    { name: 'Health', icon: <FaFirstAid />, color: 'bg-green-100' },
    { name: 'Safety', icon: <FiShield />, color: 'bg-red-100' },
    { name: 'Legal', icon: <FaBalanceScale />, color: 'bg-purple-100' }
  ];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const handleSubmitPost = () => {
    if (newPost.content) {
      setPosts([{
        id: posts.length + 1,
        ...newPost,
        upvotes: 0,
        comments: [],
        date: new Date().toISOString(),
        resources: null,
        media: null
      }, ...posts]);
      setNewPost({ content: '', category: 'Career', anonymous: false });
      setShowModal(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mt-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <FiShield className="inline mr-2 text-red-500" />
            Astitva Community
          </h1>
          <p className="text-gray-600">Safe space for empowerment & mutual support</p>
        </div>

        {/* Action Bar */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Search for resources or discussions..."
            className="flex-1 p-2 border rounded-lg min-w-[200px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map(cat => (
            <div 
              key={cat.name} 
              className={`p-4 rounded-lg ${cat.color} border hover:shadow-md transition-shadow`}
            >
              <div className="text-2xl mb-2 text-gray-700">{cat.icon}</div>
              <h3 className="font-semibold text-gray-800">{cat.name}</h3>
            </div>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center pt-2">
                  <button className="text-gray-500 hover:text-blue-600">
                    <FiArrowUp size={20} />
                  </button>
                  <span className="my-1 font-medium text-gray-700">{post.upvotes - post.downvotes}</span>
                  <button className="text-gray-500 hover:text-red-600">
                    <FiArrowDown size={20} />
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {/* Fixed template literal syntax here */}
                    <span className={`text-sm px-2 py-1 rounded-full ${categories.find(c => c.name === post.category)?.color}`}>
                      {post.category}
                    </span>
                    {post.anonymous && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <FiLock size={14} className="mr-1" /> Anonymous
                      </span>
                    )}
                    {post.resources && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <FiMapPin size={14} className="mr-1" /> {post.resources.type}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1 text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 mb-2">{post.content}</p>
                  
                  {post.media && (
                    <div className="mb-3 border rounded-lg overflow-hidden">
                      <img 
                        src={post.media.image} 
                        alt={post.media.caption}
                        className="w-full h-40 object-cover"
                      />
                      <p className="text-sm p-2 bg-gray-50">{post.media.caption}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-gray-500">
                    <button className="flex items-center gap-1 hover:text-blue-600">
                      <FaRegComments /> {post.comments.length}
                    </button>
                    {post.resources?.verified && (
                      <span className="text-green-600 flex items-center">
                        <FiShield className="mr-1" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed top-20 right-8 bg-red-500 text-white p-2 rounded-md shadow-lg hover:bg-red-600 transition-colors"
        >
          Create Post
        </button>

        {/* Create Post Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiShield className="text-red-500" />
                New Post (Secure)
              </h2>
              <select
                className="w-full p-2 mb-3 border rounded"
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <textarea
                placeholder="Share your experience or resource..."
                className="w-full p-2 mb-3 border rounded h-32"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
              <div className="flex justify-between mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPost.anonymous}
                    onChange={(e) => setNewPost({...newPost, anonymous: e.target.checked})}
                  />
                  Post Anonymously
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPost}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Share Securely
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;