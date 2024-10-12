import React from "react";
import "../styls/style1.css"

export default function Card(props){
    return (
        <div className="card-container">
            <img className="card-img" src={props.image} />
            <p>{props.name}</p>
        </div>
    )
}