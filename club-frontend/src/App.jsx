import './App.css';
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Auth from './ui/Auth.jsx';
import Registration from './ui/Registration.jsx';
import Dashboard from './ui/Dashboard.jsx';
import Header from './ui/Header.jsx';
import Footer from './ui/Footer.jsx';

function App() {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const auth = JSON.parse(window.localStorage.getItem('auth'));
    if (auth) {
      if(auth.user.role === 'none') {
        navigate('/registration');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/auth/login');
    }
  }, []);

  return (
    <>
      <Header/>
      <main>
        <div>
          <Routes>
            <Route path="/auth/login" element={<Auth/>}></Route>
            <Route path="/auth/signup" element={<Auth/>}></Route>
            <Route path="/registration" element={<Registration/>}></Route>
            <Route path="/dashboard" element={<Dashboard/>}></Route>
            <Route path="/member/schedule" element={<Dashboard/>}></Route>
          </Routes>
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default App;
