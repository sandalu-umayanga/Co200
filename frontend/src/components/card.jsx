import React from "react";
import "../styls/style1.css"; // Importing the CSS file for styling

export default function Card(props) {
    return (
        <div className="card-container">
            {/* Render an image using the 'image' prop */}
            <img className="card-img" src={props.image} alt="Card Image" />
            
            {/* Render a paragraph to display the 'name' prop */}
            <p>{props.name}</p>
        </div>
    );
}
