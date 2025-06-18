// src/pages/ResourceFinderPage.jsx
import React, { useState } from 'react';
import ResourceFinder from '../components/ResourceFinder';
import ResourceMap from '../components/ResourceMap';
import {
  Search,
  MapPin,
  Filter,
  Star,
  Clock,
  Phone,
  Globe,
  Navigation,
  Heart,
  Shield,
  BookOpen,
  Briefcase,
  DollarSign,
  Users,
  Award,
  TrendingUp,
  Zap,
  CheckCircle,
  ArrowRight,
  Plus,
  Eye,
  Share2
} from 'lucide-react';

const ResourceFinderPage = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: Search, color: 'bg-gray-500', count: 1247 },
    { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'bg-red-500', count: 324 },
    { id: 'legal', name: 'Legal Aid', icon: Shield, color: 'bg-blue-500', count: 189 },
    { id: 'education', name: 'Education', icon: BookOpen, color: 'bg-green-500', count: 256 },
    { id: 'career', name: 'Career Services', icon: Briefcase, color: 'bg-purple-500', count: 198 },
    { id: 'financial', name: 'Financial Aid', icon: DollarSign, color: 'bg-yellow-500', count: 167 },
    { id: 'community', name: 'Community', icon: Users, color: 'bg-indigo-500', count: 113 }
  ];

  const featuredResources = [
    {
      id: 1,
      name: "Women's Health Center",
      category: 'Healthcare',
      rating: 4.8,
      distance: '0.5 km',
      phone: '+91 98765 43210',
      website: 'www.womenshealthcenter.in',
      isOpen: true,
      verified: true,
      description: 'Comprehensive healthcare services for women with specialized gynecological care.'
    },
    {
      id: 2,
      name: 'Legal Aid Society',
      category: 'Legal Aid',
      rating: 4.9,
      distance: '1.2 km',
      phone: '+91 98765 43211',
      website: 'www.legalaid.in',
      isOpen: true,
      verified: true,
      description: 'Free legal consultation and representation for women facing domestic violence.'
    },
    {
      id: 3,
      name: 'SkillForge Training Center',
      category: 'Career Services',
      rating: 4.7,
      distance: '2.1 km',
      phone: '+91 98765 43212',
      website: 'www.skillforge.in',
      isOpen: false,
      verified: true,
      description: 'Professional development and skill training programs for career advancement.'
    }
  ];

  const quickStats = [
    { label: 'Total Resources', value: '1,247', icon: MapPin, color: 'text-blue-600' },
    { label: 'Verified Centers', value: '892', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Average Rating', value: '4.7', icon: Star, color: 'text-yellow-600' },
    { label: 'Cities Covered', value: '45+', icon: Navigation, color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-medium">AI-Powered Resource Discovery</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Essential Resources
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Discover verified healthcare centers, legal aid services, educational institutions, 
              and career development resources near you with our smart location-based platform.
            </p>

            {/* Quick Search */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for resources, services, or locations..."
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color.replace('text-', 'text-white')}`} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-purple-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation Tabs */}
        <div className="mb-12">
          <div className="flex space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-200 w-fit mx-auto">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center ${
                activeTab === 'map'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Interactive Map
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center ${
                activeTab === 'list'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Search className="w-5 h-5 mr-2" />
              Advanced Search
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl text-center transition-all duration-200 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200'
                }`}
              >
                <category.icon className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs opacity-75 mt-1">{category.count} resources</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'map' ? (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <h2 className="text-2xl font-bold mb-2">Interactive Resource Map</h2>
                <p className="text-purple-100">Click on markers to see detailed information about each resource</p>
              </div>
              <div className="h-96 bg-gray-100">
                <ResourceMap />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Filter className="w-6 h-6 mr-2 text-purple-600" />
                Advanced Resource Search
              </h2>
              <ResourceFinder />
            </div>
          </div>
        )}

        {/* Featured Resources */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Resources</h2>
              <p className="text-gray-600">Highly rated and verified service providers near you</p>
            </div>
            <button className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{resource.name}</h3>
                        {resource.verified && (
                          <Award className="w-5 h-5 text-blue-500 ml-2" />
                        )}
                      </div>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {resource.category}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      resource.isOpen 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {resource.isOpen ? 'Open' : 'Closed'}
                    </div>
                  </div>

                  {/* Rating & Distance */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900 ml-1">{resource.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{resource.distance}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-3 text-green-500" />
                      <span className="text-sm">{resource.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-4 h-4 mr-3 text-blue-500" />
                      <span className="text-sm">{resource.website}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center justify-center">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </button>
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Need Help Finding Resources?</h2>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Our team is here to assist you in finding the right resources for your specific needs. 
              Get personalized recommendations and support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 text-center transition-all duration-200 transform hover:scale-105">
              <Phone className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold mb-2">Call Support</div>
              <div className="text-purple-200 text-sm">Available 24/7</div>
            </button>
            
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 text-center transition-all duration-200 transform hover:scale-105">
              <Zap className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold mb-2">Live Chat</div>
              <div className="text-purple-200 text-sm">Instant assistance</div>
            </button>
            
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 text-center transition-all duration-200 transform hover:scale-105">
              <Plus className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold mb-2">Add Resource</div>
              <div className="text-purple-200 text-sm">Help others find help</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceFinderPage;