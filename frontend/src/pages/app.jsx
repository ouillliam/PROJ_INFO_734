import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Session from 'react-session-api'
import  { Navigate } from 'react-router-dom'
import '../styles/app.css'
import ServerList from '../components/ServerList';

function App() {

    const ProtectedComponent = () => {

        if (sessionStorage.getItem("user") != "test")
          return <Navigate replace to='/' />

        return
      }
    

    return(

        <div>
          <ProtectedComponent/>
          <div className='app'>
            <div className='sidebar'>
              <ServerList/>
            </div>
            <div className='main'></div>
          </div>
        </div>
    )
}

export default App