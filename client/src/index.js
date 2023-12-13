import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react';
import './index.scss';
import Menu from './Menu/Menu.jsx';
import Room from './Room/Room.jsx';

function App() {
  useEffect(() => {
    console.log('rendered');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="room" element={<Room />} />
          <Route path="menu" element={<Menu />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
