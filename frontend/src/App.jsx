import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { authService } from './services/auth';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register' | 'dashboard'

  // Check if user is already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleShowRegister = () => {
    setCurrentView('register');
  };

  const handleShowLogin = () => {
    setCurrentView('login');
  };

  // Render based on current view
  if (currentView === 'dashboard') {
    return <Dashboard />;
  }

  if (currentView === 'register') {
    return (
      <Register 
        onRegisterSuccess={handleRegisterSuccess}
        showLogin={handleShowLogin}
      />
    );
  }

  // Default to Login view
  return (
    <Login 
      onLoginSuccess={handleLoginSuccess}
      showRegister={handleShowRegister}
    />
  );
}

export default App;
