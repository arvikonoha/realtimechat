import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import axiosInstance from '../utils/axiosInstance'

library.add(fas, faMessage)

const AuthUsers = ({users, userSelected, selectedUserId, selectedRoomID, rooms, roomSelected, announceRoomCreation}) => {
    const onUserSelected = (user) => () => userSelected(user)
    const onRoomSelected = (room) => () => roomSelected(room)
    const [roomname, setRoomname] = useState('')
    const [validationMessages, setValidationMessages] = useState({
        roomname: ''
    })
    const [isModalVisible, setModalVisible] = useState(false)
    const toggleRoomModal = () => setModalVisible(visibility => !visibility)

    const createroom = (e) => {
        e.preventDefault()
        if (!roomname || roomname.length < 5) {
            setValidationMessages({
                roomname: 'Enter a room name with atleast 5 characters.'
            })

            return;
        }
        axiosInstance.post('/rooms', {name: roomname})
        .then((newRoom) => {
            setRoomname('')
            setModalVisible(false)
            announceRoomCreation({name: newRoom.name, id: newRoom._id})
        })
    }

    const onInputChange = (e) => {
        setRoomname(e.target.value)
    }
    return <> {
        users.length ?
        <ul className="user-list">
            <h2>Active users</h2>
            {users.map(user => <li key={user.id} className={`${user.id === selectedUserId?'selected-user':''}`}> <p>{user.name}</p>{user.id !== selectedUserId ? <button className='user-select' onClick={onUserSelected(user)}><FontAwesomeIcon icon="fa-solid fa-message" /></button>: null } </li>)}
        </ul> : null
    } 
    <ul className="room-list">
    {
        users.length ? <h2 style={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>
            <span style={{display: 'block'}}>Rooms</span>
            <button onClick={toggleRoomModal}>{ isModalVisible ? 'Cancel': 'Create room'}</button>
        </h2> : null
    }
    { 
        rooms.length ?
        rooms.map(room => 
            <li key={room.id} className={`${room.id === selectedRoomID?'selected-user':''}`}>
                <p>{room.name}</p>{room.id !== selectedRoomID ? 
                <button className='rooms-select' onClick={onRoomSelected(room)}><FontAwesomeIcon icon="fa-solid fa-message" /></button>: null } </li>)
        : null
    }
    </ul>
    {
        isModalVisible ? <form onSubmit={createroom} className="room-modal">
        <h2>Create new room</h2>
        <input placeholder="Room name" onChange={onInputChange} name='roomname' value={roomname} />
        {
            validationMessages.roomname 
            ? <div className="validation-message">{validationMessages.userName}</div> 
            : null
        }
        <button type="submit">Submit</button>
        </form> : null
    }
    
    </>
}

export default AuthUsers;