import React from "react";
import { useParams } from "react-router-dom";
import Staff from "../components/staf_list"; 
import Navbar from "../components/navbar"
import "../styls/homepage.css"

const ABCWithParams = () => {
    const { name } = useParams();
    return (
        <dev>
            <Navbar />
            <Staff job={name} />
        </dev>
    ) 
};

export default ABCWithParams;
