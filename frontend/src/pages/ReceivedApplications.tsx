import React, { useState, useEffect } from 'react';
import { getUserProjects, getProjectApplications, updateApplicationStatus } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  creator_type: string;
}

interface Application {
  id: string;
  project_id: string;
  applicant_id: string;
  applicant_type: string;
  application_type: string;
  cover_letter: string;
  relevant_experience: string;
  availability: string;
  status: string;
  applied_at: string;
  applicant?: {
    full_name: string;
    email: string;
    user_type: string;
  };
  applicant_profile?: {
    skills?: string[];
    interests?: string[];
    expertise_areas?: string[];
    bio?: string;
    phone?: string;
    university?: string;
    department?: string;
    organization?: string;
  };
}

const ReceivedApplications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProjects();
    }
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      fetchApplications(selectedProject);
    }
  }, [selectedProject]);

  const fetchUserProjects = async () => {
    try {
      const response = await getUserProjects(user!.id);
      const userProjects = response.data.data;
      setProjects(userProjects);
      
      // Auto-select first project
      if (userProjects.length > 0) {
        setSelectedProject(userProjects[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const fetchApplications = async (projectId: string) => {
    try {
      const response = await getProjectApplications(projectId);
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    setUpdating(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      // Refresh applications
      fetchApplications(selectedProject);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getApplicantIcon = (type: string) => {
    switch (type) {
      case 'student': return '🎓';
      case 'faculty': return '👨‍🏫';
      case 'industry': return '💼';
      default: return '👤';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view applications</h2>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading applications...</p>
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
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/my-applications')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                My Applications
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Received Applications</h1>
          <p className="text-xl text-blue-100">
            Review and manage applications for your projects
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Projects Yet</h3>
            <p className="text-gray-600 mb-6">
              Create a project first to receive applications
            </p>
            <button
              onClick={() => navigate('/create-project')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Create Project
            </button>
          </div>
        ) : (
          <>
            {/* Project Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Applications List */}
            {applications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
                <p className="text-gray-600">
                  When users apply to this project, you'll see them here
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Applicant Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-3xl">
                            {getApplicantIcon(application.applicant_type)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {application.applicant?.full_name}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {application.applicant_type}
                            </p>
                            <p className="text-sm text-gray-500">
                              {application.applicant?.email}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-4 py-2 rounded-xl border-2 font-semibold text-sm ${getStatusColor(application.status)}`}>
                            {application.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="space-y-4">
                        {/* Cover Letter */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Cover Letter</p>
                          <p className="text-sm text-gray-800">{application.cover_letter}</p>
                        </div>

                        {/* Relevant Experience */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Relevant Experience</p>
                          <p className="text-sm text-gray-800">{application.relevant_experience}</p>
                        </div>

                        {/* Applicant Profile Info */}
                        {application.applicant_profile && (
                          <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-gray-700 mb-3">Skills & Expertise</p>
                            <div className="flex flex-wrap gap-2">
                              {application.applicant_profile.skills?.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                              {application.applicant_profile.expertise_areas?.map((expertise, idx) => (
                                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                                  {expertise}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Applied:</span>{' '}
                            {new Date(application.applied_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div>
                            <span className="font-medium">Availability:</span> {application.availability}
                          </div>
                        </div>
                      </div>

                      {/* ACCEPTED - Show Full Contact Card */}
                      {application.status === 'accepted' && (
                        <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h4 className="text-lg font-bold text-green-900">✅ Application Accepted - Contact Details</h4>
                          </div>

                          <p className="text-sm text-green-800 mb-4">
                            You've accepted this application. Here are the complete contact details:
                          </p>

                          <div className="bg-white rounded-lg p-5 border border-green-200 mb-4">
                            <div className="space-y-4">
                              {/* Name and Role */}
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Full Name</p>
                                  <p className="text-base font-bold text-gray-900">{application.applicant?.full_name}</p>
                                  <p className="text-xs text-gray-600 capitalize mt-1">
                                    {application.applicant_type} • {application.application_type === 'mentor_to_project' ? 'Offering Mentorship' : 'Joining as Collaborator'}
                                  </p>
                                </div>
                              </div>

                              {/* Email */}
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500">Email Address</p>
                                  <a 
                                    href={`mailto:${application.applicant?.email}`}
                                    className="text-base font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    {application.applicant?.email}
                                  </a>
                                </div>
                              </div>

                              {/* Phone (if available) */}
                              {application.applicant_profile?.phone && (
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Phone Number</p>
                                    <p className="text-base font-semibold text-gray-900">{application.applicant_profile.phone}</p>
                                  </div>
                                </div>
                              )}

                              {/* University/Organization (if available) */}
                              {(application.applicant_profile?.university || application.applicant_profile?.department || application.applicant_profile?.organization) && (
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Affiliation</p>
                                    <p className="text-base font-semibold text-gray-900">
                                      {application.applicant_profile.university || application.applicant_profile.organization}
                                      {application.applicant_profile.department && `, ${application.applicant_profile.department}`}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Availability Reminder */}
                              <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-3 mt-4">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <p className="text-xs text-blue-700 font-medium">Committed Availability</p>
                                  <p className="text-sm text-blue-900 font-semibold">{application.availability}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Contact Actions */}
                          <div className="flex flex-wrap gap-3">
                            <a
                              href={`mailto:${application.applicant?.email}?subject=Welcome to ${projects.find(p => p.id === selectedProject)?.title || 'the project'}`}
                              className="flex items-center space-x-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>Send Welcome Email</span>
                            </a>

                            {application.applicant_profile?.phone && (
                              <a
                                href={`tel:${application.applicant_profile.phone}`}
                                className="flex items-center space-x-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Call</span>
                              </a>
                            )}

                            <button
                              onClick={() => {
                                const message = `Hi ${application.applicant?.full_name}, your application to join the project has been accepted! Looking forward to working together.`;
                                const whatsappUrl = application.applicant_profile?.phone 
                                  ? `https://wa.me/${application.applicant_profile.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
                                  : `https://wa.me/?text=${encodeURIComponent(message)}`;
                                window.open(whatsappUrl, '_blank');
                              }}
                              className="flex items-center space-x-2 px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm shadow-md hover:shadow-lg"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons for Pending */}
                      {application.status === 'pending' && (
                        <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-gray-200">
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'accepted')}
                            disabled={updating === application.id}
                            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                          >
                            {updating === application.id ? 'Processing...' : '✅ Accept'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            disabled={updating === application.id}
                            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                          >
                            {updating === application.id ? 'Processing...' : '❌ Reject'}
                          </button>
                        </div>
                      )}

                      {/* Rejected Status */}
                      {application.status === 'rejected' && (
                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                          <p className="text-red-600 font-medium">❌ Application Rejected</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReceivedApplications;
