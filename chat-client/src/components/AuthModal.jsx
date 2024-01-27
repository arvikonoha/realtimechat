import { useState } from "react"
import axiosInstance from "../utils/axiosInstance"

const AuthModal = ({isAuthenticated, setAuthToken, logOut}) => {
    const [credentials, setCredentials] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    })
    const [authType, setAuthType] = useState('REGISTER')
    const authenticate = async (e) => {
        e.preventDefault()
        if (authType === 'REGISTER') {
            if(credentials.confirmPassword !== credentials.password) alert('Password and Confirm password are not matching!')
            else {
                try {
                    const authDetails = await axiosInstance.post('/auth/register', credentials);
                    setAuthToken(authDetails.token)
                } catch (error) {
                    console.log(error)
                    alert('Something went wrong')
                }
            }
        } else {
            try {
                delete credentials.confirmPassword;
                const authDetails = await axiosInstance.post('/auth/login', credentials);
                setAuthToken(authDetails.data.token)
            } catch (error) {
                console.log(error)
                alert('Something went wrong')
            } 
        }
    }

    const onInputChange = (e) => setCredentials({...credentials, [e.target.name]: e.target.value})

    const changeAuthType = (authType) => () => setAuthType(authType)

    const onLogOut = () => logOut()

    if(isAuthenticated) return <button className="log-out" onClick={onLogOut}>Log out</button>
    return <form onSubmit={authenticate} className="auth-modal">
        <h2>{authType === 'REGISTER'?'Register as a new user': 'Login to your account'}</h2>
        <input placeholder="User name" onChange={onInputChange} name='name' value={credentials.name} />
        <input placeholder="Password" onChange={onInputChange} name='password' value={credentials.password} />
        {
            authType === 'REGISTER' ? <input placeholder="Confirm password" onChange={onInputChange} name='confirmPassword' value={credentials.confirmPassword} /> : null
        }
        <p className="helper-text">{authType === 'REGISTER'? 'Already have an account ? ': 'Don\'t have an account? '}
            <button type="button" className="link-button" onClick={authType === 'REGISTER'?changeAuthType('LOGIN'):changeAuthType('REGISTER')}>Press this</button>
        </p>
        <button type="submit">Submit</button>
    </form>
}
export default AuthModal;