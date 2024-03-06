import { useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { socketSingleton } from '../socket';
import axiosInstance from "../utils/axiosInstance"
import ChatInput from "./ChatInout"

library.add(fas, faMessage)

const ChatDisplay = ({currentUserId, userSelected, roomSelected, isAuthenticated, isConnected, setMessages, messages}) => {
    const displayRef = useRef()
    const scrollToBottom = () => {
        displayRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const sendMessage = (content) => {
        if (isConnected) socketSingleton.socket.emit('chat:send', {content, to: userSelected?.id, targetRoom: roomSelected ? roomSelected.id: null}, (data) => {
            setMessages(messages => [data, ...messages])
        })
      }
    useEffect(() => {
    
        if ((roomSelected || userSelected)) {
          
          const chatType = roomSelected ? 'by-room' : 'by-id';
          const query = roomSelected ? ({project: 'chat', room: roomSelected.id}) : ({project: 'chat', from: userSelected.id, to: currentUserId})

          axiosInstance.get(`/messages/${chatType}`,{params: query})
          .then((response) => {
            const {data: {messages = []}} = response;
            setMessages(messages)
          })
          .catch(console.log)
        }

        return () => {
            setMessages([])
        }
      }, [isAuthenticated, userSelected, roomSelected, currentUserId, setMessages]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return userSelected || roomSelected ? <><ul className="chat-display">
        {
            messages.map((message) => <li className={`${currentUserId !== message.from._id?'external-message':''}`} key={message._id}>
                <span className="author">{message.from.name}</span>
                {message.content}
            </li>)
        }
    </ul> 
    <ChatInput sendMessage={sendMessage} />
    </>: <div className="welcome-note">
        <div className="content">
            <h2>Welcome</h2>
            {
                isAuthenticated ? 
                <p>Chat with your friends by pressing 
                    <span style={{display: 'flex'}} className='chat-icon'>
                        <FontAwesomeIcon icon="fa-solid fa-message" />
                    </span> 
                </p>: 
                <p>Log into your account to chat with your friends</p>
            }
        </div>
    </div>
}

export default ChatDisplay