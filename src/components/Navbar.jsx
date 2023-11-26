import React from "react";
import './Navbar.css'
import { useNavigate } from "react-router-dom";
const Navbar = () =>{
    let navigate = useNavigate();
    return (
        <>
            <nav>
                <div className="Navbar">
                    <div className="logo-with-text" onClick={()=>navigate('/')}>
                        <img className="logo" src="https://dashtoon.com/static/media/dashtoon-logo.a8078db575978f3185c8.png" alt="logo"/>
                            <span className="logo-text">DASHTOON Assessment (Engineer, Product)</span>
                        </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar