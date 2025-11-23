import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../contexts/AuthContext';
import StudentProfileForm from '../components/StudentProfileForm';
import FacultyProfileForm from '../components/FacultyProfileForm';
import IndustryProfileForm from '../components/IndustryProfileForm';
const ProfileSetup = () => {
    const { user, logout } = useAuth();
    if (!user) {
        return (_jsx("div", { className: "min-h-screen w-full flex items-center justify-center p-4", style: {
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            }, children: _jsxs("div", { className: "text-center bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl", children: [_jsx("div", { className: "mb-6", children: _jsx("svg", { className: "mx-auto h-16 w-16 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Access Denied" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Please login to setup your profile" }), _jsx("a", { href: "/", className: "inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105", children: "Go to Login" })] }) }));
    }
    const getUserTypeInfo = () => {
        switch (user.user_type) {
            case 'student':
                return {
                    icon: '🎓',
                    title: 'Student',
                    description: 'Connect with mentors and accelerate your learning journey',
                    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    buttonGradient: 'from-blue-500 to-teal-500'
                };
            case 'faculty':
                return {
                    icon: '👨‍🏫',
                    title: 'Faculty',
                    description: 'Guide the next generation of innovators and researchers',
                    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                    buttonGradient: 'from-green-500 to-blue-500'
                };
            case 'industry':
                return {
                    icon: '💼',
                    title: 'Industry Mentor',
                    description: 'Share real-world experience with aspiring professionals',
                    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
                    buttonGradient: 'from-orange-500 to-red-500'
                };
            default:
                return {
                    icon: '❓',
                    title: 'Unknown',
                    description: 'Unknown user type',
                    gradient: 'linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)',
                    buttonGradient: 'from-gray-500 to-gray-700'
                };
        }
    };
    const renderProfileForm = () => {
        switch (user.user_type) {
            case 'student':
                return _jsx(StudentProfileForm, {});
            case 'faculty':
                return _jsx(FacultyProfileForm, {});
            case 'industry':
                return _jsx(IndustryProfileForm, {});
            default:
                return (_jsxs("div", { className: "text-center py-12 bg-white/90 backdrop-blur-lg rounded-2xl", children: [_jsx("div", { className: "mb-6", children: _jsx("svg", { className: "mx-auto h-16 w-16 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800 mb-2", children: "Unknown User Type" }), _jsx("p", { className: "text-gray-600", children: "Please contact support for assistance." })] }));
        }
    };
    const userInfo = getUserTypeInfo();
    return (_jsx("div", { className: "min-h-screen w-full flex flex-col items-center justify-center p-4", style: {
            background: userInfo.gradient
        }, children: _jsxs("div", { className: "w-full max-w-4xl", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: `inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${userInfo.buttonGradient} rounded-full mb-6 shadow-2xl`, children: _jsx("span", { className: "text-3xl", children: userInfo.icon }) }), _jsxs("h1", { className: "text-4xl font-bold text-gray-800 mb-4", children: ["Welcome to Mentora, ", user.full_name, "!"] }), _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("p", { className: "text-xl text-gray-700 mb-2", children: ["Complete your ", userInfo.title, " profile to get started"] }), _jsx("p", { className: "text-lg text-gray-600", children: userInfo.description })] }), _jsxs("div", { className: "mt-8 max-w-md mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-gray-700 mb-2", children: [_jsx("span", { children: "Account Created" }), _jsx("span", { children: "Profile Setup" }), _jsx("span", { children: "Dashboard" })] }), _jsx("div", { className: "w-full bg-white/30 rounded-full h-2", children: _jsx("div", { className: "bg-white h-2 rounded-full w-1/2 shadow-sm" }) }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Step 2 of 3" })] })] }), _jsx("div", { className: "bg-white/80 backdrop-blur-lg rounded-xl p-4 mb-8 border border-white/50 shadow-lg", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "text-2xl", children: userInfo.icon }), _jsxs("div", { children: [_jsx("h3", { className: "text-gray-800 font-semibold", children: user.full_name }), _jsxs("p", { className: "text-gray-600 text-sm", children: [user.email, " \u2022 ", userInfo.title] })] })] }), _jsxs("button", { onClick: logout, className: "flex items-center space-x-2 px-4 py-2 bg-white/60 hover:bg-white/80 text-gray-700 rounded-lg transition-all duration-200 border border-white/50", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }), _jsx("span", { className: "hidden sm:inline", children: "Logout" })] })] }) }), _jsx("div", { className: "bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-white/50 shadow-2xl", children: renderProfileForm() }), _jsx("div", { className: "text-center mt-8", children: _jsxs("p", { className: "text-gray-600 text-sm", children: ["Need help? Contact us at", ' ', _jsx("a", { href: "mailto:support@mentora.com", className: "text-gray-700 hover:text-gray-800 underline font-medium", children: "support@mentora.com" })] }) })] }) }));
};
export default ProfileSetup;
