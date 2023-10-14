import Join from "./react_pages/pages/join_table";
import Table from "./react_pages/pages/table";
import Menu from "./react_pages/pages/menu";
import NewGame from "./react_pages/pages/NewGame";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Menu />} />
          <Route path="join" element={<Join />} />
          <Route path="newgame" element={<NewGame />} />
          <Route path="table" element={<Table />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
