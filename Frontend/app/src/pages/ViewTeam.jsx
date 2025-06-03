import React from 'react'
import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import {API_BASE_URL} from "../global"
import { useNavigate } from 'react-router-dom';

import ViewPkmn from "./ViewPkmn"
import NavBar from "./NavBar"

export default function ViewTeam() {
  const params = useParams();
  const teamID = params.teamid
  const [data, setData] = useState('')
  const [dataJson, setDataJson] = useState({})
  const [copyParts, setCopyParts] = useState([])
  const [viewMode, setViewMode] = useState(true)
  const switchMode = () => {
    setViewMode(!viewMode)
  }
  const navigate = useNavigate();
  useEffect(() => {
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
            setDataJson(jsonOut)
            setData(JSON.stringify(jsonOut));
            setCopyParts((jsonOut.teamText || '').split('\n\n'));
        } else {
            setDataJson({})
            setData(data.error || 'Not Found');
            setCopyParts([])
        }
      } catch{
        setDataJson({})
        setData("Error: "+ err.message)
        setCopyParts([])
      }
    }
    func()
  }, [])
  return (
    <>
    <NavBar />
    <div style = {{fontSize: "1.5rem", fontWeight: "bold", margin: "0 0 10px 0", 
      display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px'}}>
      <span>{dataJson.name && dataJson.name}
      <br/>
      {dataJson.user  && dataJson.user.username && 
      <a onClick={e => {e.preventDefault(); navigate("/viewUser/"+dataJson.user.username)}}
      >{"  By:  " + dataJson.user.username}</a>}</span>
      <button style = {{fontSize: "1rem", padding:'5px 20px', backgroundColor: "#383f4a"}}
      onClick = {switchMode}>
        {viewMode ? "Copy" : "View"}
      </button>
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
    </>
  )
}
