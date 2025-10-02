import React, { useState } from 'react';
import { createFacultyProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const FacultyProfileForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: '',
    department: '',
    designation: '',
    research_areas: '',
    expertise: '',
    mentoring_capacity: 3,
    mentoring_style: 'light_guidance',
    available_resources: '',
    lab_access: false,
    funding_available: false,
    open_to_student_ideas: true,
    bio: '',
    google_scholar: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        ...formData,
        user_id: user?.id,
        research_areas: formData.research_areas.split(',').map(s => s.trim()),
        expertise: formData.expertise.split(',').map(s => s.trim()),
        available_resources: formData.available_resources.split(',').map(s => s.trim()),
        mentoring_capacity: parseInt(formData.mentoring_capacity.toString())
      };

      const response = await createFacultyProfile(profileData);
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Faculty Profile Setup</h2>
          <p className="text-gray-600">Share your expertise and mentoring approach</p>
        </div>

        {/* Professional Information */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🏛️</span> Professional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="employee_id"
              type="text"
              placeholder="Employee ID"
              value={formData.employee_id}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input
              name="department"
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input
              name="designation"
              type="text"
              placeholder="Designation (e.g., Associate Professor)"
              value={formData.designation}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input
              name="google_scholar"
              type="url"
              placeholder="Google Scholar Profile (Optional)"
              value={formData.google_scholar}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Research & Expertise */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔬</span> Research & Expertise
          </h3>
          <div className="space-y-4">
            <input
              name="research_areas"
              type="text"
              placeholder="Research Areas (e.g., Machine Learning, Cybersecurity)"
              value={formData.research_areas}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="expertise"
              type="text"
              placeholder="Technical Expertise (e.g., Python, Deep Learning)"
              value={formData.expertise}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="available_resources"
              type="text"
              placeholder="Available Resources (e.g., GPU Cluster, Lab Equipment)"
              value={formData.available_resources}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Mentoring Preferences */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span> Mentoring Approach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              name="mentoring_capacity"
              type="number"
              placeholder="Max Students to Mentor"
              value={formData.mentoring_capacity}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              min="1"
              max="10"
            />
            <select
              name="mentoring_style"
              value={formData.mentoring_style}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="light_guidance">Light Guidance</option>
              <option value="active_collaboration">Active Collaboration</option>
              <option value="intensive_mentoring">Intensive Mentoring</option>
            </select>
          </div>
          
          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                name="lab_access"
                type="checkbox"
                checked={formData.lab_access}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 bg-white border border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">Lab Access Available</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                name="funding_available"
                type="checkbox"
                checked={formData.funding_available}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 bg-white border border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">Research Funding Available</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                name="open_to_student_ideas"
                type="checkbox"
                checked={formData.open_to_student_ideas}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 bg-white border border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">Open to Student Project Ideas</span>
            </label>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📝</span> About You
          </h3>
          <textarea
            name="bio"
            placeholder="Tell students about your research, teaching philosophy, and mentoring style..."
            value={formData.bio}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-4 px-6 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Creating Profile...
            </div>
          ) : (
            <>
              <span className="mr-2">🎓</span>
              Complete Faculty Profile
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

export default FacultyProfileForm;
