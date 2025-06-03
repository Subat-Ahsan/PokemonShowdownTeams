import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "./NavBar"
import {API_BASE_URL} from "../global"

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
        setLoading(true)
        const response = await fetch(API_BASE_URL + '/users/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            navigate('/');
        } else {
            setMessage(data.error || 'Login failed');
        }
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
  return (
    <>
    <NavBar />
    
    <div style={{ maxWidth: '800px', margin: 'auto' , fontSize: '2rem'}}>
        <h2>Login</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.3rem' }}>
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          style={{ width: '100%', padding: '0.5rem', fontSize: '1.2rem' }}
        />
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <label style={{ marginBottom: '0.3rem',  }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{ width: '100%', padding: '0.5rem', fontSize: '1.2rem'}}
        />
      </div>
      <button  onClick={handleLogin} disabled = {loading} 
      style = {{ cursor: loading ? 'not-allowed' : 'pointer'}}>
      {loading ? 'Logging in...' : 'Login'} </button>
      {message && (
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          {message}
        </p>
      )}
    </div>
    </>
  )
}
