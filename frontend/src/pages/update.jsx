import React from "react";
import RegisterForm from "../components/regform";
import Navbar from "../components/navbar";
import "../styls/homepage.css"

export default function AccountUpdate() {
    return (
        <div>
            <div className="background"></div>
            <Navbar />
            <RegisterForm method="update"/>
        </div>
  )
}