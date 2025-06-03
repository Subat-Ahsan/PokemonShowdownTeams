import React from 'react'
import {API_BASE_URL} from "../global"
import { useNavigate } from 'react-router-dom';

export default function TeamOverview({id, summary, name}) {
  const imagePath = API_BASE_URL + "/data" +"/sprite/"
  const navigate = useNavigate();

  const goToTeam = () => {
    if (id){
      navigate('/viewTeam/' + id)
    }
  }
  return (
    <div className = 'teamContainer' onClick={goToTeam} 
        style = {{display: 'inline-block',borderColor: '#420080', 
        borderWidth: '6px', borderStyle: 'solid',
        padding: '15px',
        borderRadius: '30px',
    }}>
    
        <div style={{ fontSize: '1.4rem', fontWeight: "bolder"}}>{name}</div>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 130px)',
        gridTemplateRows: 'repeat(1, 1fr)',
        gap: '1rem',
        justifyContent: 'center'
        }}>
        {summary.map(([name, spriteUrl], index) => (
            <div key={index} style={{ textAlign: 'center' }} >
            <img
                src={imagePath + spriteUrl}
                alt={name}
                style={{ width: '80px', height: '60px', objectFit: 'contain' }}
                onError={(e) => { e.target.src = fallbackUrl }}
            />
            <div style={{ marginTop: '0.5rem', fontSize: '1.1rem'}}>{name}</div>
            </div>
        ))}
        </div>
    </div>
  )
}
