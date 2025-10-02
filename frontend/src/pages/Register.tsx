import React, { useState } from 'react'
import { register } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import type { RegisterData } from '../services/api'
import { useNavigate } from 'react-router-dom'

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    full_name: '',
    user_type: 'student'
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await register(formData)
      if (response.data.status === 'success') {
        login(response.data.user, response.data.token)
        setMessage('Registration successful! Setting up your profile...')
        setTimeout(() => navigate('/profile-setup'), 1000)
      } else {
        setMessage(response.data.message)
      }
    } catch (err: any) {
      setMessage('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const userTypeOptions = [
    { value: 'student', label: 'Student', icon: '🎓' },
    { value: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { value: 'industry', label: 'Industry Mentor', icon: '💼' }
  ]

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg mb-6">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Join Mentora</h2>
          <p className="text-lg text-gray-600">Start your mentoring journey today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                name="full_name"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
              />
              
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                {userTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {message && (
              <div className={`text-center text-sm font-medium ${
                message.includes('failed') ? 'text-red-600' : 'text-green-600'
              }`}>
                {message}
              </div>
            )}

            <div className="text-center">
              <span className="text-gray-600">
                Already have an account?{' '}
                <a href="/" className="font-semibold text-orange-600 hover:text-orange-500 transition-colors duration-200">
                  Sign in
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
