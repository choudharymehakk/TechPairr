import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, TrendingUp, Filter } from 'lucide-react';
import { getExploreMatches } from '../services/api';
import MentorshipRequestModal from '../components/MentorshipRequestModal';
export default function ExplorePage() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // Filter state
    const [filters, setFilters] = useState({
        type: 'all', // 'all', 'mentors', 'students', 'projects'
        minMatch: 0,
        searchQuery: ''
    });
    const [filteredResults, setFilteredResults] = useState([]);
    // Mentorship modal state
    const [mentorshipModal, setMentorshipModal] = useState({
        isOpen: false,
        recipientId: '',
        recipientName: '',
        recipientType: 'faculty',
        requestType: 'student_to_mentor'
    });
    useEffect(() => {
        fetchMatches();
    }, []);
    // Filter results whenever filters or results change
    useEffect(() => {
        let filtered = [...results];
        // Filter by type
        if (filters.type !== 'all') {
            if (filters.type === 'mentors') {
                filtered = filtered.filter(r => r.type === 'faculty' || r.type === 'industry');
            }
            else if (filters.type === 'students') {
                filtered = filtered.filter(r => r.type === 'student');
            }
            else if (filters.type === 'projects') {
                filtered = filtered.filter(r => r.type === 'project');
            }
        }
        // Filter by minimum match percentage
        if (filters.minMatch > 0) {
            filtered = filtered.filter(r => r.match >= filters.minMatch);
        }
        // Filter by search query (name, skills, etc.)
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(r => {
                if (r.type === 'project') {
                    return r.project?.title?.toLowerCase().includes(query) ||
                        r.project?.description?.toLowerCase().includes(query) ||
                        r.creator?.full_name?.toLowerCase().includes(query);
                }
                else {
                    return r.user?.full_name?.toLowerCase().includes(query) ||
                        r.profile?.bio?.toLowerCase().includes(query) ||
                        r.profile?.skills?.some((s) => s.toLowerCase().includes(query)) ||
                        r.profile?.research_areas?.some((a) => a.toLowerCase().includes(query)) ||
                        r.profile?.expertise?.some((e) => e.toLowerCase().includes(query)) ||
                        r.profile?.mentoring_focus?.some((f) => f.toLowerCase().includes(query));
                }
            });
        }
        setFilteredResults(filtered);
    }, [results, filters]);
    const fetchMatches = async () => {
        try {
            setLoading(true);
            setError('');
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setError('Please log in to see matches');
                return;
            }
            const userData = JSON.parse(userStr);
            if (!userData.id) {
                setError('User ID not found. Please log in again.');
                return;
            }
            const response = await getExploreMatches(userData.id);
            if (response.data.status === 'success') {
                setResults(response.data.results);
            }
            else {
                setError(response.data.message || 'Failed to load matches');
            }
        }
        catch (err) {
            console.error('Error fetching matches:', err);
            setError(err.response?.data?.message || 'Failed to load matches. Make sure backend is running.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleViewDetails = (result) => {
        if (result.type === 'project') {
            navigate(`/project/${result.project?.id}`);
        }
        else {
            const profileType = result.type;
            const userId = result.profile?.user_id;
            navigate(`/profile/${profileType}/${userId}`);
        }
    };
    const handleApplyToProject = (projectId) => {
        navigate(`/project/${projectId}`);
    };
    const handleMentorshipAction = (result) => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const isStudentRequesting = userData.user_type === 'student' && result.type !== 'student';
        setMentorshipModal({
            isOpen: true,
            recipientId: result.profile?.user_id || '',
            recipientName: result.user?.full_name || '',
            recipientType: result.type,
            requestType: isStudentRequesting ? 'student_to_mentor' : 'mentor_to_student'
        });
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Finding your matches..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center text-red-600", children: [_jsx("p", { className: "text-lg font-semibold mb-2", children: error }), _jsx("button", { onClick: fetchMatches, className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Try Again" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 py-8", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(Search, { className: "w-8 h-8 text-blue-600" }), "Explore Matches"] }), _jsx("p", { className: "mt-2 text-gray-600", children: "Discover mentors, students, and projects based on your profile" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Filter, { className: "w-5 h-5 text-gray-600" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Filters" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Search" }), _jsx("input", { type: "text", value: filters.searchQuery, onChange: (e) => setFilters({ ...filters, searchQuery: e.target.value }), placeholder: "Name, skills, interests...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Show" }), _jsxs("select", { value: filters.type, onChange: (e) => setFilters({ ...filters, type: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "all", children: "All Results" }), _jsx("option", { value: "mentors", children: "Mentors Only" }), _jsx("option", { value: "students", children: "Students Only" }), _jsx("option", { value: "projects", children: "Projects Only" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Minimum Match: ", filters.minMatch, "%"] }), _jsx("input", { type: "range", min: "0", max: "100", step: "5", value: filters.minMatch, onChange: (e) => setFilters({ ...filters, minMatch: parseInt(e.target.value) }), className: "w-full" })] })] }), (filters.type !== 'all' || filters.minMatch > 0 || filters.searchQuery) && (_jsx("button", { onClick: () => setFilters({ type: 'all', minMatch: 0, searchQuery: '' }), className: "mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium", children: "Clear all filters" }))] }), _jsxs("div", { className: "mb-6 flex items-center gap-2 text-gray-700", children: [_jsx(Users, { className: "w-5 h-5" }), _jsxs("span", { className: "font-medium", children: [filteredResults.length, " matches found"] })] }), filteredResults.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg shadow", children: [_jsx(Users, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No matches found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your filters or updating your profile" })] })) : (_jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: filteredResults.map((result, index) => (_jsxs("div", { className: "bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden", children: [result.type !== 'project' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: `px-4 py-3 flex items-center justify-between ${result.type === 'student'
                                                ? 'bg-gradient-to-r from-indigo-500 to-blue-600'
                                                : 'bg-gradient-to-r from-blue-500 to-purple-600'}`, children: [_jsxs("div", { children: [_jsx("span", { className: "text-white font-semibold block", children: result.user?.full_name }), _jsx("span", { className: "text-white/80 text-xs", children: result.type === 'faculty' ? '👨‍🏫 Faculty' :
                                                                result.type === 'industry' ? '💼 Industry Mentor' :
                                                                    '🎓 Student' })] }), _jsxs("div", { className: "flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-white" }), _jsxs("span", { className: "text-white font-bold", children: [result.match, "%"] })] })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: result.type === 'faculty'
                                                                ? result.profile?.designation
                                                                : result.type === 'industry'
                                                                    ? result.profile?.position
                                                                    : `Year ${result.profile?.year_of_study} - ${result.profile?.department}` }), _jsx("p", { className: "text-sm text-gray-500", children: result.type === 'faculty'
                                                                ? result.profile?.department
                                                                : result.type === 'industry'
                                                                    ? result.profile?.company
                                                                    : `CGPA: ${result.profile?.cgpa || 'N/A'}` })] }), _jsx("p", { className: "text-sm text-gray-700 mb-4 line-clamp-3", children: result.profile?.bio || 'No bio available' }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900 mb-2", children: "Why you matched:" }), _jsx("div", { className: "space-y-1", children: result.why.map((reason, i) => (_jsxs("p", { className: "text-sm text-green-600 flex items-start gap-2", children: [_jsx("span", { className: "text-green-500", children: "\u2713" }), _jsx("span", { children: reason })] }, i))) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900 mb-2", children: result.type === 'faculty' ? 'Research Areas:' :
                                                                result.type === 'industry' ? 'Focus Areas:' :
                                                                    'Skills:' }), _jsx("div", { className: "flex flex-wrap gap-2", children: (result.type === 'faculty'
                                                                ? result.profile?.research_areas
                                                                : result.type === 'industry'
                                                                    ? result.profile?.mentoring_focus
                                                                    : result.profile?.skills)?.slice(0, 3).map((item, i) => (_jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full", children: item }, i))) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => handleViewDetails(result), className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "View Profile" }), _jsx("button", { onClick: () => handleMentorshipAction(result), className: "flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: result.type === 'student' ? 'Offer Mentorship' : 'Request Mentorship' })] })] })] })), result.type === 'project' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-gradient-to-r from-green-500 to-teal-600 px-4 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("span", { className: "text-white font-semibold block truncate", children: result.project?.title }), _jsx("span", { className: "text-white/80 text-xs", children: result.project?.creator_type === 'faculty' ? '🎓 Faculty Project' :
                                                                result.project?.creator_type === 'industry' ? '💼 Industry Project' :
                                                                    '👨‍💻 Student Project' })] }), _jsxs("div", { className: "flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex-shrink-0 ml-2", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-white" }), _jsxs("span", { className: "text-white font-bold", children: [result.match, "%"] })] })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsxs("p", { className: "text-sm text-gray-600 mb-1", children: ["By ", result.creator?.full_name] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Duration: ", result.project?.duration, " | ", result.project?.time_commitment_hours, "hrs/week"] })] }), _jsx("p", { className: "text-sm text-gray-700 mb-4 line-clamp-3", children: result.project?.description || 'No description available' }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900 mb-2", children: "Why you matched:" }), _jsx("div", { className: "space-y-1", children: result.why.map((reason, i) => (_jsxs("p", { className: "text-sm text-green-600 flex items-start gap-2", children: [_jsx("span", { className: "text-green-500", children: "\u2713" }), _jsx("span", { children: reason })] }, i))) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900 mb-2", children: "Required Skills:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: result.project?.required_skills?.slice(0, 3).map((skill, i) => (_jsx("span", { className: "px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full", children: skill }, i))) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => handleViewDetails(result), className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "View Details" }), _jsx("button", { onClick: () => handleApplyToProject(result.project?.id), className: "flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "Apply to Project" })] })] })] }))] }, index))) }))] }), _jsx(MentorshipRequestModal, { isOpen: mentorshipModal.isOpen, onClose: () => setMentorshipModal({ ...mentorshipModal, isOpen: false }), recipientId: mentorshipModal.recipientId, recipientName: mentorshipModal.recipientName, recipientType: mentorshipModal.recipientType, requestType: mentorshipModal.requestType })] }));
}
