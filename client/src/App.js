import Join from "./pages/join_table";
import Table from "./pages/table";
import Menu from "./pages/menu";
import Register from "./pages/register_table";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Menu />} />
          <Route path="join" element={<Join />} />
          <Route path="register" element={<Register />} />
          <Route path="table" element={<Table />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
