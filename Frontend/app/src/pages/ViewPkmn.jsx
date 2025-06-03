import {React, useState} from 'react'

import {API_BASE_URL} from "../global"

const imagePath = API_BASE_URL + "/data" +"/sprite/"

export default function ViewPkmn({data, summary, copy}) {
  const [textMode, setTextMode] = useState(true)
  const switchMode = () => {
    setTextMode(!textMode)
  }
  function FormatVals({vals, name}) {
    const colors = ["#60d16b", "#eb4949", "#4984eb", "#8b60d1", "orange", "#ebda49"]
    return <span>
      {name}
      {
      Object.entries(vals).map(([key, value], index) => {
        return <span style = {{color: colors[index]}}>{value + '  '}</span>
      })
      }
    </span>
  }
  function MoveGrid({moves}){
    return (
      <div style = {{
            display: "grid",
            gridTemplateColumns: "1fr", 
            gap: "8px",
            padding: "8px 4px",
      }}>
      {moves.map((text, index) => (
        <div
          key={index}
          style = {{border: "2px solid white",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2px 5px",
          backgroundColor: "#333", }}>
          {text}
        </div>
      ))}
    </div>
    )
  }
  return (
    <div style = {{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 'fit-content',
      border: '2px solid white',
      fontSize: '1.2rem',
      padding: '10px 5px',
      minWidth: "300px",
      

    }}>
      <span style = {{fontSize:"1.4rem", fontWeight: "bold"}}>{data.species} {data.gender && `(${data.gender})`}</span>
     <span>{data.name ? data.name : data.species}</span>
      <button style = {{fontSize: "1rem", padding:'5px 20px', backgroundColor: "#383f4a"}}
      onClick = {switchMode}>
        {textMode ? "Copy" : "View"}
      </button>
      <img
        src={imagePath + summary[1]}
        alt={data.species}
        style={{ width: '160px', height: '160px', objectFit: 'contain' }}

      />
      {textMode ? 
      <>
      {data.level && <span>Level: {data.level}</span>}
      {data.item && <span>Item: {data.item}</span>}
      {data.ability && <span>Ability: {data.ability}</span>}
      {data.nature && <span>Nature: {data.nature}</span>}
      {data.teraType && <span>TeraType: {data.teraType}</span>}
      {data.evs && <FormatVals vals={data.evs} name = {"Evs: "}/>}
      {data.ivs && <FormatVals vals={data.ivs} name = {"Ivs: "}/>}
      {data.moves && <MoveGrid moves={data.moves}/>}
      </>
        :
         
        <textarea
        value = {copy }
        readOnly
        style = {{
          width: "300px",
          height: "200px",
          fontSize: "14px"
        }}
      />
      }
      
    </div>
  )
}
