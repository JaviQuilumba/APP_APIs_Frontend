// src/Inicio.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
    return (
        <div className="container">
            <div className="content">
                <h1>Título Principal</h1>
                <h2>Subtítulo Descriptivo</h2>
                <p>Este es un párrafo introductorio que describe brevemente las opciones disponibles.</p>
                <div className="button-container">
                    <Link to="/button1"><button className="styled-button">RESTful</button></Link>
                    <Link to="/button2"><button className="styled-button">GraphQL</button></Link>
                    <Link to="/button3"><button className="styled-button">gRPC</button></Link>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
