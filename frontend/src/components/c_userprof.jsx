import React from "react";
import api from "../api";
import Profile from "./Profile";

export default function C_Profile() {
    const [data, setData] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [age, setAge] = React.useState(null);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile/");
            setData(res.data);

            const imageUrl = res.data.image.startsWith('/')
                ? res.data.image.substring(1)
                : res.data.image;
            setImage(`${import.meta.env.VITE_API_URL}${imageUrl}`);
            
            calculateAge(res.data.birth);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            alert("An error occurred while fetching profile data.");
        }
    };

    const calculateAge = (birthDateString) => {
        if (!birthDateString) return;

        const today = new Date();
        const birthDate = new Date(birthDateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if the birth date hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        setAge(age);
    };

    React.useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <Profile user_data={data} user_age={age} user_image={image} istrue={true}/>
    );
}
