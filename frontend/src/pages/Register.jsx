import React, { useState } from 'react';
import { authService } from '../services/auth';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '1rem',
    margin: 0,
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeShape: {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    borderRadius: '50%',
    opacity: 0.1,
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    textAlign: 'center',
    color: '#2d3748',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#718096',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#4a5568',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    background: '#ffffff',
    color: '#2d3748',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    color: '#2d3748',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '0.875rem',
    fontSize: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  errorMessage: {
    color: '#e53e3e',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: '#fed7d7',
    borderRadius: '6px',
    border: '1px solid #feb2b2',
  },
  successMessage: {
    color: '#38a169',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: '#c6f6d5',
    borderRadius: '6px',
    border: '1px solid #9ae6b4',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#718096',
    fontSize: '0.9rem',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
  }
};

function Register(props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'student',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { name, email, password, user_type } = formData;
      const response = await authService.register({ 
        name, 
        email, 
        password, 
        user_type 
      });

      if (response.success) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        setError(null);
        
        // Auto login user after successful registration
        setTimeout(() => {
          if (props.onRegisterSuccess) {
            props.onRegisterSuccess();
          }
        }, 1500);
      } else {
        setError(response.error || 'Registration failed');
        setSuccess(null);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.decorativeShape}></div>

        <h1 style={styles.title}>Join Mentora</h1>
        <p style={styles.subtitle}>Create your account and start collaborating</p>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="user_type" style={styles.label}>I am a</label>
            <select
              id="user_type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty Member</option>
              <option value="industry">Industry Mentor</option>
            </select>
          </div>

          <button 
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }} 
            type="submit" 
            disabled={loading}
          >
            {loading ? '🔄 Creating Account...' : '🚀 Create Account'}
          </button>
        </form>

        <div style={styles.loginLink}>
          Already have an account? {' '}
          <a href="#" style={styles.link} onClick={(e) => {
              e.preventDefault();
              if (props.showLogin) props.showLogin();
            }}>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
