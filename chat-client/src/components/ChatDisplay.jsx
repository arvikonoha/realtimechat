import { useEffect, useRef } from "react"

const ChatDisplay = ({messages, currentUserId}) => {
    const displayRef = useRef()
    const scrollToBottom = () => {
        displayRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return <ul className="chat-display">
        {
            messages.map((message, index) => <li className={`${currentUserId !== message.from?'external-message':''}`} key={message.id}>{message.content}</li>)
        }
    </ul>
}

export default ChatDisplay