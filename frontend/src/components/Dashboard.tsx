import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Users, TrendingUp, FolderOpen, Mail } from 'lucide-react'
import { getDashboardStats } from '../services/api'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({
    matches: 0,
    applications: 0,
    projects: 0,
    requests: 0
  })

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.id) {
          const response = await getDashboardStats(user.id);
          if (response.data.status === 'success') {
            setStats(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to access dashboard</h2>
          <a href="/" className="text-blue-600 hover:text-blue-500 underline font-medium">Go to Login</a>
        </div>
      </div>
    )
  }

  // Fixed background - same for all user types to prevent flickering
  const dashboardGradient = 'from-slate-50 via-blue-50 to-cyan-50'

  return (
    <div className={`min-h-screen bg-gradient-to-br ${dashboardGradient} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome back, {user.full_name}! 👋
              </h1>
              <p className="text-lg text-gray-600 capitalize flex items-center gap-2">
                <span className="text-2xl">
                  {user.user_type === 'student' ? '🎓' : user.user_type === 'faculty' ? '👨‍🏫' : '💼'}
                </span>
                {user.user_type} Dashboard
              </p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-md font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Matches</span>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.matches}</p>
            <p className="text-xs text-gray-500 mt-1">Available matches</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Applications</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.applications}</p>
            <p className="text-xs text-gray-500 mt-1">Total applications</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Projects</span>
              <FolderOpen className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.projects}</p>
            <p className="text-xs text-gray-500 mt-1">Active projects</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Requests</span>
              <Mail className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.requests}</p>
            <p className="text-xs text-gray-500 mt-1">Pending requests</p>
          </div>
        </div>

        {/* Discover & Connect Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            Discover & Connect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/explore" className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔎</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Explore Matches</h3>
                  <p className="text-sm text-gray-600">Find mentors and opportunities</p>
                </div>
              </div>
            </a>

            <a href="/mentorship-requests" className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl">💬</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Mentorship Requests</h3>
                  <p className="text-sm text-gray-600">Manage mentorship connections</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/create-project" className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-green-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl">➕</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Create Project</h3>
                  <p className="text-sm text-gray-600">Post a new project</p>
                </div>
              </div>
            </a>

            <a href="/browse-projects" className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔍</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Browse Projects</h3>
                  <p className="text-sm text-gray-600">Explore all projects</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/my-applications" className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📋</div>
                <div>
                  <h3 className="font-semibold text-gray-800">My Applications</h3>
                  <p className="text-sm text-gray-600">Track your applications</p>
                </div>
              </div>
            </a>

            <a href="/received-applications" className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-rose-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📥</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Received Applications</h3>
                  <p className="text-sm text-gray-600">Manage incoming applications</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* My Work Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📁</span>
            My Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/active-projects" className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-teal-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🚀</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Active Projects</h3>
                  <p className="text-sm text-gray-600">View ongoing projects</p>
                </div>
              </div>
            </a>

            <a href="/my-projects" className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-violet-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📁</div>
                <div>
                  <h3 className="font-semibold text-gray-800">My Projects</h3>
                  <p className="text-sm text-gray-600">Manage your projects</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            Settings
          </h2>
          <a href="/profile-setup" className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-gray-200 block">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📝</div>
              <div>
                <h3 className="font-semibold text-gray-800">Profile Setup</h3>
                <p className="text-sm text-gray-600">Update your profile information</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard
