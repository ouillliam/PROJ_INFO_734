import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css'

function Login() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    return(
    <div className='app-wrapper'>
        <div className="login-wrapper p-5 shadow">
        <h1>Log In</h1>
        <form className='d-flex flex-column'>
          <label>
            <p>Username</p>
            <input type="text" onChange={e => setUserName(e.target.value)}/>
          </label>
          <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
          </label>
          <div>
            <button type="submit" className='mt-3 btn btn-primary'>Sign in</button>
          </div>
          <div>
            <p className='mt-3 button-sign-up'>No account ? Sign up 👈🏻</p>
          </div>
        </form>
      </div>
    </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };

export default Login