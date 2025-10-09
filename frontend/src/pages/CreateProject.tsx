import React, { useState } from 'react';
import { createProject } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateProject: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: '',
    required_expertise: '',
    student_count_needed: 1,
    duration: '',
    time_commitment_hours: 10,
    start_date: '',
    goals: '',
    deliverables: '',
    resources_available: '',
    domain: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getProjectType = () => {
    switch (user?.user_type) {
      case 'student':
        return 'student_seeking_mentor';
      case 'faculty':
        return 'faculty_led';
      case 'industry':
        return 'industry_led';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        creator_id: user?.id,
        creator_type: user?.user_type,
        project_type: getProjectType(),
        required_skills: formData.required_skills.split(',').map(s => s.trim()),
        required_expertise: formData.required_expertise.split(',').map(s => s.trim()),
        resources_available: formData.resources_available.split(',').map(s => s.trim()),
        student_count_needed: parseInt(formData.student_count_needed.toString()),
        time_commitment_hours: parseInt(formData.time_commitment_hours.toString())
      };

      const response = await createProject(projectData);
      if (response.data.status === 'success') {
        setMessage('Project created successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      setMessage('Error creating project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserGradient = () => {
    switch (user?.user_type) {
      case 'student':
        return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
      case 'faculty':
        return 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)';
      case 'industry':
        return 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)';
      default:
        return 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    }
  };

  const getButtonGradient = () => {
    switch (user?.user_type) {
      case 'student':
        return 'from-blue-500 to-teal-500';
      case 'faculty':
        return 'from-green-500 to-blue-500';
      case 'industry':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }}>
        <div className="text-center bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to create a project</h2>
          <a href="/" className="text-blue-600 hover:text-blue-500 underline font-medium">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4" style={{
      background: getUserGradient()
    }}>
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Project</h1>
          <p className="text-lg text-gray-700">Share your project idea and find the right collaborators</p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📋</span> Project Details
              </h3>
              <div className="space-y-4">
                <input
                  name="title"
                  type="text"
                  placeholder="Project Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Project Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                  required
                />
                <input
                  name="domain"
                  type="text"
                  placeholder="Domain (e.g., Machine Learning, Web Development)"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span> Requirements
              </h3>
              <div className="space-y-4">
                <input
                  name="required_skills"
                  type="text"
                  placeholder="Required Skills (comma separated)"
                  value={formData.required_skills}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <input
                  name="required_expertise"
                  type="text"
                  placeholder="Required Expertise (comma separated)"
                  value={formData.required_expertise}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <input
                  name="student_count_needed"
                  type="number"
                  placeholder="Number of collaborators needed"
                  value={formData.student_count_needed}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  min="1"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📅</span> Timeline & Commitment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  name="duration"
                  type="text"
                  placeholder="Duration (e.g., 3 months)"
                  value={formData.duration}
                  onChange={handleChange}
                  className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <input
                  name="time_commitment_hours"
                  type="number"
                  placeholder="Hours per week"
                  value={formData.time_commitment_hours}
                  onChange={handleChange}
                  className="px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  min="1"
                />
                <input
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="px-4 py-3 bg-white/70 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Goals & Deliverables */}
            <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🎓</span> Goals & Deliverables
              </h3>
              <div className="space-y-4">
                <textarea
                  name="goals"
                  placeholder="Project Goals & Objectives"
                  value={formData.goals}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                />
                <textarea
                  name="deliverables"
                  placeholder="Expected Deliverables"
                  value={formData.deliverables}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                />
                <input
                  name="resources_available"
                  type="text"
                  placeholder="Resources Available (comma separated)"
                  value={formData.resources_available}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-4 px-6 text-lg font-semibold rounded-xl text-white bg-gradient-to-r ${getButtonGradient()} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating Project...
                </div>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Create Project
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

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-700 hover:text-gray-800 underline font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
