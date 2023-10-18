import React from "react";
import { Link } from "react-router-dom";
import '../pages_style/menu.scss';
import Navbar from "../components/Navbar";
const Menu = () => {

    return (
        <div className="menuContainer">
            <Navbar />
            <div className="menuWrapper">
                <Link to="/joingame"><button type="button">Join game</button></Link>
                <Link to="/newgame"><button type="button">New game</button></Link>
            </div>
        </div>
    );

};

export default Menu;