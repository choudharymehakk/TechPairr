import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, createApplication, checkExistingApplication } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
const ProjectDetails = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationData, setApplicationData] = useState({
        cover_letter: '',
        relevant_experience: '',
        availability: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [existingApplication, setExistingApplication] = useState(null);
    const [checkingApplication, setCheckingApplication] = useState(false);
    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);
    useEffect(() => {
        if (projectId && user && canApply()) {
            checkForExistingApplication();
        }
    }, [projectId, user, project]);
    const fetchProject = async () => {
        try {
            const response = await getProject(projectId);
            setProject(response.data.data);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching project:', error);
            setLoading(false);
        }
    };
    const checkForExistingApplication = async () => {
        setCheckingApplication(true);
        try {
            const response = await checkExistingApplication(projectId, user.id);
            if (response.data.exists) {
                setExistingApplication(response.data.application);
            }
        }
        catch (error) {
            console.error('Error checking application:', error);
        }
        finally {
            setCheckingApplication(false);
        }
    };
    const canApply = () => {
        if (!user || !project)
            return false;
        // User can't apply to their own project
        if (user.id === project.creator_id)
            return false;
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
        if (!project)
            return '';
        if (project.creator_type === 'student') {
            return 'Offer to Mentor';
        }
        else {
            return 'Apply to Join';
        }
    };
    const handleApplicationSubmit = async (e) => {
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
            console.log('Submitting application:', data);
            const response = await createApplication(data);
            console.log('Response:', response);
            if (response.data.status === 'success') {
                setMessage('Application submitted successfully!');
                setShowApplicationForm(false);
                // Refresh to show the "Already Applied" message
                checkForExistingApplication();
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            }
        }
        catch (error) {
            console.error('Full error:', error);
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || error.message || 'Error submitting application';
            setMessage(errorMessage + '. Please try again.');
        }
        finally {
            setSubmitting(false);
        }
    };
    const getCreatorIcon = (type) => {
        switch (type) {
            case 'student': return '🎓';
            case 'faculty': return '👨‍🏫';
            case 'industry': return '💼';
            default: return '👤';
        }
    };
    const getCreatorBadgeColor = (type) => {
        switch (type) {
            case 'student': return 'bg-blue-100 text-blue-700';
            case 'faculty': return 'bg-green-100 text-green-700';
            case 'industry': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    const getProjectTypeLabel = (type) => {
        switch (type) {
            case 'student_seeking_mentor': return 'Student Seeking Mentor';
            case 'faculty_led': return 'Faculty Research Project';
            case 'industry_led': return 'Industry Project';
            default: return type;
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-lg", children: "Loading project details..." })] }) }));
    }
    if (!project) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Project not found" }), _jsx("button", { onClick: () => navigate('/browse-projects'), className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold", children: "Back to Projects" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: [_jsx("nav", { className: "bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-2 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }), _jsx("span", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "Mentora" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => navigate('/browse-projects'), className: "px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors", children: "\u2190 Back to Projects" }), user && (_jsx("button", { onClick: () => navigate('/dashboard'), className: "px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200", children: "Dashboard" }))] })] }) }) }), _jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [message && (_jsx("div", { className: `mb-6 p-4 rounded-xl ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`, children: _jsx("p", { className: "font-medium text-center", children: message }) })), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl overflow-hidden mb-8", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("span", { className: `px-4 py-2 rounded-full text-sm font-semibold ${getCreatorBadgeColor(project.creator_type)} bg-white`, children: [getCreatorIcon(project.creator_type), " ", getProjectTypeLabel(project.project_type)] }), _jsx("span", { className: "px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold", children: project.status })] }), _jsx("h1", { className: "text-4xl font-bold mb-4", children: project.title }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [project.domain && (_jsxs("span", { className: "flex items-center", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" }) }), project.domain] })), _jsxs("span", { className: "flex items-center", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), project.duration || 'Flexible'] }), _jsxs("span", { className: "flex items-center", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }), project.student_count_needed, " collaborators needed"] })] })] }), _jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "About This Project" }), _jsx("p", { className: "text-gray-700 text-lg leading-relaxed", children: project.description })] }), project.goals && (_jsxs("div", { className: "mb-8", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-900 mb-3 flex items-center", children: [_jsx("svg", { className: "w-6 h-6 mr-2 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), "Project Goals"] }), _jsx("p", { className: "text-gray-700 whitespace-pre-line", children: project.goals })] })), project.deliverables && (_jsxs("div", { className: "mb-8", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-900 mb-3 flex items-center", children: [_jsx("svg", { className: "w-6 h-6 mr-2 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), "Expected Deliverables"] }), _jsx("p", { className: "text-gray-700 whitespace-pre-line", children: project.deliverables })] })), project.required_skills && project.required_skills.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: "Required Skills" }), _jsx("div", { className: "flex flex-wrap gap-2", children: project.required_skills.map((skill, index) => (_jsx("span", { className: "px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium", children: skill }, index))) })] })), project.required_expertise && project.required_expertise.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: "Required Expertise" }), _jsx("div", { className: "flex flex-wrap gap-2", children: project.required_expertise.map((expertise, index) => (_jsx("span", { className: "px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium", children: expertise }, index))) })] })), project.resources_available && project.resources_available.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: "Resources Available" }), _jsx("div", { className: "flex flex-wrap gap-2", children: project.resources_available.map((resource, index) => (_jsx("span", { className: "px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium", children: resource }, index))) })] })), _jsxs("div", { className: "bg-gray-50 rounded-xl p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: "Commitment Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Duration" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: project.duration || 'Flexible' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Time Commitment" }), _jsxs("p", { className: "text-lg font-semibold text-gray-900", children: [project.time_commitment_hours, " hrs/week"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Start Date" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Flexible' })] })] })] }), !user && (_jsxs("div", { className: "mt-8 text-center bg-blue-50 rounded-xl p-6", children: [_jsx("p", { className: "text-gray-700 mb-4", children: "Want to apply to this project?" }), _jsx("button", { onClick: () => navigate('/register'), className: "px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200", children: "Sign Up to Apply" })] })), user && user.id === project.creator_id && (_jsxs("div", { className: "mt-8 text-center bg-green-50 rounded-xl p-6", children: [_jsx("p", { className: "text-green-700 font-medium mb-3", children: "This is your project" }), _jsx("button", { onClick: () => navigate('/received-applications'), className: "px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors", children: "Manage Applications" })] })), user && canApply() && existingApplication && (_jsxs("div", { className: "mt-8", children: [existingApplication.status === 'pending' && (_jsxs("div", { className: "bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2 mb-3", children: [_jsx("svg", { className: "w-8 h-8 text-yellow-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("h4", { className: "text-xl font-bold text-yellow-900", children: "\u23F3 Application Pending" })] }), _jsx("p", { className: "text-yellow-800 mb-4", children: "You've already applied to this project. The project owner is reviewing your application." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [_jsx("button", { onClick: () => navigate('/my-applications'), className: "px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors", children: "View My Applications" }), _jsx("button", { onClick: () => navigate('/browse-projects'), className: "px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors", children: "Browse Other Projects" })] })] })), existingApplication.status === 'accepted' && (_jsxs("div", { className: "bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2 mb-3", children: [_jsx("svg", { className: "w-8 h-8 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("h4", { className: "text-xl font-bold text-green-900", children: "\u2705 Application Accepted!" })] }), _jsx("p", { className: "text-green-800 mb-4", children: "Congratulations! Your application has been accepted. You're now part of this project." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [_jsx("button", { onClick: () => navigate('/my-applications'), className: "px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors", children: "View Contact Details" }), _jsx("button", { onClick: () => navigate('/active-projects'), className: "px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors", children: "View Active Projects" })] })] })), existingApplication.status === 'rejected' && (_jsxs("div", { className: "bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2 mb-3", children: [_jsx("svg", { className: "w-8 h-8 text-red-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("h4", { className: "text-xl font-bold text-red-900", children: "\u274C Application Not Accepted" })] }), _jsx("p", { className: "text-red-800 mb-4", children: "Unfortunately, your application was not accepted for this project. Don't give up - keep exploring other opportunities!" }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [_jsx("button", { onClick: () => navigate('/browse-projects'), className: "px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors", children: "Find Other Projects" }), _jsx("button", { onClick: () => navigate('/my-applications'), className: "px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors", children: "View My Applications" })] })] }))] })), user && canApply() && !existingApplication && !showApplicationForm && !checkingApplication && (_jsx("div", { className: "mt-8", children: _jsx("button", { onClick: () => setShowApplicationForm(true), className: "w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg rounded-xl font-bold hover:shadow-2xl transition-all duration-200 transform hover:scale-105", children: getApplicationButtonText() }) })), checkingApplication && (_jsxs("div", { className: "mt-8 text-center bg-gray-50 rounded-xl p-6", children: [_jsx("div", { className: "animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" }), _jsx("p", { className: "text-gray-600", children: "Checking application status..." })] })), showApplicationForm && (_jsxs("div", { className: "mt-8 bg-gray-50 rounded-2xl p-8", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-6", children: project.creator_type === 'student' ? 'Offer Your Mentorship' : 'Submit Your Application' }), _jsxs("form", { onSubmit: handleApplicationSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Cover Letter *" }), _jsx("textarea", { value: applicationData.cover_letter, onChange: (e) => setApplicationData({ ...applicationData, cover_letter: e.target.value }), rows: 5, required: true, placeholder: "Explain why you're a great fit for this project...", className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Relevant Experience *" }), _jsx("textarea", { value: applicationData.relevant_experience, onChange: (e) => setApplicationData({ ...applicationData, relevant_experience: e.target.value }), rows: 4, required: true, placeholder: "Share your relevant skills and past projects...", className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Availability *" }), _jsx("input", { type: "text", value: applicationData.availability, onChange: (e) => setApplicationData({ ...applicationData, availability: e.target.value }), required: true, placeholder: "e.g., 10 hours/week, weekends only, etc.", className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { type: "submit", disabled: submitting, className: "flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50", children: submitting ? 'Submitting...' : 'Submit Application' }), _jsx("button", { type: "button", onClick: () => setShowApplicationForm(false), className: "px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200", children: "Cancel" })] })] })] }))] })] })] })] }));
};
export default ProjectDetails;
