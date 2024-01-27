import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

library.add(fas, faPaperPlane)
const { useState } = require("react")

const ChatInput = ({sendMessage, chatDisabled}) => {
    const [message, setMessage] = useState('')
    const onInputChange = (e) => setMessage(e.target.value)
    const onFormSubmit = (e) => {
        e.preventDefault()
        if (message) {
            sendMessage(message)
            setMessage('')
        }
    }
    return <form onSubmit={onFormSubmit} className="chat-input">
        <input value={message} onChange={onInputChange} disabled={chatDisabled} />
        <button type='submit'><FontAwesomeIcon icon="fa-solid fa-paper-plane" /></button>
    </form>
}

export default ChatInput