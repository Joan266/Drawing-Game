import { React, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import pintureteDB from "../DB_services/pinturete.js";
import '../pages_style/join_table.scss';
import Navbar from "../components/Navbar";
const Join = () => {
    const tableNumberRef = useRef(null);
    const codeRef = useRef(null);
    const [table, setTable] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        var data = {
            tableNumber: tableNumberRef.current.value,
            tableCode: codeRef.current.value
        };
        pintureteDB.checkTable(data)
            .then((res) => {
                console.log(res);
                if (res.data.valid) {
                    setTable({ tableId: data.tableNumber })
                } else {
                    alert(res.data.cb)
                }
            })
            .catch((error) => console.log(error));
    }
    return (
        <div className="joinContainer">
            <Navbar />
            <div className="joinWrapper">
                <form onSubmit={handleSubmit} >
                    <label>
                        <p>Join table</p>
                        <input type="text" name="tableNumber" placeholder="Enter table number" ref={tableNumberRef}></input>
                        <input type="text" name="code" placeholder="Enter table code" ref={codeRef}></input>
                    </label>
                    <button type="submit">Enviar</button>
                </form>
                {table && <Navigate to="/table" state={table} replace={true} />}
            </div>
        </div>
    );
};

export default Join;