import React, { useState, useEffect } from 'react';

function ServerView({activeServer}){

    const [server, setServer] = useState()
    const [activeChannel, setActiveChannel] = useState()
    const [newChannel, setNewChannel] = useState()

    useEffect( () => {
        const fetchServerData = async () => {
            if (activeServer === null ) return
            const serverData = await getServerData()
            setServer(serverData)
            setActiveChannel(null)
            setNewChannel("")
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
            if(channel.name === activeChannel){
                return <li className='channel-list active-channel' onClick={() => {setActiveChannel(channel.name)}}>{channel.name}</li>
            }
            
            return <li className='channel-list' onClick={() => {setActiveChannel(channel.name)}}>{channel.name}</li>
        })
    }

    const handleAddChannel = async (e) => {
        e.preventDefault()

        if(newChannel === "" || newChannel === null || newChannel === undefined) return

        const responseServerData = await fetch('/api/server', {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body : JSON.stringify({"new_channel" : newChannel, "server_name" : activeServer})
        })

      const res = await responseServerData.json();


      if (responseServerData.ok){
        setServer(res)
        return
      }
      else{
        alert("Error fetching server data")
        return
      }
    }

    return(
        server && <div className='server-view'>
            <div className='channel-list'>
                <div className='servername'>{server.name}</div>
                <form className='d-flex flex-column align-items-center '>
                <label>
                    <p>Channel name</p>
                    <input className='w-100' type="text" value={newChannel} onChange={(e) => setNewChannel(e.target.value)}/>
                </label>
                <button type="submit" className='btn btn-primary w-100' onClick={handleAddChannel}>+ Add channel</button>
                </form>
                <ul>{renderChannelItems()}</ul>
            </div>
            <div className='channel-view'></div>
            <div className='member-list'></div>
        </div>
    )
}


export default ServerView