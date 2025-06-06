import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import {API_BASE_URL} from "../global"
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

 
import ViewPkmn from './ViewPkmn';

export default function EditTeam() {
  const navigate = useNavigate();
  const [textMode,setTextMode] = useState(true);

  const [title, setTitle] = useState('Untitled');
  const [loading, setLoading] = useState(false);

  const [editTitle, setEditTitle] = useState(false);
  const [inputText, setInputText] = useState("")

  const [teamError, setTeamError] = useState("")
  const inputRef = useRef(null);

  const [viewError, setViewError] = useState("")
  const [teamInfo, setTeamInfo] = useState({})

  const params = useParams()
  const teamID = params.teamid

  const exitTitleEdit = () => {
    setEditTitle(false);
    if (!title){
      setTitle("Untitled")
    }
  }

  const  changeView = async () => {
    if (textMode) {
      try{
        setLoading(true)
        const response = await fetch(API_BASE_URL + '/data/validateTeam', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({team: inputText}),
                });
        const data = await response.json();

        if (response.ok) {
           setTeamInfo({ ...data })
        } else {
            setViewError(data.error || 'Error');
            setTeamInfo({})
        }
       
      } catch (err){
        setViewError('Error: ' + err.message);
        setTeamInfo({})
      } finally {
        setTextMode(false)
        setLoading(false)
      }
    }
    else{
      setViewError("")
      setTeamInfo({})
      setTextMode(true)
    }
  }
  const editTeam = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(API_BASE_URL + '/data/editTeam/'+teamID, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({name: title, team: inputText}),
        });
        const data = await response.json();
        if (response.ok) {
           Swal.fire({
            icon: 'success',
            title: 'Team Edited successfully!',
            confirmButtonText: 'Okay',}) .then((result) => {
            if (result.isConfirmed) {
              navigate('/ViewTeam/' + data.teamId);
            }})
        } else { 
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: data.error || 'Error',
              confirmButtonText: 'Okay'
            });
        }
    } catch (err){
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Error: ' + err.message,
        confirmButtonText: 'Okay'
      });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
    }
    const func = async () =>{
        try {
        const response = await fetch(API_BASE_URL + '/data/teams/' + teamID, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          }
          });
          if (response.ok) {
              const jsonOut = await response.json();
              setTitle(jsonOut.name);
              setInputText(jsonOut.teamText);
          } else {
              setTeamError("Not found")
          }
        } catch (err) {
          setTeamError("Error: "+ err.message)
        }
    }
    func()
  }, []);

  useEffect(() => {
    if (editTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editTitle]);

  return (
    <>
    <NavBar />
    {teamError ? <div className='errorText'>{teamError}</div> :
    <div style = {{display: 'flex', flexDirection: 'row', gap: "1rem", alignItems: 'flex-start',
      padding: "0 12%"
    }}>
      <div style = {{display: 'flex', flexDirection: 'column', gap: "1rem", 
        alignItems: 'center', fontSize: "1.5rem", flexShrink: 0
        , padding: "20px", position: 'sticky',  top: 0}}>
        <h2 style = {{fontSize: "2rem", margin: "0 0"}}>Save</h2>   
        <button disabled = {loading} onClick={changeView} >{textMode ? "View" : "Edit"}</button>
        <button disabled = {loading} onClick={editTeam}>Save</button>
      </div>  
      {loading ? <div className='errorText'>Loading ... </div> : 
      <div style = {{flexGrow: 1, display: 'flex', flexDirection: 'column', gap: "1rem",
        alignItems: 'center', borderLeft: "#3464eb solid 3px"}}>
        {textMode ? (<>
        {editTitle ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={exitTitleEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                exitTitleEdit()
              };
            }}
            style={{
              fontSize: '2rem',
              fontFamily: 'inherit',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              textAlign: "center",
              width: "auto",
              padding: 0,
              margin: 0,
            }}
          />
        ) : (
          <span onClick={() => setEditTitle(true)} style={{ cursor: 'text',  
            fontSize: '2rem'
          }}>
            {title}
          </span>
        )}
        <textarea  value={inputText}onChange={(e) => setInputText(e.target.value)}
          style = {{width: 600, height: 660, fontSize: "1.1rem", padding: "1rem", resize: 'none'}}/>
        </>) : 
        <div> 
          {viewError ? <div style = {{whiteSpace: 'pre-wrap', fontSize: '1.5rem'}}>{viewError}</div> : 
          <div>
            <div style={{
                display: 'flex',
                flexDirection: 'row', 
                gap: '5px',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                {teamInfo.teamData && teamInfo.teamData.map((item, index) => (
                <ViewPkmn
                  key={index}
                  data={item}
                  summary={teamInfo.teamSummary[index] !== undefined ? teamInfo.teamSummary[index] : ["", ""]}
                  copy={null}
                />
                ))}
            </div>
          </div>
        }
        </div>
        }
      </div>}
    </div>}
    </>
  )
}
