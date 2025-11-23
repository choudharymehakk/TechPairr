import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getUserApplications, getUserProjects } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const ActiveProjects = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeProjects, setActiveProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            fetchActiveProjects();
        }
    }, [user]);
    const fetchActiveProjects = async () => {
        try {
            // Get projects user owns
            const ownedResponse = await getUserProjects(user.id);
            const owned = ownedResponse.data.data.map((p) => ({
                ...p,
                role: 'owner'
            }));
            // Get accepted applications (projects user is collaborating on)
            const appsResponse = await getUserApplications(user.id);
            const acceptedApps = appsResponse.data.data.filter((app) => app.status === 'accepted');
            // Extract projects from accepted applications
            const collaborating = acceptedApps.map((app) => ({
                id: app.project_id,
                title: app.project?.title || 'Project',
                description: app.project?.description || '',
                domain: app.project?.domain || '',
                status: 'active',
                role: 'collaborator',
                project_type: app.application_type
            }));
            setActiveProjects([...owned, ...collaborating]);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching active projects:', error);
            setLoading(false);
        }
    };
    const getRoleColor = (role) => {
        return role === 'owner'
            ? 'bg-purple-100 text-purple-700 border-purple-200'
            : 'bg-green-100 text-green-700 border-green-200';
    };
    const getRoleIcon = (role) => {
        return role === 'owner' ? '👑' : '🤝';
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Please login to view projects" }), _jsx("button", { onClick: () => navigate('/login'), className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold", children: "Login" })] }) }));
    }
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-lg", children: "Loading your projects..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: [_jsx("nav", { className: "bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-2 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }), _jsx("span", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "Mentora" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors", children: "Dashboard" }), _jsx("button", { onClick: () => navigate('/browse-projects'), className: "px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200", children: "Browse Projects" })] })] }) }) }), _jsx("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4", children: "Active Projects" }), _jsx("p", { className: "text-xl text-blue-100", children: "Projects you own or are collaborating on" })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: activeProjects.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-12 text-center", children: [_jsx("div", { className: "w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx("svg", { className: "w-12 h-12 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-3", children: "No Active Projects" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Create a project or apply to existing ones to get started!" }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx("button", { onClick: () => navigate('/create-project'), className: "px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200", children: "Create Project" }), _jsx("button", { onClick: () => navigate('/browse-projects'), className: "px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:border-blue-600 transition-all duration-200", children: "Browse Projects" })] })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: activeProjects.map((project) => (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer", onClick: () => navigate(`/project/${project.id}`), children: [_jsx("div", { className: "bg-gradient-to-r from-blue-500 to-indigo-500 p-4", children: _jsx("div", { className: "flex items-center justify-between mb-2", children: _jsxs("span", { className: `px-3 py-1 rounded-full border-2 font-semibold text-xs bg-white ${getRoleColor(project.role)}`, children: [getRoleIcon(project.role), " ", project.role === 'owner' ? 'Project Owner' : 'Collaborator'] }) }) }), _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2 line-clamp-2", children: project.title }), _jsx("p", { className: "text-gray-600 text-sm mb-4 line-clamp-3", children: project.description }), project.domain && (_jsx("span", { className: "inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium mb-4", children: project.domain })), _jsxs("div", { className: "flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200", children: [_jsx("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    navigate(`/project/${project.id}`);
                                                }, className: "flex-1 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors", children: "View Details \u2192" }), project.role === 'owner' && (_jsx("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    navigate(`/received-applications`);
                                                }, className: "flex-1 py-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors", children: "Manage Team" }))] })] })] }, project.id))) })) })] }));
};
export default ActiveProjects;
