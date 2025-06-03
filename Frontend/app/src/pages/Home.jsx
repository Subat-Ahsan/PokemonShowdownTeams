import React, { useState } from 'react';
import NavBar from "./NavBar"
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [userSearch, setUserSearch] = useState('');
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/viewUser/"+userSearch);
  };
  return (
    <>
    <NavBar />
    <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: "1rem" }}>Find User</div>
    <div style={{ maxWidth: '800px', margin: 'auto' , fontSize: '2rem', display: 'flex', gap: '0.5rem'}}>
        <input
          id="username"
          type="text"
          value={userSearch}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
            e.preventDefault(); 
            handleClick();     
          }
          }}
          onChange={(e) => setUserSearch(e.target.value)}
          placeholder="Find User"
          style={{ width: '100%', padding: '0.5rem', fontSize: '1.4rem'  }}
        />
        <button onClick={handleClick} style={{fontSize: '2rem' , padding: '0.4rem'}}>🔍</button>
    </div>
    
    </>
  )
}
