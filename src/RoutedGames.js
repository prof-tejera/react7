import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

import Memotest from './games/Memotest';
import Puzzle from './games/Puzzle';

const ROUTES = {
  HOME: '/',
  MEMOTEST: '/memotest',
  PUZZLE: '/puzzle',
};

const Nav = styled.div`
  position: fixed;
  top: 0px;
  display: flex;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  left: 0px;

  div {
    margin: 5px;
  }
`;

const Home = () => {
  return <div>Select a Game!</div>;
};

const RoutedApp = () => {
  return (
    <div style={{ color: 'white' }}>
      <Nav>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to={ROUTES.MEMOTEST}>Memotest</Link>
        </div>
        <div>
          <Link to={ROUTES.PUZZLE}>Puzzle</Link>
        </div>
      </Nav>

      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.MEMOTEST} element={<Memotest />} />
        <Route path={ROUTES.PUZZLE} element={<Puzzle />} />
      </Routes>
    </div>
  );
};

export default RoutedApp;
