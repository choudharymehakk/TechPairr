import React, { useState } from 'react';
import { createIndustryProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const IndustryProfileForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    industry_domain: '',
    expertise: '',
    years_experience: 1,
    mentoring_capacity: 8,
    available_time: 5,
    mentoring_focus: '',
    linkedin_profile: '',
    company_website: '',
    willing_to_provide: '',
    bio: ''
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
        expertise: formData.expertise.split(',').map(s => s.trim()),
        mentoring_focus: formData.mentoring_focus.split(',').map(s => s.trim()),
        willing_to_provide: formData.willing_to_provide.split(',').map(s => s.trim()),
        years_experience: parseInt(formData.years_experience.toString()),
        mentoring_capacity: parseInt(formData.mentoring_capacity.toString()),
        available_time: parseInt(formData.available_time.toString())
      };

      const response = await createIndustryProfile(profileData);
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">💼</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Industry Mentor Profile</h2>
          <p className="text-gray-600">Share your industry experience and mentoring goals</p>
        </div>

        {/* Company Information */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🏢</span> Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="company"
              type="text"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input
              name="position"
              type="text"
              placeholder="Position/Title"
              value={formData.position}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input
              name="industry_domain"
              type="text"
              placeholder="Industry Domain (e.g., Fintech, Healthcare)"
              value={formData.industry_domain}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input
              name="years_experience"
              type="number"
              placeholder="Years of Experience"
              value={formData.years_experience}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              min="0"
            />
          </div>
        </div>

        {/* Expertise & Skills */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚡</span> Expertise & Skills
          </h3>
          <div className="space-y-4">
            <input
              name="expertise"
              type="text"
              placeholder="Technical Expertise (e.g., Cloud Architecture, Product Management)"
              value={formData.expertise}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="mentoring_focus"
              type="text"
              placeholder="Mentoring Focus Areas (e.g., Career Guidance, Technical Skills)"
              value={formData.mentoring_focus}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="willing_to_provide"
              type="text"
              placeholder="Willing to Provide (e.g., Internship Opportunities, Code Reviews)"
              value={formData.willing_to_provide}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Mentoring Availability */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⏰</span> Mentoring Availability
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="mentoring_capacity"
              type="number"
              placeholder="Max Students to Mentor"
              value={formData.mentoring_capacity}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              min="1"
              max="20"
            />
            <input
              name="available_time"
              type="number"
              placeholder="Hours per week"
              value={formData.available_time}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              min="1"
            />
          </div>
        </div>

        {/* Professional Links */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔗</span> Professional Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="linkedin_profile"
              type="url"
              placeholder="LinkedIn Profile"
              value={formData.linkedin_profile}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="company_website"
              type="url"
              placeholder="Company Website (Optional)"
              value={formData.company_website}
              onChange={handleChange}
              className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📝</span> Professional Bio
          </h3>
          <textarea
            name="bio"
            placeholder="Share your professional journey, what motivates you to mentor, and what students can expect from working with you..."
            value={formData.bio}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-4 px-6 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Creating Profile...
            </div>
          ) : (
            <>
              <span className="mr-2">💼</span>
              Complete Industry Profile
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

export default IndustryProfileForm;
