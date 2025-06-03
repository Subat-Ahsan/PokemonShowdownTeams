import React from 'react'
import { useEffect, useState , useRef} from 'react';
import { useParams } from 'react-router-dom';
import NavBar from "./NavBar"
import TeamOverview from './TeamOverview';
import { useSearchParams } from 'react-router-dom';

import {API_BASE_URL} from "../global"


export default function ViewUser() {
  const params = useParams();
  const user = params.username
  const [data, setData] = useState('')
  const [dataJson, setDataJson] = useState({})
  const [teamCount, setTeamCount] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams();
  const [curPage, setCurPage] = useState(1)

  const goToPage = (newPage) => {
    const clamped = Math.max(1, Math.min(newPage, Math.ceil(teamCount / 10)));
    setSearchParams({ page: clamped });
  };

  const goNextPage = () => {goToPage(curPage+1)}
  const goPrevPage = () => {goToPage(curPage-1)}

  useEffect(() =>{
    const func = async () => {
    try {
        const page = parseInt(searchParams.get('page'));
        const url = new URL(`${API_BASE_URL}/data/getTeams/${user}`);
        if (page) {
          url.searchParams.append('page', page);
          setCurPage(page)
        }  
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const jsonOut = await response.json();
            setDataJson(jsonOut)
            setData("");
            setTeamCount(jsonOut.total)
        } else {
            setDataJson({})
            setTeamCount(0)
            setData(data.error || 'Not Found');
        }
        
    } catch (err) {
        setDataJson({})
        setTeamCount(0)
        setData("Error: "+ err.message)
    }}
    func();
    window.scrollTo(0, 0);
    
  }, [searchParams])
  return (
    <>
      <NavBar />
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: "1rem" }}>{user}'s Teams</div>
      { data && (<div>{data}</div>) }
      {(teamCount == 0) && (<div style={{ fontSize: '1rem'}}>No Teams Found </div>)}
      <div  style = {{display: 'inline-flex', flexDirection: 'column', gap: '15px'}}>
      {dataJson.teams && dataJson.teams.length > 0 && 
          dataJson.teams.map((team) => (
          <TeamOverview 
          key={team._id} 
          name={team.name} 
          summary={team.summary} 
          id={team._id} 
          />
      ))}
      </div>
      <div>
        <button onClick={goPrevPage} disabled={curPage <= 1}>‹</button>
        <button disabled>{curPage}</button>
        <button onClick={goNextPage} disabled={curPage >= Math.ceil(teamCount / 10)}>›</button>
      </div>
    </>
  )
}
