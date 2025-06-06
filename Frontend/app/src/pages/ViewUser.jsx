import React from 'react'
import { useEffect, useState , useRef} from 'react';
import { useParams } from 'react-router-dom';
import NavBar from "./NavBar"
import TeamOverview from './TeamOverview';
import { useSearchParams } from 'react-router-dom';

import { deleteTeam } from '../utils/deleteTeam';
import { useNavigate } from 'react-router-dom';

import {API_BASE_URL} from "../global"

import Swal from 'sweetalert2';

export default function ViewUser() {
  const params = useParams();
  const user = params.username
  const [data, setData] = useState('')
  const [dataJson, setDataJson] = useState({})
  const [teamCount, setTeamCount] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams();
  const [curPage, setCurPage] = useState(1)
  const [refresh, setRefresh] = useState(false)
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const goToPage = (newPage) => {
    const clamped = Math.max(1, Math.min(newPage, Math.ceil(teamCount / 10)));
    searchParams.set('page', clamped);
    setSearchParams(searchParams);  
  };

  const goNextPage = () => {goToPage(curPage+1)}
  const goPrevPage = () => {goToPage(curPage-1)}

  const deleteTeamHere = (id) => deleteTeam(id, API_BASE_URL,setRefresh, refresh, "", null )
  
  const handleSearch =() =>
  {
    if (userSearch){
      searchParams.set('search', userSearch);
      setSearchParams(searchParams);  
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
    searchParams.delete('page');
    setSearchParams(searchParams);
    setCurPage(1)
  }
  
  useEffect(() =>{
    const func = async () => {
    try {
        const page = parseInt(searchParams.get('page'));
        const search = searchParams.get('search');
        
        const url = new URL(`${API_BASE_URL}/data/getTeams/${user}`);
        if (page) {
          url.searchParams.append('page', page);
          setCurPage(page)
        }  
        if (search){
          url.searchParams.append('search', search);
        }
        setLoading(true);
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
    } finally {
      setLoading(false)
    }}
    func();
    window.scrollTo(0, 0);
  }, [searchParams, refresh])
  return (
    <>
      <NavBar />
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: "1rem" }}>{user}'s Teams</div>
      {loading ?  <div className='errorText'>Loading ...</div> : <>
      <div>
      <input
          id="username"
          type="text"
          value={userSearch}
          onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault(); handleSearch(); }}}
          onChange={(e) => setUserSearch(e.target.value)}
          placeholder="Search"
          style={{ width: "30%",fontSize: '1.4rem', marginBottom: "15px"  }}
      />
      <button onClick={handleSearch} style={{fontSize: '1.2rem' , padding: '0.4rem'}}>🔍</button></div>
      { data && (<div>{data}</div>) }
      {(teamCount == 0) && (<div style={{ fontSize: '1rem'}}>No Teams Found </div>)}
      <div  style = {{display: 'inline-flex', flexDirection: 'column', gap: '15px'}}>
      
      {dataJson.teams && dataJson.teams.length > 0 && 
        dataJson.teams.map((team) => (

          <div key={team._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
 
            <TeamOverview 
              
              name={team.name} 
              summary={team.summary} 
              id={team._id} 
            />
            {user == localStorage.getItem("username") &&
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick = {() => {navigate("/editTeam/"+team._id)}} >✏️</button>
              <button onClick={() => deleteTeamHere(team._id)} >🗑️</button>
            </div>}
          </div>

      ))}

      </div>
      <div>
        <button onClick={goPrevPage} disabled={curPage <= 1}>‹</button>
        <button disabled>{curPage}</button>
        <button onClick={goNextPage} disabled={curPage >= Math.ceil(teamCount / 10)}>›</button>
      </div>
      </>}
    </>
  )
}
