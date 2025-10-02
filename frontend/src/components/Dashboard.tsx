import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }}>
        <div className="text-center bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to access dashboard</h2>
          <a href="/" className="text-blue-600 hover:text-blue-500 underline font-medium">Go to Login</a>
        </div>
      </div>
    )
  }

  const getUserTypeInfo = () => {
    switch (user.user_type) {
      case 'student':
        return { 
          icon: '🎓', 
          gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          buttonGradient: 'from-blue-500 to-teal-500' 
        }
      case 'faculty':
        return { 
          icon: '👨‍🏫', 
          gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
          buttonGradient: 'from-green-500 to-blue-500' 
        }
      case 'industry':
        return { 
          icon: '💼', 
          gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
          buttonGradient: 'from-orange-500 to-red-500' 
        }
      default:
        return { 
          icon: '❓', 
          gradient: 'linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)',
          buttonGradient: 'from-gray-500 to-gray-700' 
        }
    }
  }

  const userInfo = getUserTypeInfo()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4" style={{
      background: userInfo.gradient
    }}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${userInfo.buttonGradient} rounded-full mb-6 shadow-2xl`}>
            <span className="text-3xl">{userInfo.icon}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome back, {user.full_name}!
          </h1>
          <p className="text-xl text-gray-700 capitalize">
            {user.user_type} Dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/50 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 p-6 rounded-xl border border-white/50 text-center shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-gray-800 font-semibold mb-2">Profile Setup</h3>
              <a href="/profile-setup" className="text-blue-600 hover:text-blue-500 underline font-medium">
                Update Profile
              </a>
            </div>
            <div className="bg-white/60 p-6 rounded-xl border border-white/50 text-center shadow-lg">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-gray-800 font-semibold mb-2">Browse</h3>
              <p className="text-gray-500 text-sm">Coming Soon</p>
            </div>
            <div className="bg-white/60 p-6 rounded-xl border border-white/50 text-center shadow-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-gray-800 font-semibold mb-2">Analytics</h3>
              <p className="text-gray-500 text-sm">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={logout}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/60 hover:bg-white/80 text-gray-700 rounded-xl transition-all duration-200 border border-white/50 shadow-lg font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
