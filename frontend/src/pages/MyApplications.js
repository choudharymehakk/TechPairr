import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getUserApplications, getProjectOwner } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const MyApplications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [projectOwners, setProjectOwners] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingOwners, setLoadingOwners] = useState({});
    useEffect(() => {
        if (user) {
            fetchApplications();
        }
    }, [user]);
    const fetchApplications = async () => {
        try {
            const response = await getUserApplications(user.id);
            const apps = response.data.data;
            setApplications(apps);
            // Fetch owner details for accepted applications
            const acceptedApps = apps.filter((app) => app.status === 'accepted');
            acceptedApps.forEach((app) => {
                fetchProjectOwner(app.project_id);
            });
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching applications:', error);
            setLoading(false);
        }
    };
    const fetchProjectOwner = async (projectId) => {
        setLoadingOwners(prev => ({ ...prev, [projectId]: true }));
        try {
            const response = await getProjectOwner(projectId);
            setProjectOwners(prev => ({ ...prev, [projectId]: response.data.data }));
        }
        catch (error) {
            console.error('Error fetching project owner:', error);
        }
        finally {
            setLoadingOwners(prev => ({ ...prev, [projectId]: false }));
        }
    };
    const getStatusColor = (status) => {
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
    const getStatusIcon = (status) => {
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
    const getApplicationTypeLabel = (type) => {
        return type === 'mentor_to_project' ? 'Mentorship Offer' : 'Join Request';
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Please login to view applications" }), _jsx("button", { onClick: () => navigate('/login'), className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold", children: "Login" })] }) }));
    }
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-lg", children: "Loading applications..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: [_jsx("nav", { className: "bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-2 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }), _jsx("span", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "Mentora" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors", children: "Dashboard" }), _jsx("button", { onClick: () => navigate('/browse-projects'), className: "px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200", children: "Browse Projects" })] })] }) }) }), _jsx("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4", children: "My Applications" }), _jsx("p", { className: "text-xl text-blue-100", children: "Track your submitted applications and their status" })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: applications.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-12 text-center", children: [_jsx("div", { className: "w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx("svg", { className: "w-12 h-12 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-3", children: "No Applications Yet" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Start applying to projects or offer your mentorship to get started!" }), _jsx("button", { onClick: () => navigate('/browse-projects'), className: "px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200", children: "Browse Projects" })] })) : (_jsx("div", { className: "space-y-6", children: applications.map((application) => {
                        const owner = projectOwners[application.project_id];
                        const ownerLoading = loadingOwners[application.project_id];
                        return (_jsx("div", { className: "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer", onClick: () => navigate(`/project/${application.project_id}`), children: application.project?.title || 'Project' }), _jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold", children: getApplicationTypeLabel(application.application_type) })] }), _jsxs("p", { className: "text-gray-600 text-sm mb-2", children: [application.project?.description?.substring(0, 150), "..."] }), application.project?.domain && (_jsx("span", { className: "inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium", children: application.project.domain }))] }), _jsx("div", { className: "ml-6", children: _jsxs("span", { className: `inline-flex items-center px-4 py-2 rounded-xl border-2 font-semibold text-sm ${getStatusColor(application.status)}`, children: [getStatusIcon(application.status), " ", application.status.toUpperCase()] }) })] }), _jsxs("div", { className: "bg-gray-50 rounded-xl p-4 mt-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Applied On" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: new Date(application.applied_at).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Your Availability" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: application.availability })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Cover Letter" }), _jsx("p", { className: "text-sm text-gray-700 line-clamp-2", children: application.cover_letter })] })] }), application.status === 'accepted' && (_jsxs("div", { className: "mt-4 bg-green-50 border-2 border-green-200 rounded-xl p-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx("svg", { className: "w-6 h-6 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("h4", { className: "text-lg font-bold text-green-900", children: "\uD83C\uDF89 Congratulations! Application Accepted" })] }), _jsx("p", { className: "text-sm text-green-800 mb-4", children: "Your application has been accepted! Here are the project owner's contact details:" }), ownerLoading ? (_jsxs("div", { className: "bg-white rounded-lg p-4 mb-4 text-center", children: [_jsx("div", { className: "animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Loading contact information..." })] })) : owner ? (_jsxs("div", { className: "bg-white rounded-lg p-4 mb-4 border border-green-200", children: [_jsx("p", { className: "text-xs font-semibold text-gray-700 mb-3", children: "Project Owner Contact Information:" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Name" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: owner.user.full_name }), _jsx("p", { className: "text-xs text-gray-600 capitalize", children: owner.user.user_type })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Email" }), _jsx("a", { href: `mailto:${owner.user.email}`, className: "text-sm font-medium text-blue-600 hover:text-blue-700", children: owner.user.email })] })] }), owner.profile?.phone && (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-purple-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Phone" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: owner.profile.phone })] })] })), (owner.profile?.department || owner.profile?.organization) && (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-orange-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Organization" }), _jsxs("p", { className: "text-sm font-medium text-gray-900", children: [owner.profile.department && `${owner.profile.department}, `, owner.profile.organization] })] })] }))] })] })) : (_jsx("div", { className: "bg-white rounded-lg p-4 mb-4 text-center", children: _jsx("p", { className: "text-sm text-gray-600", children: "Contact information unavailable" }) })), _jsxs("div", { className: "flex flex-wrap gap-3", children: [owner && (_jsxs("a", { href: `mailto:${owner.user.email}?subject=Regarding ${application.project?.title}`, className: "flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), _jsx("span", { children: "Send Email" })] })), _jsxs("button", { onClick: () => navigate(`/project/${application.project_id}`), className: "flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm", children: [_jsxs("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), _jsx("span", { children: "View Project" })] }), _jsxs("button", { onClick: () => navigate(`/active-projects`), className: "flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }), _jsx("span", { children: "Active Projects" })] })] })] })), application.status === 'rejected' && (_jsx("div", { className: "mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center", children: _jsx("p", { className: "text-red-700 font-medium", children: "This application was not accepted. Keep trying!" }) })), application.status !== 'accepted' && (_jsxs("div", { className: "flex items-center space-x-4 mt-4", children: [_jsx("button", { onClick: () => navigate(`/project/${application.project_id}`), className: "px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors", children: "View Project \u2192" }), application.status === 'pending' && (_jsx("button", { className: "px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors", children: "Withdraw Application" }))] }))] }) }, application.id));
                    }) })) })] }));
};
export default MyApplications;
