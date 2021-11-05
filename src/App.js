import React, { useContext, useRef, useState, useCallback } from 'react';
import AppProvider, { AppContext } from './context/AppProvider';
import { usePrevious } from './hooks';
import db from './db';
import './App.css';
import styled from 'styled-components';
import Games from './Games';
import Memotest from './games/Memotest';
import Puzzle from './games/Puzzle';

const App = () => {
  return <Games />;
};

export default App;
