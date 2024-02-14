import React, { useState, useEffect } from 'react';
import '../Styles/UserCard.css';

function ScoreCard({ score, time }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  return (
    <div className="score-card">
      <h2><span className="username">{username}</span>Score Card</h2>
      <p>Score: {score}</p>
      <p>Time: {time}</p>
    </div>
  );
}

export default ScoreCard;