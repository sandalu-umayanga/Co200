import React from "react";
import ImageUpload from "../components/imageupload";
import Navbar from "../components/navbar";
import "../styls/homepage.css"


export default function Upload_img() {
    return (
        <div>
            <Navbar />
            <ImageUpload />
        </div>
  )
}