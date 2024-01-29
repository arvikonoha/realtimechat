import React, { useState, useEffect } from 'react';
import { socketSingleton } from './socket';
import ChatInput from './components/ChatInout';
import ChatDisplay from './components/ChatDisplay';
import './App.css'
import AuthModal from './components/AuthModal';
import axiosInstance from './utils/axiosInstance';
import AuthUsers from './components/AuthUsers';

function App() {
  const [isConnected, setIsConnected] = useState(socketSingleton?.socket?.connected);
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [authUser, setAuthUser] = useState(null)

  const userSelected = (user) => setCurrentUser(user)

  const setAuthToken = (token) => {
    try {
      localStorage.setItem('token', token)
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
      socketSingleton.updateToken(token)
      setAuthenticated(true)
    } catch (error) {
      console.log('What went wrong ', error)
    }
  }

  const sendMessage = (content) => {
    if (isConnected) socketSingleton.socket.emit('chat:send', {content, to: currentUser.socketID, targetUserID: currentUser.id}, (data) => {
      if (socketSingleton.socket.id !== currentUser.socketID) setCurrentUser({...currentUser, messages: [data, ...currentUser.messages]})
    })
  }

  const logOut = () => {
    localStorage.removeItem('token')
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
    
    const onMessage = (message) => {
        setCurrentUser(currentUser => currentUser?.id === message.from?({...currentUser, messages: [message, ...currentUser.messages]}):currentUser)
        setUsers(users => users.map(
          user => user.id === message.from 
            ? ({...user, messages: [message,...user.messages]})
            : user
          )
        )
    }
  
    const onUsersList = (users) => {
      setCurrentUser(null)
      const authUser = users.find(user => user.socketID === socketSingleton.socket.id)
      setAuthUser(authUser)
      setUsers(users)
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

    const onUserDisconnected = (disconnectedUser) => {
      setUsers(users => users.filter(user => user.id === disconnectedUser.id))
    }

    const onConnect = () => {
      setIsConnected(true) 
      socketSingleton.socket.on('chat:reply', onMessage)
      socketSingleton.socket.on('users', onUsersList);
      socketSingleton.socket.on('user connected', onUserConnected);
      socketSingleton.socket.on('user disconnected', onUserDisconnected);
    };
  
    const onDisconnect = () => { 
      setIsConnected(false);
      socketSingleton.socket.off('chat:reply', onMessage)
      socketSingleton.socket.off('users', onUsersList);
      socketSingleton.socket.off('user connected', onUserConnected);
      socketSingleton.socket.off('user disconnected', onUserDisconnected);
    }
  
    const deregisterSocketEvents = () => { 
      socketSingleton.socket.off('disconnect', onDisconnect);
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
      const token = localStorage.getItem('token')
      if (token !== null) {
        setAuthToken(token)
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="App landing-screen">
      <AuthModal isAuthenticated={isAuthenticated} logOut={logOut} setAuthToken={setAuthToken} />
      <AuthUsers selectedUserId={currentUser?.id} userSelected={userSelected} users={users}/>
      <ChatDisplay currentUserId={authUser?.id} messages={currentUser&&currentUser.messages?currentUser.messages:[]} />
      <ChatInput sendMessage={sendMessage} chatDisabled={!isConnected || !isAuthenticated ||!currentUser} />
    </div>
  );
}

export default App;
