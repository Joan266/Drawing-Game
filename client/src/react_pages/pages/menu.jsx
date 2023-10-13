import React from "react";
import { Link } from "react-router-dom";
import '../pages_style/menu.scss';
import Navbar from "../components/Navbar";
const Menu = () => {

    return (


        <div className="menuContainer">
            <Navbar />
            <div className="menuWrapper">
                <Link to="/join"><button type="button">Join table</button></Link>
                <Link to="/register"><button type="button">Register table</button></Link>
            </div>
        </div>
    );

};

export default Menu;