import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Session from 'react-session-api'


function ServerList(){
    const [servers, setServers] = useState([])
    const [serverName, setServerName] = useState("")

    useEffect(() =>
       {
        async function fetchServers() {
            const data = await getServers()
            setServers(data)
        } 
        fetchServers()
       }
    , [])

    const getServers = async () => {

        const responseServers = await fetch('/api/server', {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        })

      const res = await responseServers.json();

      if (responseServers.ok){
        return res.body
      }
      else{
        alert("Error fetching servers")
        return
      }

    }


    const handleServerCreation = async (event) => {
        event.preventDefault()

        if( serverName === null || serverName === "" ){
            return
        }

        const responseServerCreation = await fetch('/api/server', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({'serverName': serverName, 'admin' : sessionStorage.getItem("user")})
        })

      const res = await responseServerCreation.json();

      if (responseServerCreation.ok){
        const data = await getServers()
        setServers(data)
      }
      else{
        ;
      }

    }

    return (
        <div>
            <form className='d-flex flex-column align-items-center ps-2 pe-2'>
            <label>
                <p>Server Name</p>
                <input type="text" value={serverName} onChange={e => setServerName(e.target.value)}/>
            </label>
            <button type="submit" onClick={handleServerCreation} className='btn btn-primary w-100'>Create Server</button>
            </form>
            <ul>
                {servers.map((server) =>
                <li>{server}</li>
                )}
            </ul>
        
        </div>
    )
}

export default ServerList