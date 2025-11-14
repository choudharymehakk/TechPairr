import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentProfileForm from '../components/StudentProfileForm';
import FacultyProfileForm from '../components/FacultyProfileForm';
import IndustryProfileForm from '../components/IndustryProfileForm';

const ProfileSetup: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }}>
        <div className="text-center bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login to setup your profile</p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const getUserTypeInfo = () => {
    switch (user.user_type) {
      case 'student':
        return {
          icon: '🎓',
          title: 'Student',
          description: 'Connect with mentors and accelerate your learning journey',
          gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          buttonGradient: 'from-blue-500 to-teal-500'
        };
      case 'faculty':
        return {
          icon: '👨‍🏫',
          title: 'Faculty',
          description: 'Guide the next generation of innovators and researchers',
          gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
          buttonGradient: 'from-green-500 to-blue-500'
        };
      case 'industry':
        return {
          icon: '💼',
          title: 'Industry Mentor',
          description: 'Share real-world experience with aspiring professionals',
          gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
          buttonGradient: 'from-orange-500 to-red-500'
        };
      default:
        return {
          icon: '❓',
          title: 'Unknown',
          description: 'Unknown user type',
          gradient: 'linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)',
          buttonGradient: 'from-gray-500 to-gray-700'
        };
    }
  };

  const renderProfileForm = () => {
    switch (user.user_type) {
      case 'student':
        return <StudentProfileForm />;
      case 'faculty':
        return <FacultyProfileForm />;
      case 'industry':
        return <IndustryProfileForm />;
      default:
        return (
          <div className="text-center py-12 bg-white/90 backdrop-blur-lg rounded-2xl">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unknown User Type</h3>
            <p className="text-gray-600">Please contact support for assistance.</p>
          </div>
        );
    }
  };

  const userInfo = getUserTypeInfo();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4" style={{
      background: userInfo.gradient
    }}>
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${userInfo.buttonGradient} rounded-full mb-6 shadow-2xl`}>
            <span className="text-3xl">{userInfo.icon}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Mentora, {user.full_name}!
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-700 mb-2">
              Complete your {userInfo.title} profile to get started
            </p>
            <p className="text-lg text-gray-600">
              {userInfo.description}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
              <span>Account Created</span>
              <span>Profile Setup</span>
              <span>Dashboard</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-1/2 shadow-sm"></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Step 2 of 3</p>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 mb-8 border border-white/50 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{userInfo.icon}</span>
              <div>
                <h3 className="text-gray-800 font-semibold">{user.full_name}</h3>
                <p className="text-gray-600 text-sm">{user.email} • {userInfo.title}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-white/60 hover:bg-white/80 text-gray-700 rounded-lg transition-all duration-200 border border-white/50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-white/50 shadow-2xl">
          {renderProfileForm()}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:support@mentora.com" className="text-gray-700 hover:text-gray-800 underline font-medium">
              support@mentora.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
