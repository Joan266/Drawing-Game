import { React, useState, useRef } from "react";
import pintureteDB from "../DB_services/pinturete.js";
import { Navigate } from "react-router-dom";
import '../pages_style/register_table.scss';
import Navbar from "../components/Navbar";

const Register = () => {
  const codeRef = useRef(null);
  const [table, setTable] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    var data = { code: codeRef.current.value };
    pintureteDB.createTable(data)
      .then((res) => setTable({ tableId: res.data.tableId }))
      .catch((error) => console.log(error));
  }
  return (
    <div className="registerContainer">
      <Navbar />
      <form onSubmit={handleSubmit} >
        <label>
          <p>Register table</p>
          <input type="text" name="code" placeholder="Enter code" ref={codeRef} required></input>
        </label>
        <button type="submit">Enviar</button>
      </form>
      {table && <Navigate to="/table" state={table} replace={true} />}
    </div>

  );
};

export default Register;