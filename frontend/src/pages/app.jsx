import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Session from 'react-session-api'
import  { Navigate } from 'react-router-dom'
import '../styles/app.css'
import ServerList from '../components/ServerList';
import ServerView from '../components/ServerView';
import { SocketContext, socket } from '../context/socket';
import { useContext } from 'react';


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
      
      alert("ouihougou")
      socket.emit('register_user', socket.id, sessionStorage.getItem("user"))

    }, [])


    return(

      <SocketContext.Provider value={socket}>
        <div>
          <ProtectedComponent/>
          <div className='app'>
            <div className='sidebar'>
              <div className='username'>{sessionStorage.getItem("user")}</div>
              <ServerList activeServer = {activeServer} handleServerClick={handleServerClick} socket={socket}/>
            </div>
            <div className='main'>
              <ServerView activeServer = {activeServer} socket = {socket}/>
            </div>
          </div>
        </div>
        </SocketContext.Provider>
    )
}

export default App