import React from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [username, setUsername] = useState(null);
  
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    setUsername(savedUsername);
  }, []);

   const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setUsername(null);
    
  };

  return (
    <nav style={styles.nav}>
        <div style={styles.left}>
            <Link className="nav-link" to="/" style={styles.link}>Home</Link>
        </div>
        <div style={styles.right}>
            {username ? (
            <>
            <span  >Hello, {username}</span>
            <button onClick={handleLogout} className="nav-link" style={styles.logoutButton}>Logout</button>
            </>
            ) : (
            <>
                <Link to="/login" className="nav-link" style={styles.link}>Login</Link>
                <Link to="/register" className="nav-link" style={styles.link}>Register</Link>
            </>
            )}
        </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#3d3d3d',
    padding: '1rem 6rem',
    color: 'white',
    fontSize: "1.5rem",
    width: '80%',
    margin: '0 auto 2rem auto',
    borderRadius: '8px'
  },
  left: {
    fontWeight: 'bold',
    fontSize: "2rem",
  },
  right: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    textDecoration: 'none',
  },

  logoutButton: {
    background: 'transparent',
    border: '1px solid white',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '1rem',
    fontSize: "0.8rem",
  },
};
