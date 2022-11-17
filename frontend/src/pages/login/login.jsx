import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css';
import md5 from 'md5';

function Login() {

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [accountCreationSuccess, setAccountCreationSuccess] = useState([false,""])
    const [accountCreationError, setAccountCreationError] = useState("")

    const handleSignUp = async (event) => {
      event.preventDefault();

      if(username === undefined || username === null || username === "" 
        || password=== undefined || password === null || password === "" ){
          setAccountCreationSuccess((false, ''));
          setAccountCreationError("fill in every field")
          return
      }

      const responseAccountCreation = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': username, 'password': md5(password)})
      })
      
      const res = await responseAccountCreation.json();

      alert(res.body)

      if (responseAccountCreation.ok){
        setAccountCreationSuccess([true, res.body])
      }
      else{
       setAccountCreationSuccess([false, ""])
       setAccountCreationError(res.body)
      }

    }


    return(
    <div className='app-wrapper'>
        <div className="login-wrapper p-5 shadow">
        <h1>Log In</h1>
        <form className='d-flex flex-column align-items-center'>
          <label>
            <p>Username</p>
            <input type="text" value={username} onChange={e => setUserName(e.target.value)}/>
          </label>
          <label>
            <p>Password</p>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
          </label>
          <div className="align-self-start">
            <button type="submit" className='mt-3 btn btn-primary '>Sign in</button>
          </div>
          <div onClick={handleSignUp} className="align-self-start">
            <p className='mt-3 button-sign-up'>No account ? Sign up 👈🏻</p>
          </div>
          { !accountCreationSuccess[0] && accountCreationError.length > 0 &&
            <div>
              <p className='mt-2 alert alert-danger'>Error : {accountCreationError}</p>
            </div>
          }

          { accountCreationSuccess[0] && 
            <div>
              <p className='mt-2 alert alert-success'>Account {accountCreationSuccess[1]} successfully created</p>
            </div>
          } 

        </form>
      </div>
    </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };

export default Login