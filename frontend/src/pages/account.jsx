import React from "react";
import RegisterForm from "../components/regform";
import Navbar from "../components/navbar";
import "../styls/homepage.css"

export default function Account() {
    return (
        <div>
            <Navbar />
            <RegisterForm method="create"/>
        </div>
  )
}