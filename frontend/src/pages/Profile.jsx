import React from "react";
import Navbar from "../components/navbar"
import C_Profile from "../components/c_userprof";
import "../styls/homepage.css"

export default function Profile_page() {
    return (
        <div>
            <div className="background"></div>
            <Navbar />
            <C_Profile />
        </div>
  )
}