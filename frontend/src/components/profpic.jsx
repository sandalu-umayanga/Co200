import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation between pages
import api from "../api"; // Importing the API module for making HTTP requests
import back_b from "../images/backbutton.jpg" // Importing back button image
import edit_b from "../images/editbutton.png" // Importing edit button image
import "../styls/profile.css" // Importing the CSS styles for the profile page


export default function ProfilePic() {
    // Setting up state to store the profile picture URL
    const [image, SetImage] = React.useState(null);
    const navigate = useNavigate() // Initializing the navigation hook

    // Function to fetch profile data from the API
    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile/"); // Sending a GET request to fetch profile data
            // Handling image URL path by checking if it starts with '/'
            const imageUrl = res.data.image.startsWith('/') 
                ? res.data.image.substring(1) // If it starts with '/', remove it
                : res.data.image; // Otherwise, keep it as is
            // Setting the full image URL for the profile picture
            SetImage(`${import.meta.env.VITE_API_URL}${imageUrl}`);
        } catch (error) { 
            console.error("Error fetching profile data:", error); // Log error in case of failure
            alert("An error occurred while fetching profile data."); // Notify user of error
        }
    };

    // Using useEffect to fetch profile data when the component mounts
    React.useEffect(() => {
        fetchProfile();
    }, []); // Empty dependency array to ensure it only runs once on mount

    // Function to navigate back to the profile page
    function HandleBack(){
        navigate("/profile")
    }

    // Function to navigate to the profile update page
    function HandleEdit(){
        navigate("/profile/update")
    }

    return(
        <div>
            {/* Back button to go back to the profile page */}
            <button type="button" className="back-button" onClick={HandleBack}>
                <img src={back_b} alt="Back Button" /> {/* Displaying the back button image */}
            </button>
            {/* Profile picture */}
            <img src={image} className="profile-picture-full" alt="Profile" />
            {/* Edit button to go to the profile update page */}
            <button type="button" className="edit-button" onClick={HandleEdit}>
                <img src={edit_b} alt="Edit Button" /> {/* Displaying the edit button image */}
            </button>
        </div>
    )
}
