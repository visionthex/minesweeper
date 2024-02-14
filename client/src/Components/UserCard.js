import React, { useState } from 'react';
import '../Styles/UserName.css';

function Login() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <div className="user-card">
        <button onClick={handleLogout}>X</button>
        <h2>{username}</h2>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <input type="submit" value="Login" />
    </form>
  );
}

export default Login;