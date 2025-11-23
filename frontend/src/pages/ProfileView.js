import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Calendar, Award, BookOpen, Briefcase } from 'lucide-react';
import { getProfile } from '../services/api';
export default function ProfileView() {
    const { userType, userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchProfile();
    }, [userType, userId]);
    const fetchProfile = async () => {
        try {
            setLoading(true);
            if (!userType || !userId) {
                setError('Invalid profile URL');
                return;
            }
            const response = await getProfile(userType, userId);
            if (response.data.status === 'success') {
                setProfile(response.data.data);
                // Fetch user info (you might need to add this to your API)
                // For now, we'll use what's in the profile
            }
            else {
                setError('Profile not found');
            }
        }
        catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || 'Failed to load profile');
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading profile..." })] }) }));
    }
    if (error || !profile) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center text-red-600", children: [_jsx("p", { className: "text-lg font-semibold mb-2", children: error || 'Profile not found' }), _jsx("button", { onClick: () => navigate(-1), className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Go Back" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6", children: [_jsx(ArrowLeft, { className: "w-5 h-5" }), _jsx("span", { children: "Back to Explore" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden mb-6", children: [_jsx("div", { className: `h-32 ${userType === 'student'
                                ? 'bg-gradient-to-r from-indigo-500 to-blue-600'
                                : userType === 'faculty'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                                    : 'bg-gradient-to-r from-orange-500 to-pink-600'}` }), _jsxs("div", { className: "px-8 pb-8", children: [_jsx("div", { className: "relative -mt-16 mb-4", children: _jsx("div", { className: "w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-lg", children: userType === 'student' ? '🎓' : userType === 'faculty' ? '👨‍🏫' : '💼' }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: profile.user?.full_name || 'User Profile' }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-gray-600 mb-4", children: [userType === 'student' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(BookOpen, { className: "w-4 h-4" }), _jsxs("span", { children: ["Year ", profile.year_of_study, " - ", profile.department] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Award, { className: "w-4 h-4" }), _jsxs("span", { children: ["CGPA: ", profile.cgpa || 'N/A'] })] })] })), userType === 'faculty' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Briefcase, { className: "w-4 h-4" }), _jsx("span", { children: profile.designation })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsx("span", { children: profile.department })] })] })), userType === 'industry' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Briefcase, { className: "w-4 h-4" }), _jsxs("span", { children: [profile.position, " at ", profile.company] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsxs("span", { children: [profile.years_experience, " years experience"] })] })] }))] }), profile.bio && (_jsx("p", { className: "text-gray-700 leading-relaxed", children: profile.bio }))] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-4", children: userType === 'student' ? 'Skills' :
                                userType === 'faculty' ? 'Expertise & Research Areas' :
                                    'Expertise & Focus Areas' }), userType === 'student' && (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Technical Skills" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: profile.skills?.map((skill, i) => (_jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm", children: skill }, i))) }), _jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Interests" }), _jsx("div", { className: "flex flex-wrap gap-2", children: profile.interests?.map((interest, i) => (_jsx("span", { className: "px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm", children: interest }, i))) })] })), userType === 'faculty' && (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Expertise" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: profile.expertise?.map((item, i) => (_jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm", children: item }, i))) }), _jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Research Areas" }), _jsx("div", { className: "flex flex-wrap gap-2", children: profile.research_areas?.map((area, i) => (_jsx("span", { className: "px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm", children: area }, i))) })] })), userType === 'industry' && (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Expertise" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: profile.expertise?.map((item, i) => (_jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm", children: item }, i))) }), _jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Mentoring Focus" }), _jsx("div", { className: "flex flex-wrap gap-2", children: profile.mentoring_focus?.map((focus, i) => (_jsx("span", { className: "px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm", children: focus }, i))) })] }))] }), _jsx("div", { className: "bg-white rounded-lg shadow-lg p-8", children: _jsxs("div", { className: "flex gap-4", children: [_jsxs("a", { href: `mailto:${profile.user?.email || ''}?subject=Connect on Mentora&body=Hi ${profile.user?.full_name || ''},%0D%0A%0D%0AI found your profile on Mentora and would love to connect!%0D%0A%0D%0ABest regards`, className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center", children: [_jsx(Mail, { className: "w-5 h-5 inline mr-2" }), "Send Email"] }), _jsx("button", { className: "flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors", children: userType === 'student' ? 'Offer Mentorship' : 'Request Mentorship' })] }) })] }) }));
}
