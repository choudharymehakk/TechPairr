import React, { useState } from 'react';
import { createStudentProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentProfileForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: '',
    department: '',
    year_of_study: 1,
    cgpa: '',
    skills: '',
    interests: '',
    career_goals: '',
    portfolio_url: '',
    github_url: '',
    bio: '',
    collaboration_preference: 'seeking_mentor',
    time_commitment: 10
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const profileData = {
        ...formData,
        user_id: user?.id,
        skills: formData.skills.split(',').map(s => s.trim()),
        interests: formData.interests.split(',').map(s => s.trim()),
        career_goals: formData.career_goals.split(',').map(s => s.trim()),
        cgpa: parseFloat(formData.cgpa),
        year_of_study: parseInt(formData.year_of_study.toString())
      };

      const response = await createStudentProfile(profileData);
      if (response.data.status === 'success') {
        setMessage('Profile created successfully! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      setMessage('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">🎓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Student Profile Setup</h2>
          <p className="text-gray-600">Tell us about your academic journey and goals</p>
        </div>

        {/* Basic Information */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📚</span> Academic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="student_id"
              type="text"
              placeholder="Student ID"
              value={formData.student_id}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input
              name="department"
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            <select
              name="year_of_study"
              value={formData.year_of_study}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
            <input
              name="cgpa"
              type="number"
              step="0.01"
              placeholder="CGPA (Optional)"
              value={formData.cgpa}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="0"
              max="10"
            />
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🚀</span> Skills & Interests
          </h3>
          <div className="space-y-4">
            <input
              name="skills"
              type="text"
              placeholder="Skills (e.g., Python, React, Machine Learning)"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="interests"
              type="text"
              placeholder="Interests (e.g., AI, Web Development, Data Science)"
              value={formData.interests}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="career_goals"
              type="text"
              placeholder="Career Goals (e.g., Software Engineer, Data Scientist)"
              value={formData.career_goals}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Links & Portfolio */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔗</span> Portfolio & Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="portfolio_url"
              type="url"
              placeholder="Portfolio URL (Optional)"
              value={formData.portfolio_url}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="github_url"
              type="url"
              placeholder="GitHub URL (Optional)"
              value={formData.github_url}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚙️</span> Mentoring Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="collaboration_preference"
              value={formData.collaboration_preference}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="seeking_mentor">Seeking Mentor</option>
              <option value="seeking_partner">Seeking Partner</option>
              <option value="joining_projects">Joining Projects</option>
            </select>
            <input
              name="time_commitment"
              type="number"
              placeholder="Hours per week"
              value={formData.time_commitment}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="1"
            />
          </div>
          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="mt-4 w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-4 px-6 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Creating Profile...
            </div>
          ) : (
            <>
              <span className="mr-2">✨</span>
              Complete Student Profile
            </>
          )}
        </button>

        {message && (
          <div className={`text-center text-sm font-medium ${
            message.includes('Error') ? 'text-red-600' : 'text-green-600'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentProfileForm;
