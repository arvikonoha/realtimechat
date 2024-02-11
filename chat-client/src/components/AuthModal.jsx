import { useState } from "react"
import axiosInstance from "../utils/axiosInstance"

const AuthModal = ({isAuthenticated, setAuthToken, logOut}) => {
    const [credentials, setCredentials] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    })
    const [validationMessages, setValidationMessages] = useState({
        userName: "",
        password: "",
        confirmPassword: "",
    });
    
    const validateUserName = (name) => {
        const regex = /^[0-9a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{1,20}$/;
        return regex.test(name);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{5,20}$/;
        return regex.test(password);
    };
    
    const [authType, setAuthType] = useState('REGISTER')
    const authenticate = async (e) => {
        e.preventDefault()
        const userNameValid = validateUserName(credentials.name);
        const passwordValid = validatePassword(credentials.password);
    
        if (!userNameValid) {
          setValidationMessages((prevMessages) => ({
            ...prevMessages,
            userName: "Invalid user name. Please use only allowed characters.",
          }));
          return false;
        }
    
        if (!passwordValid) {
          setValidationMessages((prevMessages) => ({
            ...prevMessages,
            password:
              "Invalid password. Password must be 5-20 characters with at least one uppercase letter, one lowercase letter, one number, and one symbol.",
          }));
          return false;
        }
    
        if (authType === "REGISTER" && credentials.confirmPassword !== credentials.password) {
          setValidationMessages((prevMessages) => ({
            ...prevMessages,
            confirmPassword: "Password and Confirm password are not matching!",
          }));
          return false;
        }
        
        if (authType === 'REGISTER') {
            if(credentials.confirmPassword !== credentials.password) alert('Password and Confirm password are not matching!')
            else {
                try {
                    const authDetails = await axiosInstance.post('/auth/register', credentials);
                    setAuthToken(authDetails.data.token)
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
                alert('Invalid username or password')
            } 
        }
    }

    const onInputChange = (e) => {
        setValidationMessages({
            userName: "",
            password: "",
            confirmPassword: "",
        });
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const changeAuthType = (authType) => () => {
        setValidationMessages({
            userName: "",
            password: "",
            confirmPassword: "",
        });
        setAuthType(authType)
    }

    const onLogOut = () => logOut()

    if(isAuthenticated) return <button className="log-out" onClick={onLogOut}>Log out</button>
    return <form onSubmit={authenticate} className="auth-modal">
        <h2>{authType === 'REGISTER'?'Register as a new user': 'Login to your account'}</h2>
        <input placeholder="User name" onChange={onInputChange} name='name' value={credentials.name} />
        {validationMessages.userName && authType === 'REGISTER' ? (
        <div className="validation-message">{validationMessages.userName}</div>
      ): null}
        <input type="password" placeholder="Password" onChange={onInputChange} name='password' value={credentials.password} />
        {validationMessages.password && authType === 'REGISTER' ? (
        <div className="validation-message">{validationMessages.password}</div>
      ): null}
        {
            authType === 'REGISTER' ? <>
            <input type="password" placeholder="Confirm password" onChange={onInputChange} name='confirmPassword' value={credentials.confirmPassword} /> 
                {validationMessages.confirmPassword && (
                    <div className="validation-message">{validationMessages.confirmPassword}</div>
                )}
            </>
            : null
        }
        <p className="helper-text">{authType === 'REGISTER'? 'Already have an account ? ': 'Don\'t have an account? '}
            <button type="button" className="link-button" onClick={authType === 'REGISTER'?changeAuthType('LOGIN'):changeAuthType('REGISTER')}>Press this</button>
        </p>
        <button type="submit">Submit</button>
    </form>
}
export default AuthModal;