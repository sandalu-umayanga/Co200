import React, { useState } from "react";
import api from "../api";  // API helper for making requests to the backend
import "../styls/regform.css";  // Import the styling for the registration form
import { useNavigate } from "react-router-dom";  // React Router hook for navigation

export default function PatientForm(props) {
    // State hooks to manage form data, loading status, error messages, and success messages
    const [formData, setFormData] = useState({
        national_id: "",
        hospital_id: "",
        name: "",
        year: "",
        month: "",
        date: "",
        address: "",
        contact: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);  // Loading state during API calls
    const [error, setError] = useState("");  // Error message state
    const [success, setSuccess] = useState('');  // Success message state
    const navigate = useNavigate();  // Hook to navigate to other pages

    // Handle form input changes
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    // Handle form submission (either creating or updating a patient)
    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent page refresh on form submit
        setLoading(true);  // Set loading state to true
        setError('');  // Reset any previous errors
        setSuccess('');  // Reset success message

        // Validate form fields (optional but recommended)
        if (!formData.national_id || !formData.hospital_id || !formData.name || !formData.year || !formData.month || !formData.date || !formData.address || !formData.contact) {
            setError("All fields are required.");
            setLoading(false);  // Reset loading state
            return;  // Stop form submission if fields are missing
        }

        // Construct the birth date string from year, month, and date fields
        const birthDate = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.date.padStart(2, '0')}`;
        
        // Data to send in the API request
        const data = {
            national_id: formData.national_id,
            hospital_id: formData.hospital_id,
            name: formData.name,
            birth: birthDate,
            address: formData.address,
            contact: formData.contact,
            email: formData.email,
        };

        try {
            // Check if the method is "create" or "update" and call the respective API endpoint
            if (props.method === "create") {
                await api.post("/api/patients/", data);  // Create a new patient
                setSuccess("Patient created successfully!");
            } else if (props.method === "update") {
                await api.patch("/api/patients/update/", data);  // Update an existing patient
                setSuccess("Patient updated successfully!");
            }
            
            // Navigate to the '/home' page after a successful operation
            setTimeout(() => navigate('/home'), 1000);
        } catch (error) {
            // Set error message in case of API request failure
            setError('Error updating patient profile: ' + JSON.stringify(error.response?.data));
        } finally {
            setLoading(false);  // Reset loading state after API call
        }
    };

    return (
        <div className="form-container">
            {success ? (
                // Show success message if the operation is successful
                <p className="succ-message">{success}</p>
            ) : (
                <>
                    {/* Display form for creating or updating a patient */}
                    <h1>{props.method === "create" ? "Create New Patient" : "Update Patient"}</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Form fields for patient details */}
                        <div>
                            <label>National ID</label>
                            <input type="text" name="national_id" onChange={handleChange} value={formData.national_id} />
                        </div>
                        <div>
                            <label>Hospital ID</label>
                            <input type="text" name="hospital_id" onChange={handleChange} value={formData.hospital_id} />
                        </div>
                        <div>
                            <label>Full Name</label>
                            <input type="text" name="name" onChange={handleChange} value={formData.name} />
                        </div>
                        <div className="form-date">
                            {/* Date of birth input fields */}
                            <label>Year</label>
                            <input placeholder="YYYY" type="text" name="year" onChange={handleChange} value={formData.year} />
                            <label>Month</label>
                            <input placeholder="MM" type="text" name="month" onChange={handleChange} value={formData.month} />
                            <label>Day</label>
                            <input placeholder="DD" type="text" name="date" onChange={handleChange} value={formData.date} />
                        </div>
                        <div>
                            <label>Address</label>
                            <input type="text" name="address" onChange={handleChange} value={formData.address} />
                        </div>
                        <div>
                            <label>Contact</label>
                            <input type="text" name="contact" onChange={handleChange} value={formData.contact} />
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" name="email" onChange={handleChange} value={formData.email} />
                        </div>

                        {/* Show loading spinner if form submission is in progress */}
                        {loading && <div>Loading...</div>}
                        {/* Display error message if there's an error */}
                        {error && <div className="error-message">{error}</div>}
                        {/* Submit button with dynamic text based on the method */}
                        <button type="submit" className="button1" disabled={loading}>
                            {props.method === "create" ? "Create" : "Update"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
