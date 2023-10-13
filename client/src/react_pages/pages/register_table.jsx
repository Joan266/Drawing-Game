import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import '../pages_style/register_table.scss';
import Navbar from "../components/Navbar";
import { PagesLogic } from '../pages_logic.js'; 

const Register = () => {
  const codeRef = useRef(null);
  const [tableId, setTableId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    PagesLogic.handleTableCreation(codeRef.current.value, setTableId);
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
      {tableId && <Navigate to="/table" state={{ room: tableId }} replace={true} />}
    </div>
  );
};

export default Register;
