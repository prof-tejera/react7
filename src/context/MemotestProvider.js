import { chunk, shuffle } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import db from '../db';
import { usePersistedState } from '../hooks';
import { AppContext } from './AppProvider';

export const MemotestContext = React.createContext({});

const DIFFICULTY = 4;

const MemotestProvider0 = ({ children }) => {
  const [tries, setTries] = useState(() => {
    return parseInt(localStorage.getItem('tries'), 10) || 0;
  });
  const [firstTileId, setFirstTileId] = useState(null);
  const [secondTileId, setSecondTileId] = useState(null);
  const [discoveredTiles, setDiscoveredTiles] = useState([]);
  const [tiles, setTiles] = useState(null);

  useEffect(() => {
    // Already generated
    if (tiles) return;

    const positions = [];

    // Generate order
    for (let p = 0; p < (DIFFICULTY * DIFFICULTY) / 2; p++) {
      positions.push(p);
      positions.push(p);
    }

    const shuffled = shuffle(positions);

    // Generate tiles
    setTiles(
      shuffled.map((p, i) => ({
        index: i,
        id: db[p].id,
        img: db[p].urls.small,
      })),
    );
  }, [setTiles, tiles]);

  const reset = useCallback(() => {
    setFirstTileId(null);
    setSecondTileId(null);
    setDiscoveredTiles([]);
    setTries(0);
    setTiles(null);
  }, [setDiscoveredTiles, setFirstTileId, setSecondTileId, setTiles, setTries]);

  useEffect(() => {
    localStorage.setItem('tries', tries);
  }, [tries]);

  useEffect(() => {
    if (discoveredTiles.length === (DIFFICULTY * DIFFICULTY) / 2) {
      setTimeout(reset, 3000);
    }
  }, [discoveredTiles, reset]);

  return (
    <MemotestContext.Provider
      value={{
        tries,
        tiles: chunk(tiles, DIFFICULTY),
        reset,
        setTile: tileId => {
          // Flipping first tile
          if (firstTileId === null) {
            setFirstTileId(tileId);
            return;
          }

          setTries(tries + 1);

          // This allows the other tile to flip
          setSecondTileId(tileId);

          // Check
          const tile1 = tiles[firstTileId];
          const tile2 = tiles[tileId];

          // If they don't match, reset
          if (tile1.id !== tile2.id) {
            setTimeout(() => {
              setFirstTileId(null);
              setSecondTileId(null);
            }, 1000);
          } else {
            // They match, add to discovered
            setDiscoveredTiles([...discoveredTiles, tile1.id]);
            setFirstTileId(null);
            setSecondTileId(null);
          }
        },
        isFlipped: tileId => {
          // A tile is flipped  if it is the first or second tile or if it is in the discovered tiles
          const tile = tiles[tileId];
          return firstTileId === tileId || secondTileId === tileId || discoveredTiles.includes(tile.id);
        },
      }}
    >
      {children}
    </MemotestContext.Provider>
  );
};

const MemotestProvider = ({ children }) => {
  const { setMessage } = React.useContext(AppContext);

  const [tries, setTries] = usePersistedState('tries', 0);
  const [firstTileId, setFirstTileId] = usePersistedState('memotest-first', null);
  const [secondTileId, setSecondTileId] = usePersistedState('memotest-second', null);
  const [discoveredTiles, setDiscoveredTiles] = usePersistedState('memotest-discovered', []);
  const [tiles, setTiles] = usePersistedState('memotest-tiles', null);

  useEffect(() => {
    // Already generated
    if (tiles) return;

    const positions = [];

    // Generate order
    for (let p = 0; p < (DIFFICULTY * DIFFICULTY) / 2; p++) {
      positions.push(p);
      positions.push(p);
    }

    const shuffled = shuffle(positions);

    // Generate tiles
    setTiles(
      shuffled.map((p, i) => ({
        index: i,
        id: db[p].id,
        img: db[p].urls.small,
      })),
    );
  }, [setTiles, tiles]);

  const reset = useCallback(() => {
    setFirstTileId(null);
    setSecondTileId(null);
    setDiscoveredTiles([]);
    setTries(0);
    setTiles(null);
  }, [setDiscoveredTiles, setFirstTileId, setSecondTileId, setTiles, setTries]);

  useEffect(() => {
    if (discoveredTiles.length === (DIFFICULTY * DIFFICULTY) / 2) {
      setMessage('You won!');
      setTimeout(reset, 3000);
    }
  }, [discoveredTiles, reset, setMessage]);

  return (
    <MemotestContext.Provider
      value={{
        tries,
        tiles: chunk(tiles, DIFFICULTY),
        reset,
        setTile: tileId => {
          // Flipping first tile
          if (firstTileId === null) {
            setFirstTileId(tileId);
            return;
          }

          setTries(tries + 1);

          // This allows the other tile to flip
          setSecondTileId(tileId);

          // Check
          const tile1 = tiles[firstTileId];
          const tile2 = tiles[tileId];

          // If they don't match, reset
          if (tile1.id !== tile2.id) {
            setTimeout(() => {
              setFirstTileId(null);
              setSecondTileId(null);
            }, 1000);
          } else {
            // They match, add to discovered
            setDiscoveredTiles([...discoveredTiles, tile1.id]);
            setFirstTileId(null);
            setSecondTileId(null);
          }
        },
        isFlipped: tileId => {
          // A tile is flipped  if it is the first or second tile or if it is in the discovered tiles
          const tile = tiles[tileId];
          return firstTileId === tileId || secondTileId === tileId || discoveredTiles.includes(tile.id);
        },
      }}
    >
      {children}
    </MemotestContext.Provider>
  );
};

export default MemotestProvider;
