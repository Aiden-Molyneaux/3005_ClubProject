import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../AppState.jsx';
import { login, signup } from '../util/helper.js';

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
      dispatch({ type: 'auth', payload: { user: { ...userData } }});

      window.localStorage.setItem('auth', JSON.stringify({ url: 'http://localhost:3000', user: { ...userData } }));
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
      attemptLogin().then((user) => setUserData(user));
    } else {
      attemptSignup().then((user) => setUserData(user));
    }
  }

  function attemptLogin() {
    return login({...loginFormData});
  }
  
  function attemptSignup() {
    return signup({...signupFormData});
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
