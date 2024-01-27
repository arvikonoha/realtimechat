import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faMessage } from '@fortawesome/free-solid-svg-icons'

library.add(fas, faMessage)

const AuthUsers = ({users, userSelected, selectedUserId}) => {
    const onUserSelected = (user) => () => userSelected(user)
    return users.length ? <ul className="user-list">
        <h2>Active users</h2>
        {users.map(user => <li key={user.id} className={`${user.id === selectedUserId?'selected-user':''}`}> <p>{user.name}</p>{user.id !== selectedUserId ? <button className='user-select' onClick={onUserSelected(user)}><FontAwesomeIcon icon="fa-solid fa-message" /></button>: null } </li>)}
    </ul> : null
}

export default AuthUsers;