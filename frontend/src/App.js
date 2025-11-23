import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import CreateProject from './pages/CreateProject';
import LandingPage from './pages/LandingPage';
import BrowseProjects from './pages/BrowseProjects';
import ProjectDetails from './pages/ProjectDetails';
import MyApplications from './pages/MyApplications';
import ReceivedApplications from './pages/ReceivedApplications';
import ActiveProjects from './pages/ActiveProjects';
import MyProjects from './pages/MyProjects';
import ExplorePage from './pages/ExplorePage';
import ProfileView from './pages/ProfileView';
import MentorshipRequestsPage from './pages/MentorshipRequestsPage';
function App() {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/profile-setup", element: _jsx(ProfileSetup, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/create-project", element: _jsx(CreateProject, {}) }), _jsx(Route, { path: "/browse-projects", element: _jsx(BrowseProjects, {}) }), _jsx(Route, { path: "/project/:projectId", element: _jsx(ProjectDetails, {}) }), _jsx(Route, { path: "/my-applications", element: _jsx(MyApplications, {}) }), _jsx(Route, { path: "/received-applications", element: _jsx(ReceivedApplications, {}) }), _jsx(Route, { path: "/active-projects", element: _jsx(ActiveProjects, {}) }), _jsx(Route, { path: "/my-projects", element: _jsx(MyProjects, {}) }), _jsx(Route, { path: "/explore", element: _jsx(ExplorePage, {}) }), _jsx(Route, { path: "/profile/:userType/:userId", element: _jsx(ProfileView, {}) }), _jsx(Route, { path: "/mentorship-requests", element: _jsx(MentorshipRequestsPage, {}) })] }) }) }));
}
export default App;
