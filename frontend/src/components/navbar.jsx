import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import navimage from "../images/navimage.jpg";
import api from "../api";
import "../styls/navbar.css";
import blank_user from "../images/user.jpg";

export default function Navbar() {
    const [user, setUser] = useState("Loading...");
    const navigate = useNavigate();
    const [dropstat, setDropstat] = useState(false);
    const [isSuperUser, setIsSuperUser] = useState(false);
    const isdrop = useRef(null);
    const isStaff = useRef(null)
    const [isAccount, setIsAccount] = useState(false);
    const [image, setImage] = useState(blank_user);
    const[dropStaff, setDropStaff] = useState(false)
    const [is_doc, set_is_doc] = useState(false)
    const [is_nur, set_is_nur] = useState(false)
    const [is_other, set_is_other] = useState(false)

    const fetchUser = async () => {
        try {
            const res = await api.get("/api/user/now/");
            setUser(res.data.username);
            setIsSuperUser(res.data.is_superuser);
            set_is_doc(res.data.is_doctor)
            set_is_nur(res.data.is_nurse)
            set_is_other(res.data.is_other)
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile/");
            setIsAccount(res.data.is_account);
            if (res.data.is_account) {
                const imageUrl = res.data.image.startsWith('/') ? res.data.image.substring(1) : res.data.image;
                setImage(`${import.meta.env.VITE_API_URL}${imageUrl}`);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
            alert("An error occurred while fetching profile data.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUser();  // Fetch user data first
            await fetchProfile();  // Fetch profile data after user data
        };

        fetchData();

        const handleClickOutside = (event) => {
            if (isdrop.current && !isdrop.current.contains(event.target)) {
                setDropstat(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        const handleClickOutside1 = (event) => {
            if (isStaff.current && !isStaff.current.contains(event.target)){
                setDropStaff(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside1)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mousedown", handleClickOutside1)
        };

    }, []);

    function handleHome() {
        navigate("/home");
    }

    function toggleDropdown() {
        setDropstat((prevst) => !prevst);
    }

    function toggledrop1(){
        setDropStaff((prevd) => !prevd)
    }

    function handleMyProfile() {
        navigate("/profile");
    }

    function handleEditProfile() {
        navigate("/profile/update");
    }

    function handleLogout() {
        navigate("/logout");
    }

    function handleRegister() {
        navigate("/register");
    }

    function handleCreate(){
        navigate("/new-account")
    }

    const handleItemClick = (name) => {
        navigate(`/component/${name}`);
      };

    function handlereg(){
        navigate("/patient/register")
    }

    function handleimgup(){
        navigate("/upload-images/")
    }

    function handlesearch(){
        navigate("/patient-search/")
    }

    function handlegraph(){
        navigate("/graph/")
    }

    return (
        <nav className="nav-bar">
            <button className="home-icon" onClick={handleHome}>
                <img src={navimage} alt="Home" className="nav-image" />
                <p>Home</p>
            </button>
            {isSuperUser && (
                <button className="Register-button" onClick={handleRegister}>
                    Staff Register
                </button>
            )}
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
            {is_doc && (
                <button onClick={handlesearch} className="pat-search">Report</button>
            )}
            {(is_doc || is_nur) && (
                <button onClick={handleimgup} className="img-up">Images</button>
            )}
            <button onClick={handlegraph} className="graphs">Analyse</button>
            {(is_doc || is_nur || is_other) && (
                <button onClick={handlereg} className="patient-reg">Patient Register</button>
            )}
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
