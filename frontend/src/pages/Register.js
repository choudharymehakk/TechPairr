import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { register } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        user_type: 'student'
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await register(formData);
            if (response.data.status === 'success') {
                login(response.data.user, response.data.token);
                setMessage('Registration successful! Setting up your profile...');
                setTimeout(() => navigate('/profile-setup'), 1000);
            }
            else {
                setMessage(response.data.message);
            }
        }
        catch (err) {
            setMessage('Registration failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const userTypeOptions = [
        { value: 'student', label: 'Student', icon: '🎓' },
        { value: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
        { value: 'industry', label: 'Industry Mentor', icon: '💼' }
    ];
    return (_jsx("div", { className: "min-h-screen w-full flex items-center justify-center p-4", style: {
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        }, children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg mb-6", children: _jsx("svg", { className: "h-8 w-8 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" }) }) }), _jsx("h2", { className: "text-4xl font-bold text-gray-800 mb-2", children: "Join Mentora" }), _jsx("p", { className: "text-lg text-gray-600", children: "Start your mentoring journey today" })] }), _jsx("div", { className: "bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/50", children: _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsx("input", { name: "full_name", type: "text", required: true, className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200", placeholder: "Full Name", value: formData.full_name, onChange: handleChange }), _jsx("input", { name: "email", type: "email", required: true, className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200", placeholder: "Email address", value: formData.email, onChange: handleChange }), _jsx("input", { name: "password", type: "password", required: true, className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200", placeholder: "Password", value: formData.password, onChange: handleChange }), _jsx("select", { name: "user_type", value: formData.user_type, onChange: handleChange, className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200", children: userTypeOptions.map(option => (_jsxs("option", { value: option.value, children: [option.icon, " ", option.label] }, option.value))) })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center py-3 px-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg", children: loading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full" }), "Creating account..."] })) : ('Create Account') }), message && (_jsx("div", { className: `text-center text-sm font-medium ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`, children: message })), _jsx("div", { className: "text-center", children: _jsxs("span", { className: "text-gray-600", children: ["Already have an account?", ' ', _jsx("a", { href: "/", className: "font-semibold text-orange-600 hover:text-orange-500 transition-colors duration-200", children: "Sign in" })] }) })] }) })] }) }));
};
export default Register;
