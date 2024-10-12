import React from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Card from "./card";
import Profile from "./profile";
import "../styls/style1.css"


export default function Staff() {
    const { name } = useParams();  // Get the 'name' from URL params
    const [staff, setStaff] = React.useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = React.useState(null); // Track selected doctor's ID
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.post(`api/doctor_list/`, { profe: name });
                setStaff(response.data);
            } catch (error) {
                console.error("Error fetching doctors by profession:", error);
                setError("Failed to fetch doctors");
            }
        };
        fetchDoctors();
    }, [name]);

    // Handle card click to select a doctor
    const handleCardClick = (doctor) => {
        setSelectedDoctorId(doctor.id);  // Set the selected doctor ID
    };

    const cards = staff.map(doctor => (
        <div 
            key={doctor.id} 
            onClick={() => handleCardClick(doctor)} 
            className={`card-container ${doctor.id === selectedDoctorId ? 'active' : ''}`}
        >
            <Card 
                image={`${import.meta.env.VITE_API_URL}${doctor.image.substring(1)}`}
                name={doctor.name}
            />
        </div>
    ));

    const selectedDoctor = staff.find(doctor => doctor.id === selectedDoctorId);

    return (
        <div className="staf-view-container1">
            <div className="background"></div>
            <h1 className="title1">{name}</h1>
            <div className="staf-mems-container">
                <div className="staf-mem-list">
                    {cards}
                </div>
                {selectedDoctor && (
                    <Profile 
                        user_data={selectedDoctor}
                        user_image={`${import.meta.env.VITE_API_URL}${selectedDoctor.image.substring(1)}`}
                        user_age={new Date().getFullYear() - new Date(selectedDoctor.birth).getFullYear()}
                        istrue={false}
                    />
                )}
            </div>
        </div>
    );
}
