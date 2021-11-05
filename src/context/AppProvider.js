import React, { useState } from 'react';
import { usePersistedState } from '../hooks';

import Memotest from '../games/Memotest';
import Puzzle from '../games/Puzzle';

export const AppContext = React.createContext({});

const AppProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [selectedGame, setSelectedGame] = usePersistedState('games-selected', null);

  return (
    <AppContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        message,
        setMessage: m => {
          setMessage(m);
          setTimeout(() => setMessage(null), 3000);
        },
        games: [
          {
            id: 'memotest',
            name: 'Memotest',
            component: Memotest,
          },
          {
            id: 'puzzle',
            name: 'Puzzle',
            component: Puzzle,
          },
        ],
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
