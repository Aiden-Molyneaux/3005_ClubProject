import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../AppState.jsx';

function Auth() {
  const navigate = useNavigate();

  const { dispatch } = useAppState();

  const [authType, setAuthType] = useState('login');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: ''
  });
  const [signupFormData, setSignupFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '@hotmail.com'
  });
  
  useEffect(() => {
    if (window.localStorage.getItem('auth')) {
      navigate('/registration');
    }
  });

  useEffect(() => {
    if (userData) {
      dispatch({ type: 'auth', payload: { 
        user: {
          id: userData.id,
          username: userData.username,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          role: userData.role
        }
      }});

      window.localStorage.setItem('auth', JSON.stringify({ url: 'http://localhost:3000', user: {...userData} }));
      navigate('/registration');
    }
  }, [userData]);

  function handleChange(event) {
    if (authType === 'login') {
      setLoginFormData({ ...loginFormData, [event.target.name] : event.target.value });
    } else {
      setSignupFormData({ ...signupFormData, [event.target.name] : event.target.value });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if(authType === 'login') {
      submitLogin().then((user) => setUserData(user));
    } else {
      submitSignup().then((user) => setUserData(user));
    }
  }

  function submitLogin() {
    return axios.post('http://localhost:3000/auth/login', {
      username: loginFormData.username,
      password: loginFormData.password,
    })
      .then(response => {
        console.group('Login successful:', response);
        return response.data.user;
      })
      .catch(error => {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
      });
  }
  
  function submitSignup() {
    return axios.post('http://localhost:3000/auth/signup', {
      username: signupFormData.username,
      password: signupFormData.password,
      firstName: signupFormData.firstName,
      lastName: signupFormData.lastName,
      email: signupFormData.email,
    })
      .then(response => {
        console.group('Sign-up successful:', response.data);
        return response.data.user;
      })
      .catch(error => {
        console.error('Sign-up error:', error);
        setError('Sign-up failed. Please try again.');
      });
  }

  return (
    <>
      {authType === 'login' &&
        <form className='authForm' onSubmit={handleSubmit}>
          <h3>Sign-in</h3>
          <div className='horizontalLine'></div>
          <div>
            <label>Username:</label>
            <input type='text' name='username' value={loginFormData.username} onChange={handleChange}/>
          </div>

          <div>
            <label htmlFor='password'>Password:</label>
            <input type='text' name='password' value={loginFormData.password} onChange={handleChange}/>
          </div>

          <button className='topMargin' type='submit'>Login-in</button>
          
          <>
            <div className='horizontalLine'></div>
            <button className='topMargin' onClick={() => setAuthType('signup')}>
              <Link to='/auth/signup'>or Sign-up</Link>
            </button>
          </>

          {error && <p>{error}</p>}
        </form>
      }

      {authType === 'signup' &&
        <form className='authForm' onSubmit={handleSubmit}>
          <h3>Sign-up</h3>
          <div className='horizontalLine'></div>
          <div>
            <label htmlFor='username'>Username:</label>
            <input type='text' name='username' value={signupFormData.username} onChange={handleChange}/>
          </div>

          <div>
            <label htmlFor='password'>Password:</label>
            <input type='text' name='password' value={signupFormData.password} onChange={handleChange}/>
          </div>

          <div>
            <label htmlFor='firstName'>First Name:</label>
            <input type='text' name='firstName' value={signupFormData.firstName} onChange={handleChange}/>
          </div>

          <div>
            <label htmlFor='lastName'>Last Name:</label>
            <input type='text' name='lastName' value={signupFormData.lastName} onChange={handleChange}/>
          </div>

          <div>
            <label htmlFor='email'>Email:</label>
            <input type='text' name='email' value={signupFormData.email} onChange={handleChange}/>
          </div>

          <button className='topMargin' type='submit'>Sign-up</button>

          <>
            <div className='horizontalLine'></div>
            <button className='topMargin' onClick={() => setAuthType('login')}>
              <Link to='/auth/login'>or Login</Link>
            </button>
          </>

          {error && <p>{error}</p>}
        </form>
      }
    </>
  );
}

export default Auth;
