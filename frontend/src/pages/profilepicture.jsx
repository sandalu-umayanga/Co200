import React from "react";
import Navbar from "../components/navbar"
import ProfilePic from "../components/profpic";
import "../styls/homepage.css"

export default function Profile_picture() {
    return (
        <div>
            <div className="background"></div>
            <Navbar />
            <ProfilePic />
        </div>
  )
}