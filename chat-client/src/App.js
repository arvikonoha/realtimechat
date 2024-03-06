import React, { useState, useEffect } from 'react';
import { socketSingleton } from './socket';
import ChatDisplay from './components/ChatDisplay';
import './App.css'
import AuthModal from './components/AuthModal';
import axiosInstance from './utils/axiosInstance';
import AuthUsers from './components/AuthUsers';

function App() {
  const [isConnected, setIsConnected] = useState(socketSingleton?.socket?.connected);
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [users, setUsers] = useState([])
  const [rooms, setRooms] = useState([])
  const [authUser, setAuthUser] = useState(null)
  const [messages, setMessages] = useState([]);

  const userSelected = (user) => {
    setCurrentRoom(null)
    setCurrentUser(user)
  }

  const roomSelected = (room) => {
    setCurrentUser(null)
    setCurrentRoom(room)
  }

  const announceRoomCreation = (room) => {
    socketSingleton.socket.emit('room:created', room)
  }

  const setAuthToken = (token) => {
    try {
      localStorage.setItem('rtchat:token', token)
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
      socketSingleton.updateToken(token)
      setAuthenticated(true)
    } catch (error) {
      console.log('What went wrong ', error)
    }
  }

  const logOut = () => {
    localStorage.removeItem('rtchat:token')
    axiosInstance.defaults.headers['Authorization'] = ''
    setAuthenticated(false)
    setUsers([])
    setAuthUser(null)
    setCurrentUser(null)
    if (socketSingleton.socket) {
      socketSingleton.socket.disconnect()
    }
  }

  useEffect(() => {
  
    const onUsersList = (users) => {
      setCurrentUser(null)
      const authUser = users.find(user => user.socketID === socketSingleton.socket.id)
      setAuthUser(authUser)
      setUsers(users)
    }

    const onRoomsList = (rooms) => {
      setCurrentRoom(null)
      setRooms(rooms)
    }

    const onUserConnected = (user) => {
      setUsers(users => {
        const userExists = users.some(existingUser => existingUser.id === user.id)
        if(userExists) {
          return users.map(existingUser => user.id === existingUser.id?({...existingUser, socketID: user.socketID}): existingUser)
        } else {
          return [...users, user]
        }
      })
    }

    const onRoomConnected = (newRoom) => {
      setRooms(rooms => {
        const roomExisits = rooms.some(room => room.id === newRoom.id)
        if(!roomExisits) {
          return [...rooms, newRoom]
        } 
        return rooms;
      })
    }

    const onMessage = (message) => {
      if (message.from._id !== authUser?.id) {
          setMessages(messages => [message, ...messages])
      }
    }

    const onUserDisconnected = (disconnectedUser) => {
      setUsers(users => users.filter(user => user.id !== disconnectedUser.id))
    }

    const onConnect = () => {
      setIsConnected(true) 
      socketSingleton.socket.on('users', onUsersList);
      socketSingleton.socket.on('rooms', onRoomsList);
      socketSingleton.socket.on('chat:reply', onMessage)
      socketSingleton.socket.on('user connected', onUserConnected);
      socketSingleton.socket.on('room connected', onRoomConnected);
      socketSingleton.socket.on('user disconnected', onUserDisconnected);
    };
  
    const onDisconnect = () => { 
      setIsConnected(false);
    }
  
    const deregisterSocketEvents = () => { 
      socketSingleton.socket.off('disconnect', onDisconnect);
      socketSingleton.socket.off('users', onUsersList);
      socketSingleton.socket.off('rooms', onRoomsList);
      socketSingleton.socket.off('user connected', onUserConnected);
      socketSingleton.socket.off('room connected', onRoomConnected);
      socketSingleton.socket.off('chat:reply', onMessage)
      socketSingleton.socket.off('user disconnected', onUserDisconnected);
      socketSingleton.socket.off('connect', onConnect);
    }
  
    const registerSocketEvents = () => {
      socketSingleton.socket.on('connect', onConnect);
      socketSingleton.socket.on('disconnect', onDisconnect);
    }
  
    if (socketSingleton.socket) {
      registerSocketEvents()
      return () => {
        deregisterSocketEvents()
      };
    } else {
      const token = localStorage.getItem('rtchat:token')
      if (token !== null) {
        setAuthToken(token)
      }
    }
  }, [isAuthenticated, users, authUser, authUser?.id]);

  return (
    <div className="App landing-screen">
      <AuthModal isAuthenticated={isAuthenticated} logOut={logOut} setAuthToken={setAuthToken} />
      <AuthUsers announceRoomCreation={announceRoomCreation} rooms={rooms} selectedUserId={currentUser?.id} selectedRoomID={currentRoom?.id} roomSelected={roomSelected} userSelected={userSelected} users={users}/>
      <ChatDisplay messages={messages} setMessages={setMessages} isConnected={isConnected} isAuthenticated={isAuthenticated} roomSelected={currentRoom} userSelected={currentUser} currentUserId={authUser?.id}  />
    </div>
  );
}

export default App;
