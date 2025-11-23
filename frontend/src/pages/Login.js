import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { login as loginAPI, checkProfileExists } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const response = await loginAPI(formData);
            if (response.data.status === 'success') {
                const user = response.data.user;
                login(user, response.data.token);
                try {
                    await checkProfileExists(user.user_type, user.id);
                    setMessage('Login successful! Redirecting to dashboard...');
                    setTimeout(() => navigate('/dashboard'), 1000);
                }
                catch (error) {
                    setMessage('Login successful! Complete your profile...');
                    setTimeout(() => navigate('/profile-setup'), 1000);
                }
            }
            else {
                setMessage(response.data.message);
            }
        }
        catch (err) {
            setMessage('Login failed. Please check your credentials.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen w-full flex items-center justify-center p-4", style: {
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }, children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-6", children: _jsx("svg", { className: "h-8 w-8 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }), _jsx("h2", { className: "text-4xl font-bold text-gray-800 mb-2", children: "Welcome to Mentora" }), _jsx("p", { className: "text-lg text-gray-600", children: "Connect with mentors, grow together" })] }), _jsx("div", { className: "bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/50", children: _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsx("div", { children: _jsx("input", { name: "email", type: "email", required: true, className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", placeholder: "Email address", value: formData.email, onChange: handleChange }) }), _jsx("div", { children: _jsx("input", { name: "password", type: "password", required: true, className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", placeholder: "Password", value: formData.password, onChange: handleChange }) })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center py-3 px-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg", children: loading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full" }), "Signing in..."] })) : ('Sign in') }), message && (_jsx("div", { className: `text-center text-sm font-medium ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`, children: message })), _jsx("div", { className: "text-center", children: _jsxs("span", { className: "text-gray-600", children: ["Don't have an account?", ' ', _jsx("a", { href: "/register", className: "font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200", children: "Register here" })] }) })] }) })] }) }));
};
export default Login;
