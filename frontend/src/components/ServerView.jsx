import React, { useState, useEffect } from 'react';

function ServerView({activeServer}){

    const [server, setServer] = useState(null)

    useEffect( () => {
        const fetchServerData = async () => {
            const serverData = await getServerData()
            setServer(serverData)
        }
        fetchServerData()
    }, [activeServer])

    const getServerData = async () => {

        const responseServerData = await fetch('/api/server?server_name=' + activeServer, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        })

      const res = await responseServerData.json();

      if (responseServerData.ok){
        return JSON.parse(res.body)
      }
      else{
        alert("Error fetching server data")
        return
      }

    }

    const renderChannelItems = () => {
        return server.channels.map( (channel) => {
            return <li className='channel-list'>{channel.name}</li>
        })
    }

    return(
        server && <div className='server-view'>
            <div className='channel-list'>{renderChannelItems()}</div>
            <div className='channel-view'></div>
            <div className='member-list'></div>
        </div>
    )
}


export default ServerView