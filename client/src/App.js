import { JoinGame, Room, Menu, NewGame } from "./react_pages/pages";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Menu />} />
          <Route path="joingame" element={<JoinGame />} />
          <Route path="newgame" element={<NewGame />} />
          <Route path="room" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
