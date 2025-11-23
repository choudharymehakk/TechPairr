import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getUserProjects, getProjectStats, deleteProject } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const MyProjects = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [projectStats, setProjectStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);
    const fetchProjects = async () => {
        try {
            const response = await getUserProjects(user.id);
            const userProjects = response.data.data;
            setProjects(userProjects);
            // Fetch stats for each project
            userProjects.forEach((project) => {
                fetchProjectStats(project.id);
            });
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };
    const fetchProjectStats = async (projectId) => {
        try {
            const response = await getProjectStats(projectId);
            setProjectStats(prev => ({ ...prev, [projectId]: response.data.data }));
        }
        catch (error) {
            console.error('Error fetching project stats:', error);
        }
    };
    const handleDeleteProject = async (projectId, projectTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
            return;
        }
        setDeleting(projectId);
        try {
            await deleteProject(projectId);
            // Refresh projects list
            fetchProjects();
        }
        catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
        }
        finally {
            setDeleting(null);
        }
    };
    const getProjectTypeLabel = (type) => {
        switch (type) {
            case 'student_seeking_mentor': return 'Seeking Mentor';
            case 'faculty_led': return 'Faculty Research';
            case 'industry_led': return 'Industry Project';
            default: return type;
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-700 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Please login to view your projects" }), _jsx("button", { onClick: () => navigate('/login'), className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold", children: "Login" })] }) }));
    }
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-lg", children: "Loading your projects..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: [_jsx("nav", { className: "bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-2 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }), _jsx("span", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "Mentora" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors", children: "Dashboard" }), _jsx("button", { onClick: () => navigate('/create-project'), className: "px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200", children: "Create New Project" })] })] }) }) }), _jsx("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4", children: "My Projects" }), _jsx("p", { className: "text-xl text-blue-100", children: "Manage all your created projects" })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: projects.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-12 text-center", children: [_jsx("div", { className: "w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx("svg", { className: "w-12 h-12 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-3", children: "No Projects Yet" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Create your first project to get started!" }), _jsx("button", { onClick: () => navigate('/create-project'), className: "px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200", children: "Create Project" })] })) : (_jsx("div", { className: "grid grid-cols-1 gap-6", children: projects.map((project) => {
                        const stats = projectStats[project.id] || { total: 0, pending: 0, accepted: 0, rejected: 0 };
                        return (_jsx("div", { className: "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer", onClick: () => navigate(`/project/${project.id}`), children: project.title }), _jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold", children: getProjectTypeLabel(project.project_type) }), _jsx("span", { className: `px-3 py-1 rounded-full border-2 text-xs font-semibold ${getStatusColor(project.status)}`, children: project.status.toUpperCase() })] }), _jsx("p", { className: "text-gray-600 mb-3 line-clamp-2", children: project.description }), project.domain && (_jsx("span", { className: "inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium", children: project.domain }))] }) }), _jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: "Application Statistics" }), _jsxs("div", { className: "grid grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.total }), _jsx("p", { className: "text-xs text-gray-600", children: "Total" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-yellow-600", children: stats.pending }), _jsx("p", { className: "text-xs text-gray-600", children: "Pending" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.accepted }), _jsx("p", { className: "text-xs text-gray-600", children: "Accepted" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-red-600", children: stats.rejected }), _jsx("p", { className: "text-xs text-gray-600", children: "Rejected" })] })] })] }), _jsxs("div", { className: "flex items-center space-x-6 text-sm text-gray-600 mb-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), "Created ", new Date(project.created_at).toLocaleDateString()] }), _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), project.duration || 'Flexible'] }), _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }), project.student_count_needed, " needed"] })] }), _jsxs("div", { className: "flex flex-wrap gap-3 pt-4 border-t border-gray-200", children: [_jsxs("button", { onClick: () => navigate(`/project/${project.id}`), className: "flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm", children: [_jsxs("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), _jsx("span", { children: "View Details" })] }), stats.total > 0 && (_jsxs("button", { onClick: () => navigate('/received-applications'), className: "flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }) }), _jsxs("span", { children: ["Manage Applications (", stats.pending, ")"] })] })), _jsxs("button", { onClick: () => navigate(`/edit-project/${project.id}`), className: "flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }), _jsx("span", { children: "Edit" })] }), _jsxs("button", { onClick: () => handleDeleteProject(project.id, project.title), disabled: deleting === project.id, className: "flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), _jsx("span", { children: deleting === project.id ? 'Deleting...' : 'Delete' })] })] })] }) }, project.id));
                    }) })) })] }));
};
export default MyProjects;
