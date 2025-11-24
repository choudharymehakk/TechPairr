import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './components/Dashboard'
import ProfileSetup from './pages/ProfileSetup'
import CreateProject from './pages/Create-Project'
import LandingPage from './pages/LandingPage'
import BrowseProjects from './pages/BrowseProjects'
import ProjectDetails from './pages/ProjectDetails'
import MyApplications from './pages/MyApplications'
import ReceivedApplications from './pages/ReceivedApplications'
import ActiveProjects from './pages/ActiveProjects'
import MyProjects from './pages/MyProjects'
import ExplorePage from './pages/ExplorePage';
import ProfileView from './pages/ProfileView';
import MentorshipRequestsPage from './pages/MentorshipRequestsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/browse-projects" element={<BrowseProjects />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/received-applications" element={<ReceivedApplications />} />
          <Route path="/active-projects" element={<ActiveProjects />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile/:userType/:userId" element={<ProfileView />} />
          <Route path="/mentorship-requests" element={<MentorshipRequestsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
