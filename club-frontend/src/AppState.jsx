
import React, { useReducer } from 'react';

function reducer(state, action) {
  let newState;
  let auth;
  switch (action.type) {
    case 'auth':
      newState = { ...state, ...action.payload };
      return newState;
    case 'logout':
      window.localStorage.removeItem('auth');

      newState = { ...state, user: null };
      return newState;
    case 'user_updated':
      auth = JSON.parse(window.localStorage.getItem('auth'));
      auth.user = action.payload.user;
      window.localStorage.setItem('auth', JSON.stringify(auth));

      newState = { ...state, ...action.payload};
      return newState;
    case 'member_updated':
      newState = { ...state, ...action.payload};
      return newState;
    case 'member_registered':
      auth = JSON.parse(window.localStorage.getItem('auth'));
      auth.user.role = 'member';
      window.localStorage.setItem('auth', JSON.stringify(auth));

      state.user.role = 'member';
      newState = { ...state, ...action.payload };
      return newState;
    case 'trainer_application_submitted':
      newState = { ...state, ...action.payload };
      return newState;
    case 'resource_fetched':
      newState = { ...state, ...action.payload };
      return newState;
    default:
      return state;
  }
}

// AppContext
const AppContext = React.createContext(null);

// AppState Component
export const AppState = (props) => {
  // INITIAL STATE
  let initialState = {
    url: 'http://localhost:3000',
    user: {
      id: null,
      username: null,
      first_name: null,
      last_name: null,
      email: null,
      role: null
    }
  }

  let auth = window.localStorage.getItem('auth');
  if (auth) {
    auth = JSON.parse(auth);
    initialState = auth;  
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <AppContext.Provider value={{state, dispatch}}>
      {props.children}
    </AppContext.Provider>
  )
}

// useAppState hook
export const useAppState = () => {
  return React.useContext(AppContext);
}
