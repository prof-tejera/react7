import { chunk, shuffle } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { AppContext } from './AppProvider';
import { usePersistedState } from '../hooks';

export const PuzzleContext = React.createContext({});

const DIFFICULTY = 4;
const IMAGE = 'https://images.unsplash.com/file-1635810851773-3defff69fe00image';

const PuzzleProvider = ({ children }) => {
  const { setMessage } = React.useContext(AppContext);

  const [tries, setTries] = usePersistedState('puzzle-tries', 0);
  const [tiles, setTiles] = usePersistedState('puzzle-tiles', null);

  useEffect(() => {
    // Already generated
    if (tiles) return;

    const positions = [];

    // Generate order
    for (let p = 0; p < DIFFICULTY * DIFFICULTY; p++) {
      positions.push(p);
    }

    const shuffled = shuffle(positions);

    // Generate tiles
    setTiles(
      shuffled.map((p, i) => ({
        index: p,
        img: IMAGE,
      })),
    );
  }, [setTiles, tiles]);

  const reset = useCallback(() => {
    setTries(0);
    setTiles(null);
  }, [setTiles, setTries]);

  useEffect(() => {
    const isWin = false;
    // TODO: Check if win
    if (isWin) {
      setMessage('You won!');
      setTimeout(reset, 3000);
    }
  }, [reset, setMessage]);

  return (
    <PuzzleContext.Provider
      value={{
        tries,
        tiles: chunk(tiles, DIFFICULTY).map(row => {
          return row.map(tile => {
            const r = Math.floor(tile.index / DIFFICULTY);
            const c = tile.index % DIFFICULTY;

            return {
              ...tile,
              img: tile.index === 0 ? null : tile.img,
              style: {
                backgroundSize: `${100 * DIFFICULTY}%`,
                backgroundPosition: `${100 * c}% ${100 * r}%`,
                margin: 0,
                borderRadius: 0,
              },
            };
          });
        }),
        reset,
        setTile: clickedIndex => {
          if (clickedIndex === 0) return;

          const newTiles = [...tiles];

          const emptyTileIndex = newTiles.findIndex(t => t.index === 0);
          const clickedTileIndex = newTiles.findIndex(t => t.index === clickedIndex);

          const emptyTileItem = { ...newTiles[emptyTileIndex] };

          newTiles[emptyTileIndex] = newTiles[clickedTileIndex];
          newTiles[clickedTileIndex] = emptyTileItem;

          setTiles(newTiles);
          setTries(tries + 1);
        },
      }}
    >
      {children}
    </PuzzleContext.Provider>
  );
};

export default PuzzleProvider;
