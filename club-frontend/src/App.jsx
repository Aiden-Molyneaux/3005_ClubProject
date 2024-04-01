import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    submitSignup();
  }
  
  function submitSignup() {
    axios.post('http://localhost:3000/auth/signup', {
      username: username,
      password: password,
      first_name: "Timber",
      last_name: "Molyneaux",
      email: "timber@hotmail.com"
    })
    .then(response => {
        console.group("Sign-up successful:", response.data)
    })
    .catch(error => {
        console.error('Sign-up error:', error);
        setError("Sign-up failed. Please try again.");
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={username} onChange={(event) => setUsername(event.target.value)}/>
        </div>

        <div>
          <label>Password:</label>
          <input type="text" name="password" value={password} onChange={(event) => setPassword(event.target.value)}/>
        </div>

        <button type="submit">Sign-up</button>
        {error && <p>{error}</p>}
      </form>
    </>
  );
}

export default App;
