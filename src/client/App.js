import React, { useState, useEffect } from 'react';
import socket from './socket';
import './App.css';
import './Reveal.css';

function App() {
  const [users, setUsers] = useState({});
  const [userVote, setUserVote] = useState(null);
  const [username, setUsername] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const userId = socket.id;

  useEffect(() => {
    // Receber a lista de usuários do servidor e atualizar o estado
    socket.on('users', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    // Receber a notificação de revelação de votos
    socket.on('revealVotes', () => {
      setRevealed(true);
    });

    // Receber a notificação de limpeza de votos
    socket.on('clearVotes', () => {
      setRevealed(false);
      setUserVote(null);
    });

    return () => {
      socket.off('users');
      socket.off('revealVotes');
      socket.off('clearVotes');
    };
  }, []);

  const handleVote = (value) => {
    setUserVote(value);
    socket.emit('vote', { userId, vote: value });
  };

  const handleReveal = () => {
    socket.emit('revealVotes');
  };

  const handleClear = () => {
    setUserVote(null);
    socket.emit('clearVotes');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setNameSubmitted(true);
    socket.emit('join', username);
  };

  return (
    <div className="container">
      {!nameSubmitted ? (
        <form onSubmit={handleNameSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Join</button>
        </form>
      ) : (
        <>
          <h1>Scrum Poker</h1>
          <div className="button-container">
            {[1, 2, 3, 5, 8, 13, 21, 34].map((num) => (
              <button
                key={num}
                onClick={() => handleVote(num)}
                className={userVote === num ? 'selected' : ''}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="actions">
            <button className="reveal" onClick={handleReveal}>
              Reveal Votes
            </button>
            <button className="clear" onClick={handleClear}>
              Clear Votes
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Estimation</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(users).map(([id, user]) => (
                  <tr key={id}>
                    <td>{user.username}</td>
                    <td>
                      {user.vote === null
                        ? "?"
                        : revealed
                        ? user.vote
                        : "V"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
