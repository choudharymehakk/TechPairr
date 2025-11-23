import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getProjects } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const BrowseProjects = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('all');
    const [selectedCreatorType, setSelectedCreatorType] = useState('all');
    useEffect(() => {
        fetchProjects();
    }, []);
    useEffect(() => {
        filterProjects();
    }, [searchTerm, selectedDomain, selectedCreatorType, projects]);
    const fetchProjects = async () => {
        try {
            const response = await getProjects({ status: 'open' });
            const allProjects = response.data.data;
            // For guests, show only 6 projects
            if (!user) {
                setProjects(allProjects.slice(0, 6));
            }
            else {
                setProjects(allProjects);
            }
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };
    const filterProjects = () => {
        let filtered = projects;
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(project => project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.domain?.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // Domain filter
        if (selectedDomain !== 'all') {
            filtered = filtered.filter(project => project.domain === selectedDomain);
        }
        // Creator type filter
        if (selectedCreatorType !== 'all') {
            filtered = filtered.filter(project => project.creator_type === selectedCreatorType);
        }
        setFilteredProjects(filtered);
    };
    const getUniqueValues = (key) => {
        const values = projects.map(p => p[key]).filter(Boolean);
        return Array.from(new Set(values));
    };
    const getProjectTypeLabel = (type) => {
        switch (type) {
            case 'student_seeking_mentor':
                return 'Student Seeking Mentor';
            case 'faculty_led':
                return 'Faculty Research';
            case 'industry_led':
                return 'Industry Project';
            default:
                return type;
        }
    };
    const getCreatorIcon = (type) => {
        switch (type) {
            case 'student':
                return '🎓';
            case 'faculty':
                return '👨‍🏫';
            case 'industry':
                return '💼';
            default:
                return '👤';
        }
    };
    const getCreatorBadgeColor = (type) => {
        switch (type) {
            case 'student':
                return 'bg-blue-100 text-blue-700';
            case 'faculty':
                return 'bg-green-100 text-green-700';
            case 'industry':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-lg", children: "Loading projects..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: [_jsx("nav", { className: "bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-2 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }), _jsx("span", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "Mentora" })] }), _jsx("div", { className: "flex items-center space-x-4", children: user ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors", children: "Dashboard" }), _jsx("button", { onClick: () => navigate('/create-project'), className: "px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200", children: "Create Project" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => navigate('/login'), className: "px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors", children: "Login" }), _jsx("button", { onClick: () => navigate('/register'), className: "px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200", children: "Sign Up" })] })) })] }) }) }), _jsx("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4", children: "Explore Projects" }), _jsx("p", { className: "text-xl text-blue-100", children: user
                                ? `Discover exciting opportunities to collaborate and learn`
                                : `Sign up to see all ${projects.length}+ projects and apply` })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 mb-8", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("div", { className: "md:col-span-2", children: _jsxs("div", { className: "relative", children: [_jsx("svg", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search projects...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }) }), _jsx("div", { children: _jsxs("select", { value: selectedDomain, onChange: (e) => setSelectedDomain(e.target.value), className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", children: [_jsx("option", { value: "all", children: "All Domains" }), getUniqueValues('domain').map(domain => (_jsx("option", { value: domain, children: domain }, String(domain))))] }) }), _jsx("div", { children: _jsxs("select", { value: selectedCreatorType, onChange: (e) => setSelectedCreatorType(e.target.value), className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: "student", children: "Student Projects" }), _jsx("option", { value: "faculty", children: "Faculty Projects" }), _jsx("option", { value: "industry", children: "Industry Projects" })] }) })] }) }), !user && (_jsx("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-6 h-6 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Viewing Limited Preview" }), _jsx("p", { className: "text-gray-600", children: "Sign up to see all projects and apply to opportunities" })] })] }), _jsx("button", { onClick: () => navigate('/register'), className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 whitespace-nowrap", children: "Sign Up Free" })] }) })), _jsx("div", { className: "flex justify-between items-center mb-6", children: _jsxs("p", { className: "text-gray-600", children: ["Showing ", _jsx("span", { className: "font-semibold text-gray-900", children: filteredProjects.length }), " projects"] }) }), filteredProjects.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: filteredProjects.map((project) => (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 overflow-hidden cursor-pointer transform hover:-translate-y-1", onClick: () => user ? navigate(`/project/${project.id}`) : navigate('/register'), children: [_jsx("div", { className: "bg-gradient-to-r from-blue-500 to-indigo-500 p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${getCreatorBadgeColor(project.creator_type)}`, children: [getCreatorIcon(project.creator_type), " ", getProjectTypeLabel(project.project_type)] }), _jsx("span", { className: "px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white", children: project.status })] }) }), _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2 line-clamp-2", children: project.title }), _jsx("p", { className: "text-gray-600 text-sm mb-4 line-clamp-3", children: project.description }), project.domain && (_jsx("div", { className: "mb-4", children: _jsxs("span", { className: "inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium", children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" }) }), project.domain] }) })), project.required_skills && project.required_skills.length > 0 && (_jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-2", children: [project.required_skills.slice(0, 3).map((skill, index) => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs", children: skill }, index))), project.required_skills.length > 3 && (_jsxs("span", { className: "px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs", children: ["+", project.required_skills.length - 3, " more"] }))] }) })), _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), project.duration || 'Flexible'] }), _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }), project.student_count_needed, " needed"] })] })] })] }, project.id))) })) : (_jsxs("div", { className: "text-center py-16 bg-white rounded-2xl shadow-lg", children: [_jsx("svg", { className: "w-16 h-16 text-gray-400 mx-auto mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No projects found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your filters or search terms" })] })), !user && (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-8 text-center", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-3", children: "Want to See More?" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Join Mentora to access all projects and start collaborating" }), _jsx("button", { onClick: () => navigate('/register'), className: "px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg rounded-xl font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105", children: "Sign Up Free" })] }))] })] }));
};
export default BrowseProjects;
