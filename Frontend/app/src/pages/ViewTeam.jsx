import React from 'react'
import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import {API_BASE_URL} from "../global"
import { useNavigate } from 'react-router-dom';
import { deleteTeam } from '../utils/deleteTeam';
import ViewPkmn from "./ViewPkmn"
import NavBar from "./NavBar"

export default function ViewTeam() {
  const params = useParams();
  const teamID = params.teamid
  const [data, setData] = useState('')
  const [dataJson, setDataJson] = useState({})
  const [copyParts, setCopyParts] = useState([])
  const [viewMode, setViewMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const deleteTeamHere = (id) => deleteTeam(id, API_BASE_URL,null, null, 
    ((dataJson.user && dataJson.user.username) ? "/viewUser/"+dataJson.user.username : "/")
    , navigate )

  const switchMode = () => {
    setViewMode(!viewMode)
  }
  
  useEffect(() => {
    const func = async () =>{
      try {
        setLoading(true)
        const response = await fetch(API_BASE_URL + '/data/teams/' + teamID, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const jsonOut = await response.json();
            setDataJson(jsonOut)
            setData("");
            setCopyParts((jsonOut.teamText || '').split('\n\n'));
        } else {
            setDataJson({})
            setData('Not Found');
            setCopyParts([])
        }
      } catch{
        setDataJson({})
        setData("Error: "+ err.message)
        setCopyParts([])
      } finally {
        setLoading(false)
      }
    }
    func()
  }, [])
  return (
    <>
    <NavBar />
    
    {loading ? <div className='errorText'>Loading ...</div> : 
    <>
    <div style = {{fontSize: "1.5rem", fontWeight: "bold", margin: "0 0 10px 0", 
      display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px'}}>
        {data && <div>{data}</div>}
      <span>{dataJson.name && dataJson.name}
      <br/>
      {dataJson.user  && dataJson.user.username && 
      <a onClick={e => {e.preventDefault(); navigate("/viewUser/"+dataJson.user.username)}}
      >{"  By:  " + dataJson.user.username}</a>}</span>
      {!data &&<button style = {{fontSize: "1rem", padding:'5px 20px', backgroundColor: "#383f4a"}}
      onClick = {switchMode}>
        {viewMode ? "Copy" : "View"}
      </button>}
      {(dataJson.user && dataJson.user.username == localStorage.getItem("username") && !data) && 
            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
              <button onClick = {() => {navigate("/editTeam/"+teamID)}}>✏️</button>
              <button onClick={() => deleteTeamHere(teamID)} >🗑️</button>
      </div>}
    </div>


    {viewMode ? 
      <div style={{
        display: 'flex',
        flexDirection: 'row', 
        gap: '5px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      {dataJson.data && dataJson.data.map((item, index) => (
      <ViewPkmn
        key={index}
        data={item}
        summary={dataJson.summary[index] !== undefined ? dataJson.summary[index] : ["", ""]}
        copy={copyParts[index] !== undefined ? copyParts[index] : null}
      />
      ))}
      </div> : 
      <textarea
        value = {dataJson && dataJson.teamText}
        readOnly
        style = {{
          width: "300px",
          height: "600px",
          fontSize: "14px"
        }}
      />
      }
      </>}
    </>
  )
}
