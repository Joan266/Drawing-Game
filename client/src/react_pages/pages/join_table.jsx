import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import '../pages_style/join_table.scss';
import Navbar from "../components/Navbar";
import { PagesLogic } from '../pages_logic.js'; 

const Join = () => {
  const tableNumberRef = useRef(null);
  const codeRef = useRef(null);
  const [tableId, setTableId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    PagesLogic.handleTableCheck(
      tableNumberRef.current.value,
      codeRef.current.value,
      setTableId
    );
  };

  return (
    <div className="joinContainer">
      <Navbar />
      <div className="joinWrapper">
        <form onSubmit={handleSubmit}>
          <label>
            <p>Join table</p>
            <input
              type="text"
              name="tableNumber"
              placeholder="Enter table number"
              ref={tableNumberRef}
            ></input>
            <input
              type="text"
              name="code"
              placeholder="Enter table code"
              ref={codeRef}
            ></input>
          </label>
          <button type="submit">Enviar</button>
        </form>
        {tableId && (
          <Navigate to="/table" state={{ room: tableId }} replace={true} />
        )}
      </div>
    </div>
  );
};

export default Join;
