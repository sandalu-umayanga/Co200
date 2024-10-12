import React from "react";
import "../styls/homepage.css"
import Navbar from "../components/navbar"
import P_search from "../components/pat_search";


export default function Home1() {
    return (
      <div>
        <Navbar />
        <div className="background1"></div>
        <P_search />
      </div>
  )
}