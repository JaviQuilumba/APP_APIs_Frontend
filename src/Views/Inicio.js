// src/Inicio.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
    return (
        <div className="container">
            <div className="content">
                <h1>Métodos para transmición de datos</h1>
                <h2>Restful, GraphQL, SOAP</h2>
                <p>Seleccione un método:</p>
                <div className="button-container">
                    <Link to="/button1"><button className="styled-button">RESTful</button></Link>
                    <Link to="/button2"><button className="styled-button">GraphQL</button></Link>
                    <Link to="/button3"><button className="styled-button">SOAP_XML</button></Link>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
