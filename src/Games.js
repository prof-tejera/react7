import React from 'react';
import AppProvider, { AppContext } from './context/AppProvider';
import './App.css';
import styled from 'styled-components';

const Message = styled.div`
  position: absolute;
  top: 20px;
  background-color: #791f7c;
  border-radius: 5px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px 20px;
  width: 300px;
  margin-left: -150px;
  text-align: center;
  left: 50%;
`;

const Games = () => {
  const { message, games, selectedGame, setSelectedGame } = React.useContext(AppContext);

  // Return selected game
  const game = games.find(g => g.id === selectedGame);
  const Game = game ? game.component : null;

  return (
    <div>
      {message && <Message>{message}</Message>}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Games</div>
        <select value={selectedGame} onChange={e => setSelectedGame(e.target.value)}>
          <option value="">Select a game</option>
          {games.map(g => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 20 }}>{game && <Game />}</div>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Games />
    </AppProvider>
  );
};

export default App;
