import React from "react";
import api from "../api"; // Importing the API configuration for making backend requests.
import Profile from "./Profile"; // Importing the Profile component to display user profile details.

export default function C_Profile() {
    // State to store user profile data fetched from the backend.
    const [data, setData] = React.useState(null);
    // State to store the user's profile image URL.
    const [image, setImage] = React.useState(null);
    // State to store the calculated age of the user.
    const [age, setAge] = React.useState(null);

    // Function to fetch the user profile data from the backend API.
    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile/"); // Fetch profile data.
            setData(res.data); // Save the fetched data into the state.

            // Extract and resolve the profile image URL.
            const imageUrl = res.data.image.startsWith('/')
                ? res.data.image.substring(1) // Remove leading slash if present.
                : res.data.image;
            setImage(`${import.meta.env.VITE_API_URL}${imageUrl}`); // Construct the full image URL.

            // Calculate and set the user's age based on their birth date.
            calculateAge(res.data.birth);
        } catch (error) {
            // Handle errors during the API call.
            console.error("Error fetching profile data:", error);
            alert("An error occurred while fetching profile data.");
        }
    };

    // Function to calculate the user's age based on their birth date.
    const calculateAge = (birthDateString) => {
        if (!birthDateString) return; // Exit if birth date is not provided.

        const today = new Date(); // Get the current date.
        const birthDate = new Date(birthDateString); // Convert the birth date string to a Date object.
        let age = today.getFullYear() - birthDate.getFullYear(); // Calculate the initial age.
        const monthDiff = today.getMonth() - birthDate.getMonth(); // Calculate the difference in months.

        // Adjust the age if the user's birthday hasn't occurred yet this year.
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--; // Decrease age by 1 if the current date is before their birthday.
        }

        setAge(age); // Set the calculated age in state.
    };

    // React hook to run the fetchProfile function once when the component mounts.
    React.useEffect(() => {
        fetchProfile();
    }, []);

    // Render the Profile component with the fetched data and calculated age.
    return (
        <Profile 
            user_data={data} // Pass the user profile data.
            user_age={age} // Pass the calculated age.
            user_image={image} // Pass the resolved image URL.
            istrue={true} // Provide a boolean flag (can be used in Profile component logic).
        />
    );
}
