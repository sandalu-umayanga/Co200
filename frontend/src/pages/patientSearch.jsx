import React from "react";
import "../styls/homepage.css"
import Navbar from "../components/navbar"
import P_search from "../components/pat_search";
import Report from "../components/report";

export default function Report_Genaration() {
    return (
      <div>
        <Navbar />
        <div className="background1"></div>
        <Report />
      </div>
  )
}