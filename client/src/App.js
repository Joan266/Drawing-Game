import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './Menu/Menu.jsx';
import Room from './Room/Room.jsx';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Menu />} />
        <Route path="room" element={<Room />} />
      </Route>
    </Routes>
  );
}

export default App;
