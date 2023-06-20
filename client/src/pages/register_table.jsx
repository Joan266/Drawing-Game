import { React, useState, useRef } from "react";
import pintureteDB from "../DB_services/pinturete.js";
import { Navigate } from "react-router-dom";
import '../pages_style/register_table.scss';
import Navbar from "../components/Navbar";

const Register = () => {
  const codeRef = useRef(null);
  const [tableId, setTableId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    pintureteDB.createTable({ code: codeRef.current.value })
      .then((res) => {
        setTableId(res.data.tableId);
        console.log(res.data.tableId);
      })
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
      {tableId && <Navigate to="/table" state={{room: tableId}} replace={true} />}
    </div>

  );
};

export default Register;