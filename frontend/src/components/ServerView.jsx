import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

function ServerView({activeServer, socket}){


    const [server, setServer] = useState()
    const [activeChannel, setActiveChannel] = useState()
    const [newChannel, setNewChannel] = useState()
    const [newMember, setNewMember] = useState()
    const [newMessage, setNewMessage] = useState()

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
            if(activeChannel && channel.name === activeChannel.name){
                return <li className='channel-list active-channel' onClick={() => {setActiveChannel(channel)}}>{channel.name}</li>
            }
            
            return <li className='channel-list' onClick={() => {setActiveChannel(channel)}}>{channel.name}</li>
        })
    }

    const renderMemberItems = () => {
        console.log(server.members)
        return server.members.map( (member) => {
            if(member.role === "admin"){
                return <li className='member-list admin' >{member.user.login}</li>
            }
            
            return <li className='member-list'>{member.user.login}</li>
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
            body : JSON.stringify({"new_channel" : newChannel, "server_name" : activeServer, "new_member" : "", "channel_to_update" : "", "new_message" : "", "from" : ""})
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

    const handleAddMember = async (e) => {
        e.preventDefault()

        if(newMember === "" || newMember === null || newMember === undefined) return

        const responseServerData = await fetch('/api/server', {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body : JSON.stringify({"new_channel" : "", "server_name" : activeServer, "new_member" : newMember, "channel_to_update" : "", "new_message" : "", "from" : ""})
        })

      const res = await responseServerData.json();


      if (responseServerData.ok){
        socket.emit("add_member", newMember, activeServer )
        setServer(res)
        return
      }
      else{
        alert("Error fetching server data")
        return
      }
    }

    const handleSendNewMessage = async (e) => {

        e.preventDefault()

        if(newMessage === "" ||newMessage === null || newMessage === undefined) return

        const responseServerData = await fetch('/api/server', {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body : JSON.stringify({"new_channel" : "", "server_name" : activeServer, "new_member" : "", "channel_to_update" : activeChannel.name, "new_message" : newMessage, "from" : sessionStorage.getItem("user")})
        })

      const res = await responseServerData.json();

      if (responseServerData.ok){
        setServer(res)
        setActiveChannel(res.channels.find(channel => channel.name == activeChannel.name))
        return
      }
      else{
        alert("Error fetching server data")
        return
      }

    }

    const renderMessageItems = () => {
        return activeChannel && activeChannel.messages.map( (message) => {
            return (<li className='channel-message'>
                {message.content}
            </li>)
        })
    }


    const renderChannelView = () => {

        return (
            activeChannel &&
        <form className='d-flex flex-column align-items-center p-3 justify-content-end'>
                    <label className='w-100'>
                        <input className='w-100' type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                    </label>
                    <button type="submit" className='btn btn-primary w-100' onClick={handleSendNewMessage}>Send Message</button>
        </form>
        )
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
            <div className='channel-view'>
                <ul>{renderMessageItems()}</ul>
                {renderChannelView()}
            </div>
                
            <div className='member-list'>
            <form className='d-flex flex-column align-items-center '>
                <label>
                    <p>User name</p>
                    <input className='w-100' type="text" value={newMember} onChange={(e) => setNewMember(e.target.value)}/>
                </label>
                <button type="submit" className='btn btn-primary w-100' onClick={handleAddMember}>+ Add Member</button>
                </form>
                <ul>{renderMemberItems()}</ul>
            </div>
        </div>
    )
}


export default ServerView