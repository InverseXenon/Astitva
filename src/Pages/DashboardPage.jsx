import { useUser } from '@clerk/clerk-react';

export default function DashboardPage() {
  const { user } = useUser();
  
  return (
    <div className="dashboard min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-purple-800">
          Welcome, <span className="text-indigo-600">{user?.username || user?.firstName || 'User'}</span>!
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Account Information Card */}
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
              <h2 className="text-xl font-semibold mb-4 text-indigo-800">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account Information
                </span>
              </h2>
              <div className="space-y-3 text-gray-800">
                <p><span className="font-medium text-indigo-700">Username:</span> <span className="font-semibold">{user?.username || 'Not set'}</span></p>
                <p><span className="font-medium text-indigo-700">Email:</span> <span className="font-semibold">{user?.primaryEmailAddress?.emailAddress}</span></p>
                <p><span className="font-medium text-indigo-700">Member Since:</span> <span className="font-semibold">{new Date(user?.createdAt).toLocaleDateString()}</span></p>
              </div>
            </div>
            
            {/* Personal Details Card */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Personal Details
                </span>
              </h2>
              <div className="space-y-3 text-gray-800">
                <p><span className="font-medium text-purple-700">Full Name:</span> <span className="font-semibold">{user?.fullName}</span></p>
                <p><span className="font-medium text-purple-700">First Name:</span> <span className="font-semibold">{user?.firstName}</span></p>
                <p><span className="font-medium text-purple-700">Last Name:</span> <span className="font-semibold">{user?.lastName}</span></p>
              </div>
            </div>
          </div>
          
          {/* Dashboard Content Card */}
          <div className="bg-white border-t border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Your Personal Dashboard
            </h2>
            <div className="prose prose-indigo max-w-none">
              <p className="text-gray-700">
                Welcome to your secure dashboard. Here you can access all your account features and settings.
              </p>
              {!user?.username && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                  <p className="text-yellow-700 font-medium">
                    You haven't set a username yet. Please update your profile to choose one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}