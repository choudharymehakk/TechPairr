import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { authService } from '../services/auth';

const styles = {
  container: {
  minHeight: '100vh',
  width: '100vw',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: '0',
  margin: '0',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxSizing: 'border-box',
  position: 'relative', 
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
    padding: '2rem 2rem 0 2rem',
  },
  welcome: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#718096',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
    padding: '0 2rem',
  },
  statCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#718096',
    fontWeight: '500',
  },
  section: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '2rem',
    margin: '0 2rem 2rem 2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1.5rem',
  },
  projectsList: {
    listStyle: 'none',
    padding: 0,
  },
  projectItem: {
    padding: '1.5rem',
    marginBottom: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#f7fafc',
  },
  projectItemHover: {
    borderColor: '#667eea',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
    transform: 'translateY(-2px)',
  },
  projectTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  projectDescription: {
    color: '#4a5568',
    marginBottom: '1rem',
  },
  projectMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: '#718096',
  },
  createButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '1rem',
  },
  logoutButton: {
    background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#718096',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#667eea',
  }
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Fetch user's projects from API
    async function fetchProjects() {
      try {
        const response = await api.get('/projects/my-projects');
        setProjects(response.data.projects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.reload(); // Simple way to return to login
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          🔄 Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.welcome}>
          Welcome back, {user ? user.profile_data.name : 'User'}! 🎉
        </h1>
        <p style={styles.subtitle}>
          Here's what's happening with your Mentora projects
        </p>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{projects.length}</div>
          <div style={styles.statLabel}>Projects Created</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {projects.filter(p => p.status === 'open').length}
          </div>
          <div style={styles.statLabel}>Active Projects</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>0</div>
          <div style={styles.statLabel}>Mentor Connections</div>
        </div>
      </div>

      {/* Projects Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Projects</h2>
        
        <button style={styles.createButton}>
          ➕ Create New Project
        </button>

        {projects.length === 0 ? (
          <div style={styles.emptyState}>
            <h3>No projects yet!</h3>
            <p>Create your first project to get started with mentorship.</p>
          </div>
        ) : (
          <ul style={styles.projectsList}>
            {projects.map(project => (
              <li 
                key={project.id} 
                style={{
                  ...styles.projectItem,
                  ...(hoveredProject === project.id ? styles.projectItemHover : {})
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div style={styles.projectTitle}>{project.title}</div>
                <div style={styles.projectDescription}>
                  {project.description}
                </div>
                <div style={styles.projectMeta}>
                  <span>🏷️ {project.project_type}</span>
                  <span>📅 {new Date(project.created_at).toLocaleDateString()}</span>
                  <span>👥 {project.current_collaborators}/{project.max_collaborators}</span>
                  <span>⏱️ {project.duration_months} months</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
