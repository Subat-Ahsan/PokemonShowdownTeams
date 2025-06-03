import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "./NavBar"
import {API_BASE_URL} from "../global"

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try{
        const response = await fetch(API_BASE_URL + '/users/createUser', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            setMessage(`Error: ${errorData.message || response.statusText}`);
        } else {
            const data = await response.json();
            setMessage(`Success: ${data.message || 'User created!'}`);
            setUsername('');
            setPassword('');
            navigate('/login');
        }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
    <NavBar />
   
    <div style={{ maxWidth: '800px', margin: 'auto' , fontSize: '2rem'}}>
        <h2>Register</h2>
      <form onSubmit={handleSubmit}>
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
      <button type="submit"  disabled = {loading} 
      style = {{ cursor: loading ? 'not-allowed' : 'pointer'}}>
      {loading ? 'Creating...' : 'Create User'} </button>
      </form>
      {message && (
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          {message}
        </p>
      )}
    </div>
     </>
  )
}
