import React from "react";
import PatientForm from "../components/patreg";
import Navbar from "../components/navbar";
import "../styls/homepage.css"

export default function P_account() {
    return (
        <div>
            <Navbar />
            <PatientForm method="create"/>
            <div className="background"></div>
        </div>
  )
}