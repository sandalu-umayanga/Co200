import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import back_b from "../images/backbutton.jpg"
import edit_b from "../images/editbutton.png"
import "../styls/profile.css"


export default function ProfilePic() {
    const [image, SetImage] = React.useState(null);
    const navigate = useNavigate()

    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile/");
            const imageUrl = res.data.image.startsWith('/') 
                ? res.data.image.substring(1) 
                : res.data.image;
            SetImage(`${import.meta.env.VITE_API_URL}${imageUrl}`);
        } catch (error) { 
            console.error("Error fetching profile data:", error);
            alert("An error occurred while fetching profile data.");
        }
    };

    React.useEffect(() => {
        fetchProfile();
    }, []);

    function HandleBack(){
        navigate("/profile")
    }

    function HandleEdit(){
        navigate("/profile/update")
    }

    return(
        <div>
            <button type="button" className="back-button" onClick={HandleBack}>
                <img src={back_b} />
            </button>
            <img src={image} className="profile-picture-full" />
            <button type="button" className="edit-button" onClick={HandleEdit}>
                <img src={edit_b} />
            </button>
        </div>
    )
}