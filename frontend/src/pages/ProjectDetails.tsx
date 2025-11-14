import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, createApplication } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  creator_type: string;
  project_type: string;
  domain: string;
  required_skills: string[];
  required_expertise: string[];
  student_count_needed: number;
  duration: string;
  time_commitment_hours: number;
  start_date: string;
  goals: string;
  deliverables: string;
  resources_available: string[];
  status: string;
  created_at: string;
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    relevant_experience: '',
    availability: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await getProject(projectId!);
      setProject(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      setLoading(false);
    }
  };

  const canApply = () => {
    if (!user || !project) return false;
    
    // User can't apply to their own project
    if (user.id === project.creator_id) return false;
    
    // Students can apply to faculty/industry projects
    if (user.user_type === 'student' && 
        (project.creator_type === 'faculty' || project.creator_type === 'industry')) {
      return true;
    }
    
    // Faculty/Industry can apply to mentor student projects
    if ((user.user_type === 'faculty' || user.user_type === 'industry') && 
        project.creator_type === 'student') {
      return true;
    }
    
    return false;
  };

  const getApplicationButtonText = () => {
    if (!project) return '';
    
    if (project.creator_type === 'student') {
      return 'Offer to Mentor';
    } else {
      return 'Apply to Join';
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const applicationType = project?.creator_type === 'student' 
        ? 'mentor_to_project' 
        : 'student_to_project';

      const data = {
        project_id: projectId,
        applicant_id: user?.id,
        applicant_type: user?.user_type,
        application_type: applicationType,
        ...applicationData
      };

      const response = await createApplication(data);
      
      if (response.data.status === 'success') {
        setMessage('Application submitted successfully!');
        setShowApplicationForm(false);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setMessage('Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCreatorIcon = (type: string) => {
    switch (type) {
      case 'student': return '🎓';
      case 'faculty': return '👨‍🏫';
      case 'industry': return '💼';
      default: return '👤';
    }
  };

  const getCreatorBadgeColor = (type: string) => {
    switch (type) {
      case 'student': return 'bg-blue-100 text-blue-700';
      case 'faculty': return 'bg-green-100 text-green-700';
      case 'industry': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case 'student_seeking_mentor': return 'Student Seeking Mentor';
      case 'faculty_led': return 'Faculty Research Project';
      case 'industry_led': return 'Industry Project';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
          <button
            onClick={() => navigate('/browse-projects')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mentora
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/browse-projects')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                ← Back to Projects
              </button>
              {user && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getCreatorBadgeColor(project.creator_type)} bg-white`}>
                {getCreatorIcon(project.creator_type)} {getProjectTypeLabel(project.project_type)}
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {project.status}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              {project.domain && (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  {project.domain}
                </span>
              )}
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {project.duration || 'Flexible'}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {project.student_count_needed} collaborators needed
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{project.description}</p>
            </div>

            {/* Goals */}
            {project.goals && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Project Goals
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{project.goals}</p>
              </div>
            )}

            {/* Deliverables */}
            {project.deliverables && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Expected Deliverables
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{project.deliverables}</p>
              </div>
            )}

            {/* Required Skills */}
            {project.required_skills && project.required_skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.required_skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Required Expertise */}
            {project.required_expertise && project.required_expertise.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Required Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {project.required_expertise.map((expertise, index) => (
                    <span key={index} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                      {expertise}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Available */}
            {project.resources_available && project.resources_available.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Resources Available</h3>
                <div className="flex flex-wrap gap-2">
                  {project.resources_available.map((resource, index) => (
                    <span key={index} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Time Commitment */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Commitment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{project.duration || 'Flexible'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time Commitment</p>
                  <p className="text-lg font-semibold text-gray-900">{project.time_commitment_hours} hrs/week</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Flexible'}
                  </p>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            {!user && (
              <div className="mt-8 text-center bg-blue-50 rounded-xl p-6">
                <p className="text-gray-700 mb-4">Want to apply to this project?</p>
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Sign Up to Apply
                </button>
              </div>
            )}

            {user && user.id === project.creator_id && (
              <div className="mt-8 text-center bg-green-50 rounded-xl p-6">
                <p className="text-green-700 font-medium">This is your project</p>
              </div>
            )}

            {user && canApply() && !showApplicationForm && (
              <div className="mt-8">
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg rounded-xl font-bold hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                >
                  {getApplicationButtonText()}
                </button>
              </div>
            )}

            {/* Application Form */}
            {showApplicationForm && (
              <div className="mt-8 bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {project.creator_type === 'student' ? 'Offer Your Mentorship' : 'Submit Your Application'}
                </h3>
                <form onSubmit={handleApplicationSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cover Letter *
                    </label>
                    <textarea
                      value={applicationData.cover_letter}
                      onChange={(e) => setApplicationData({ ...applicationData, cover_letter: e.target.value })}
                      rows={5}
                      required
                      placeholder="Explain why you're a great fit for this project..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Relevant Experience *
                    </label>
                    <textarea
                      value={applicationData.relevant_experience}
                      onChange={(e) => setApplicationData({ ...applicationData, relevant_experience: e.target.value })}
                      rows={4}
                      required
                      placeholder="Share your relevant skills and past projects..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Availability *
                    </label>
                    <input
                      type="text"
                      value={applicationData.availability}
                      onChange={(e) => setApplicationData({ ...applicationData, availability: e.target.value })}
                      required
                      placeholder="e.g., 10 hours/week, weekends only, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>

                  {message && (
                    <div className={`text-center font-medium ${
                      message.includes('Error') ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {message}
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
