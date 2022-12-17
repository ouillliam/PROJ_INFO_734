import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Session from 'react-session-api'
import  { Navigate } from 'react-router-dom'
import '../styles/app.css'
import ServerList from '../components/ServerList';
import ServerView from '../components/ServerView';
import io from 'socket.io-client';

function App() {

    const [activeServer, setActiveServer] = useState(null)

    const handleServerClick = (server) => {
      setActiveServer(server)
    }

    const ProtectedComponent = () => {

        if (sessionStorage.getItem("user") === "" || sessionStorage.getItem("user") === null || sessionStorage.getItem("user") === undefined )
          return <Navigate replace to='/' />

        return
      }

    
    useEffect( () => {
      if(sessionStorage.getItem("user") === "" || sessionStorage.getItem("user") === null || sessionStorage.getItem("user") === undefined ) return
      
      const socket = io("http://127.0.0.1:5000")

      socket.on("connect", () => {
        alert("connected")
      })
  
    }, [])

    
    

    return(

        <div>
          <ProtectedComponent/>
          <div className='app'>
            <div className='sidebar'>
              <div className='username'>{sessionStorage.getItem("user")}</div>
              <ServerList activeServer = {activeServer} handleServerClick={handleServerClick}/>
            </div>
            <div className='main'>
              <ServerView activeServer = {activeServer}/>
            </div>
          </div>
        </div>
    )
}

export default App