import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Briefcase, 
  Heart, 
  TrendingUp, 
  Bell, 
  Settings, 
  BookOpen, 
  Target, 
  Award, 
  ArrowUpRight,
  Activity,
  Globe,
  MessageCircle,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Star,
  ChevronRight,
  Play
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();
  const [_activeTab, _setActiveTab] = useState('overview');
  
  const userName = user?.firstName || user?.username || 'User';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';
  
  const stats = [
    { label: 'Applications Sent', value: '12', icon: Briefcase, color: 'bg-blue-500', trend: '+25%' },
    { label: 'Skill Score', value: '850', icon: Target, color: 'bg-green-500', trend: '+12%' },
    { label: 'Network Connections', value: '47', icon: Users, color: 'bg-purple-500', trend: '+8%' },
    { label: 'Learning Hours', value: '28', icon: BookOpen, color: 'bg-orange-500', trend: '+15%' }
  ];

  const quickActions = [
    { title: 'Find Jobs', description: 'Browse AI-matched opportunities', icon: Briefcase, path: '/jobfindings', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
    { title: 'Health Check', description: 'Track your wellness journey', icon: Heart, path: '/health-wellness', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
    { title: 'Join Community', description: 'Connect with other women', icon: Users, path: '/community', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { title: 'Learn Skills', description: 'Enhance your capabilities', icon: BookOpen, path: '/education', color: 'bg-green-50 hover:bg-green-100 text-green-700' }
  ];

  const recentActivities = [
    { action: 'Applied to Software Developer position', time: '2 hours ago', icon: Briefcase, status: 'pending' },
    { action: 'Completed React Fundamentals course', time: '1 day ago', icon: Award, status: 'completed' },
    { action: 'Connected with Sarah Chen', time: '2 days ago', icon: Users, status: 'completed' },
    { action: 'Health check-in recorded', time: '3 days ago', icon: Heart, status: 'completed' }
  ];

  const upcomingEvents = [
    { title: 'Career Workshop: Interview Skills', date: 'Tomorrow, 2:00 PM', type: 'workshop' },
    { title: 'Community Meetup: Women in Tech', date: 'Friday, 6:00 PM', type: 'meetup' },
    { title: 'Health Webinar: Mental Wellness', date: 'Next Monday, 11:00 AM', type: 'webinar' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="text-purple-600">{userName}!</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Ready to continue your empowerment journey? Here's what's happening today.
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button className="relative p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.path}
                    className={`p-4 rounded-xl transition-all duration-200 cursor-pointer ${action.color}`}
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-8 h-8" />
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm opacity-80">{action.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Progress</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Career Development</span>
                    <span className="text-sm text-gray-500">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Health & Wellness</span>
                    <span className="text-sm text-gray-500">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Financial Literacy</span>
                    <span className="text-sm text-gray-500">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Community Engagement</span>
                    <span className="text-sm text-gray-500">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      activity.status === 'completed' ? 'bg-green-50' : 'bg-yellow-50'
                    }`}>
                      <activity.icon className={`w-5 h-5 ${
                        activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    {activity.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {activity.status === 'pending' && (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">{userName.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{user?.fullName || userName}</h3>
                <p className="text-purple-100 text-sm mb-4">Member since {memberSince}</p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold">Level 3</div>
                    <div className="text-purple-200">Achiever</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">1,240</div>
                    <div className="text-purple-200">Points</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
                      event.type === 'workshop' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'meetup' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-yellow-700">First Job Application</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-green-700">Course Completed</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-purple-700">Community Member</p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Today's Tip</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                "Building a strong professional network is key to career success. 
                Try connecting with 2 new people in your field this week!"
              </p>
              <button className="mt-4 flex items-center text-purple-600 text-sm font-medium hover:text-purple-700">
                <Play className="w-4 h-4 mr-1" />
                Watch networking tips
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}