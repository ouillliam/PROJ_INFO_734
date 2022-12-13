import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Session from 'react-session-api'


function ServerList(){
    const [serverList, setServerList] = useState([])

    return (
        <div>
            <button type="submit"  onClick={handleSignIn} className='mt-3 btn btn-primary '>Create Server</button>
        </div>
    )
}

export default ServerList