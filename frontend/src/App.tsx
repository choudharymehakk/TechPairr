import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './components/Dashboard'
import ProfileSetup from './pages/ProfileSetup'
import CreateProject from './pages/CreateProject'
import LandingPage from './pages/LandingPage'

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
