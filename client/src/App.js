import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './Menu/Menu.jsx';
import Room from './Room/Room.jsx';
import './app.scss'; 
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <Container fluid>
      <Routes>
        <Route path="/">
          <Route index element={<Menu />} />
          <Route path="room" element={<Room />} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
