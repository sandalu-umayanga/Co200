import React from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Card from "./card";
import Profile from "./Profile";
import "../styls/style1.css";

export default function Staff() {
    // Extract the 'name' parameter from the URL to determine the staff type (e.g., Doctor, Nurse).
    const { name } = useParams();  
    const [staff, setStaff] = React.useState([]); // State to hold the list of staff members.
    const [selectedDoctorId, setSelectedDoctorId] = React.useState(null); // State to track the selected doctor's ID.
    const [error, setError] = React.useState(null); // State to handle errors in fetching data.

    // Fetch the list of staff members based on their profession whenever the 'name' parameter changes.
    React.useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Make a POST request to fetch doctors of a specific profession.
                setStaff([])
                const response = await api.post(`api/doctor_list/`, { profe: name });
                setStaff(response.data); // Update the state with the fetched data.
            } catch (error) {
                console.error("Error fetching doctors by profession:", error);
                setError("Failed to fetch doctors"); // Set error message in case of failure.
            }
        };
        fetchDoctors(); // Trigger the API call.
    }, [name]);

    // Function to handle the card click event, setting the selected doctor's ID.
    const handleCardClick = (doctor) => {
        setSelectedDoctorId(doctor.id); // Mark the clicked doctor as selected.
    };

    // Generate a list of cards for each staff member.
    const cards = staff.map(doctor => (
        <div 
            key={doctor.id} // Unique key for each card for React rendering optimization.
            onClick={() => handleCardClick(doctor)} // Attach the click handler to the card.
            className={`card-container ${doctor.id === selectedDoctorId ? 'active' : ''}`} // Highlight the selected card.
        >
            <Card 
                // Pass the doctor's image and name to the Card component.
                image={`${import.meta.env.VITE_API_URL}${doctor.image.substring(1)}`}
                name={doctor.name}
            />
        </div>
    ));

    // Find the selected doctor's details for displaying their profile.
    const selectedDoctor = staff.find(doctor => doctor.id === selectedDoctorId);

    return (
        <div className="staf-view-container1">
            <div className="background"></div> {/* Decorative background for the staff view. */}
            <h1 className="title1">{name}</h1> {/* Display the profession name as the page title. */}
            <div className="staf-mems-container">
                <div className="staf-mem-list">
                    {cards} {/* Render the list of staff member cards. */}
                </div>
                {selectedDoctor && (
                    // Render the Profile component for the selected staff member.
                    <Profile 
                        user_data={selectedDoctor} // Pass selected doctor's details to Profile component.
                        user_image={`${import.meta.env.VITE_API_URL}${selectedDoctor.image.substring(1)}`} // Pass doctor's profile image.
                        user_age={new Date().getFullYear() - new Date(selectedDoctor.birth).getFullYear()} // Calculate and pass doctor's age.
                        istrue={false} // Flag for conditional rendering in the Profile component.
                    />
                )}
            </div>
        </div>
    );
}
