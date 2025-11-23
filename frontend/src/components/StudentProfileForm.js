import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { createStudentProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const StudentProfileForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        student_id: '',
        department: '',
        year_of_study: 1,
        cgpa: '',
        skills: '',
        interests: '',
        career_goals: '',
        portfolio_url: '',
        github_url: '',
        bio: '',
        collaboration_preference: 'seeking_mentor',
        time_commitment: 10
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const profileData = {
                ...formData,
                user_id: user?.id,
                skills: formData.skills.split(',').map(s => s.trim()),
                interests: formData.interests.split(',').map(s => s.trim()),
                career_goals: formData.career_goals.split(',').map(s => s.trim()),
                cgpa: parseFloat(formData.cgpa),
                year_of_study: parseInt(formData.year_of_study.toString())
            };
            const response = await createStudentProfile(profileData);
            if (response.data.status === 'success') {
                setMessage('Profile created successfully! Redirecting to dashboard...');
                setTimeout(() => navigate('/dashboard'), 1500);
            }
        }
        catch (error) {
            setMessage('Error creating profile. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "w-full max-w-2xl mx-auto", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full mb-4 shadow-lg", children: _jsx("span", { className: "text-2xl", children: "\uD83C\uDF93" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Student Profile Setup" }), _jsx("p", { className: "text-gray-600", children: "Tell us about your academic journey and goals" })] }), _jsxs("div", { className: "bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800 mb-4 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDCDA" }), " Academic Information"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("input", { name: "student_id", type: "text", placeholder: "Student ID", value: formData.student_id, onChange: handleChange, className: "px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", required: true }), _jsx("input", { name: "department", type: "text", placeholder: "Department", value: formData.department, onChange: handleChange, className: "px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", required: true }), _jsxs("select", { name: "year_of_study", value: formData.year_of_study, onChange: handleChange, className: "px-4 py-3 bg-white/70 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", children: [_jsx("option", { value: 1, children: "1st Year" }), _jsx("option", { value: 2, children: "2nd Year" }), _jsx("option", { value: 3, children: "3rd Year" }), _jsx("option", { value: 4, children: "4th Year" })] }), _jsx("input", { name: "cgpa", type: "number", step: "0.01", placeholder: "CGPA (Optional)", value: formData.cgpa, onChange: handleChange, className: "px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", min: "0", max: "10" })] })] }), _jsxs("div", { className: "bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800 mb-4 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDE80" }), " Skills & Interests"] }), _jsxs("div", { className: "space-y-4", children: [_jsx("input", { name: "skills", type: "text", placeholder: "Skills (e.g., Python, React, Machine Learning)", value: formData.skills, onChange: handleChange, className: "w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" }), _jsx("input", { name: "interests", type: "text", placeholder: "Interests (e.g., AI, Web Development, Data Science)", value: formData.interests, onChange: handleChange, className: "w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" }), _jsx("input", { name: "career_goals", type: "text", placeholder: "Career Goals (e.g., Software Engineer, Data Scientist)", value: formData.career_goals, onChange: handleChange, className: "w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" })] })] }), _jsxs("div", { className: "bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800 mb-4 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDD17" }), " Portfolio & Links"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("input", { name: "portfolio_url", type: "url", placeholder: "Portfolio URL (Optional)", value: formData.portfolio_url, onChange: handleChange, className: "px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" }), _jsx("input", { name: "github_url", type: "url", placeholder: "GitHub URL (Optional)", value: formData.github_url, onChange: handleChange, className: "px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" })] })] }), _jsxs("div", { className: "bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800 mb-4 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\u2699\uFE0F" }), " Mentoring Preferences"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("select", { name: "collaboration_preference", value: formData.collaboration_preference, onChange: handleChange, className: "px-4 py-3 bg-white/70 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", children: [_jsx("option", { value: "seeking_mentor", children: "Seeking Mentor" }), _jsx("option", { value: "seeking_partner", children: "Seeking Partner" }), _jsx("option", { value: "joining_projects", children: "Joining Projects" })] }), _jsx("input", { name: "time_commitment", type: "number", placeholder: "Hours per week", value: formData.time_commitment, onChange: handleChange, className: "px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", min: "1" })] }), _jsx("textarea", { name: "bio", placeholder: "Tell us about yourself...", value: formData.bio, onChange: handleChange, rows: 4, className: "mt-4 w-full px-4 py-3 bg-white/70 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center py-4 px-6 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg", children: loading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full" }), "Creating Profile..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "mr-2", children: "\u2728" }), "Complete Student Profile"] })) }), message && (_jsx("div", { className: `text-center text-sm font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`, children: message }))] }) }));
};
export default StudentProfileForm;
