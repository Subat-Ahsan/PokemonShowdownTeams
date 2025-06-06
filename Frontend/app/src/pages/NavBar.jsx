import React from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    setUsername(savedUsername);
  }, []);

   const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setUsername(null);
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
        <div style={styles.left}>
            <span  ><Link className="nav-link" to="/" style={styles.link}>Home</Link></span>
            <span><Link className="nav-link" to="/upload" style={styles.link}>Upload</Link></span>
            {username && <Link className="nav-link" to={"/viewUser/"+username} 
            style={styles.link}>Profile</Link>}
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
    display: 'flex', 
    gap: '20px'
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
