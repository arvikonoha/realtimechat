import { useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faMessage } from '@fortawesome/free-solid-svg-icons'

library.add(fas, faMessage)

const ChatDisplay = ({messages, currentUserId, userSelected, roomSelected, isAuthenticated}) => {
    const displayRef = useRef()
    const scrollToBottom = () => {
        displayRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return userSelected || roomSelected ? <ul className="chat-display">
        {
            messages.map((message, index) => <li className={`${currentUserId !== message.from._id?'external-message':''}`} key={message._id}>
                <span className="author">{message.from.name}</span>
                {message.content}
            </li>)
        }
    </ul> : <div className="welcome-note">
        <div className="content">
            <h2>Welcome</h2>
            {
                isAuthenticated ? 
                <p>Chat with your friends by pressing 
                    <div className='chat-icon'>
                        <FontAwesomeIcon icon="fa-solid fa-message" />
                    </div> 
                </p>: 
                <p>Log into your account to chat with your friends</p>
            }
        </div>
    </div>
}

export default ChatDisplay