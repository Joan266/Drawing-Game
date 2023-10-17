import { Room, Menu } from "./react_pages/pages";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Menu />} />
          <Route path="room" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
