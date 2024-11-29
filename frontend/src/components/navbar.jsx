import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import navimage from "../images/navimage.jpg";
import api from "../api";
import "../styls/navbar.css";
import blank_user from "../images/user.jpg";

// Navbar component definition
export default function Navbar() {
    // States to manage user data, dropdowns, profile image, etc.
    const [user, setUser] = useState("Loading..."); // User's username
    const navigate = useNavigate();
    const [dropstat, setDropstat] = useState(false); // Dropdown state for user menu
    const [isSuperUser, setIsSuperUser] = useState(false); // Check if user is a superuser
    const isdrop = useRef(null); // Reference for dropdown
    const isStaff = useRef(null); // Reference for staff dropdown
    const [isAccount, setIsAccount] = useState(false); // Flag to check if the user has an account
    const [image, setImage] = useState(blank_user); // Default profile image
    const[dropStaff, setDropStaff] = useState(false); // Dropdown for staff options
    const [is_doc, set_is_doc] = useState(false); // Flag for doctor role
    const [is_nur, set_is_nur] = useState(false); // Flag for nurse role
    const [is_other, set_is_other] = useState(false); // Flag for other roles

    // Fetch user data (username, superuser status, and role information)
    const fetchUser = async () => {
        try {
            const res = await api.get("/api/user/now/"); // Fetch user data from the API
            setUser(res.data.username); // Set the user's username
            setIsSuperUser(res.data.is_superuser); // Check if the user is a superuser
            set_is_doc(res.data.is_doctor); // Set doctor role status
            set_is_nur(res.data.is_nurse); // Set nurse role status
            set_is_other(res.data.is_other); // Set other roles status
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Fetch profile data (check account status and profile image)
    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile/"); // Fetch profile data from the API
            setIsAccount(res.data.is_account); // Check if the user has an account
            if (res.data.is_account) {
                const imageUrl = res.data.image.startsWith('/') ? res.data.image.substring(1) : res.data.image;
                setImage(`${import.meta.env.VITE_API_URL}${imageUrl}`); // Set the profile image if available
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
            alert("An error occurred while fetching profile data."); // Error handling for profile data fetch
        }
    };

    // Use effect hook to fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            await fetchUser();  // Fetch user data first
            await fetchProfile();  // Fetch profile data after user data
        };

        fetchData();

        // Close dropdown if clicked outside of it
        const handleClickOutside = (event) => {
            if (isdrop.current && !isdrop.current.contains(event.target)) {
                setDropstat(false); // Close dropdown if clicked outside
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        // Close staff dropdown if clicked outside of it
        const handleClickOutside1 = (event) => {
            if (isStaff.current && !isStaff.current.contains(event.target)){
                setDropStaff(false); // Close staff dropdown if clicked outside
            }
        }
        document.addEventListener("mousedown", handleClickOutside1)

        // Cleanup event listeners when component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mousedown", handleClickOutside1)
        };

    }, []);

    // Handle navigation to the home page
    function handleHome() {
        navigate("/home");
    }

    // Toggle the visibility of the user dropdown
    function toggleDropdown() {
        setDropstat((prevst) => !prevst);
    }

    // Toggle the visibility of the staff dropdown
    function toggledrop1(){
        setDropStaff((prevd) => !prevd)
    }

    // Handle navigation to the user's profile page
    function handleMyProfile() {
        navigate("/profile");
    }

    // Handle navigation to the edit profile page
    function handleEditProfile() {
        navigate("/profile/update");
    }

    // Handle logout action
    function handleLogout() {
        navigate("/logout");
    }

    // Handle navigation to the registration page for creating new accounts
    function handleRegister() {
        navigate("/register");
    }

    // Handle navigation to the create new account page
    function handleCreate(){
        navigate("/new-account")
    }

    // Handle navigation to a specific component page based on name
    const handleItemClick = (name) => {
        navigate(`/component/${name}`);
    };

    // Handle navigation to the patient registration page
    function handlereg(){
        navigate("/patient/register")
    }

    // Handle navigation to the image upload page
    function handleimgup(){
        navigate("/upload-images/")
    }

    // Handle navigation to the patient search page
    function handlesearch(){
        navigate("/patient-search/")
    }

    // Handle navigation to the graph analysis page
    function handlegraph(){
        navigate("/graph/")
    }

    return (
        <nav className="nav-bar">
            {/* Home button with navigation */}
            <button className="home-icon" onClick={handleHome}>
                <img src={navimage} alt="Home" className="nav-image" />
                <p>Home</p>
            </button>

            {/* Conditionally render staff register button if user is a superuser */}
            {isSuperUser && (
                <button className="Register-button" onClick={handleRegister}>
                    Staff Register
                </button>
            )}

            {/* Staff dropdown button */}
            <div className="staff-container" ref={isStaff}>
                <button className="staf-view" onClick={toggledrop1}>Staff</button>
                {dropStaff && (
                    <div className="staff-dropdown">
                        <p onClick={() => handleItemClick('Doctor')}>Doctors</p>
                        <p onClick={() => handleItemClick('Nurse')}>Nurse</p>
                        <p onClick={() => handleItemClick('Other')}>Others</p>
                    </div>
                )}
            </div>

            {/* Conditionally render other buttons based on user roles */}
            {is_doc && (<button onClick={handlesearch} className="pat-search">Report</button>)}
            {(is_doc || is_nur) && (<button onClick={handleimgup} className="img-up">Images</button>)}
            {(is_doc || is_nur || is_other) && (<button onClick={handlereg} className="patient-reg">Patient Register</button>)}
            <button onClick={handlegraph} className="graphs">Analyse</button>

            {/* User profile section with dropdown */}
            <div className="user-section" ref={isdrop}>
                <button className="user-name" onClick={toggleDropdown}>
                    <img src={image} className="nav-prof-pic" alt="User Profile" />
                    <p>{user}</p>
                </button>
                {dropstat && (
                    <div className="dropdown-menu">
                        <p onClick={isAccount ? handleMyProfile : handleCreate} className="dropdown-item">
                            {isAccount ? "My Profile" : "Create Accoount"}
                        </p>
                        {isAccount &&  <p onClick={handleEditProfile} className="dropdown-item">
                            Edit Profile
                        </p>}
                        <p onClick={handleLogout} className="dropdown-item">
                            Logout
                        </p>
                    </div>
                )}
            </div>
        </nav>
    );
}
