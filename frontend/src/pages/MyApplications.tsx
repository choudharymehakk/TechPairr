import React, { useState, useEffect } from 'react';
import { getUserApplications, getProjectOwner } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  project_id: string;
  application_type: string;
  cover_letter: string;
  relevant_experience: string;
  availability: string;
  status: string;
  applied_at: string;
  project?: {
    title: string;
    description: string;
    creator_type: string;
    domain: string;
  };
}

interface ProjectOwner {
  user: {
    full_name: string;
    email: string;
    user_type: string;
  };
  profile: {
    phone?: string;
    department?: string;
    organization?: string;
    position?: string;
    bio?: string;
  };
}

const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [projectOwners, setProjectOwners] = useState<{ [key: string]: ProjectOwner }>({});
  const [loading, setLoading] = useState(true);
  const [loadingOwners, setLoadingOwners] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await getUserApplications(user!.id);
      const apps = response.data.data;
      setApplications(apps);
      
      // Fetch owner details for accepted applications
      const acceptedApps = apps.filter((app: Application) => app.status === 'accepted');
      acceptedApps.forEach((app: Application) => {
        fetchProjectOwner(app.project_id);
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const fetchProjectOwner = async (projectId: string) => {
    setLoadingOwners(prev => ({ ...prev, [projectId]: true }));
    try {
      const response = await getProjectOwner(projectId);
      setProjectOwners(prev => ({ ...prev, [projectId]: response.data.data }));
    } catch (error) {
      console.error('Error fetching project owner:', error);
    } finally {
      setLoadingOwners(prev => ({ ...prev, [projectId]: false }));
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
      case 'withdrawn':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'withdrawn':
        return '↩️';
      default:
        return '📋';
    }
  };

  const getApplicationTypeLabel = (type: string) => {
    return type === 'mentor_to_project' ? 'Mentorship Offer' : 'Join Request';
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
                onClick={() => navigate('/browse-projects')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Applications</h1>
          <p className="text-xl text-blue-100">
            Track your submitted applications and their status
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">
              Start applying to projects or offer your mentorship to get started!
            </p>
            <button
              onClick={() => navigate('/browse-projects')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Browse Projects
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => {
              const owner = projectOwners[application.project_id];
              const ownerLoading = loadingOwners[application.project_id];

              return (
                <div
                  key={application.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 
                            className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() => navigate(`/project/${application.project_id}`)}
                          >
                            {application.project?.title || 'Project'}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {getApplicationTypeLabel(application.application_type)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {application.project?.description?.substring(0, 150)}...
                        </p>
                        {application.project?.domain && (
                          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                            {application.project.domain}
                          </span>
                        )}
                      </div>
                      <div className="ml-6">
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl border-2 font-semibold text-sm ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)} {application.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="bg-gray-50 rounded-xl p-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Applied On</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(application.applied_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Your Availability</p>
                          <p className="text-sm font-medium text-gray-900">{application.availability}</p>
                        </div>
                      </div>

                      {/* Cover Letter Preview */}
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-1">Cover Letter</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{application.cover_letter}</p>
                      </div>
                    </div>

                    {/* Accepted Application - Contact Info */}
                    {application.status === 'accepted' && (
                      <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h4 className="text-lg font-bold text-green-900">🎉 Congratulations! Application Accepted</h4>
                        </div>
                        
                        <p className="text-sm text-green-800 mb-4">
                          Your application has been accepted! Here are the project owner's contact details:
                        </p>

                        {ownerLoading ? (
                          <div className="bg-white rounded-lg p-4 mb-4 text-center">
                            <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">Loading contact information...</p>
                          </div>
                        ) : owner ? (
                          <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                            <p className="text-xs font-semibold text-gray-700 mb-3">Project Owner Contact Information:</p>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Name</p>
                                  <p className="text-sm font-semibold text-gray-900">{owner.user.full_name}</p>
                                  <p className="text-xs text-gray-600 capitalize">{owner.user.user_type}</p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Email</p>
                                  <a href={`mailto:${owner.user.email}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                    {owner.user.email}
                                  </a>
                                </div>
                              </div>

                              {owner.profile?.phone && (
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm font-medium text-gray-900">{owner.profile.phone}</p>
                                  </div>
                                </div>
                              )}

                              {(owner.profile?.department || owner.profile?.organization) && (
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Organization</p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {owner.profile.department && `${owner.profile.department}, `}
                                      {owner.profile.organization}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-4 mb-4 text-center">
                            <p className="text-sm text-gray-600">Contact information unavailable</p>
                          </div>
                        )}

                        {/* Quick Contact Buttons */}
                        <div className="flex flex-wrap gap-3">
                          {owner && (
                            <a
                              href={`mailto:${owner.user.email}?subject=Regarding ${application.project?.title}`}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>Send Email</span>
                            </a>
                          )}
                          
                          <button
                            onClick={() => navigate(`/project/${application.project_id}`)}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>View Project</span>
                          </button>
                          
                          <button
                            onClick={() => navigate(`/active-projects`)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Active Projects</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rejected Status */}
                    {application.status === 'rejected' && (
                      <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                        <p className="text-red-700 font-medium">This application was not accepted. Keep trying!</p>
                      </div>
                    )}

                    {/* Action Buttons for Pending/Rejected */}
                    {application.status !== 'accepted' && (
                      <div className="flex items-center space-x-4 mt-4">
                        <button
                          onClick={() => navigate(`/project/${application.project_id}`)}
                          className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          View Project →
                        </button>
                        {application.status === 'pending' && (
                          <button
                            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                          >
                            Withdraw Application
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
