import React, { useState } from "react"; // Importing React and the useState hook for state management
import api from "../api"; // Importing the API module to make HTTP requests
import "../styls/regform.css"; // Importing CSS styles for the form
import userIMG from "../images/user.jpg"; // Importing a default profile image
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation

export default function RegisterForm(props) {
    // State to hold the form data
    const [formData, setFormData] = useState({
        image: null,
        name: "",
        profecion: "", // Profession field
        year: "", // Year of birth
        month: "", // Month of birth
        date: "", // Day of birth
        contact: "", // Contact number
        email: "", // Email address
        special: "", // Specialty field
    });

    // Additional states for loading, error messages, and form feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState(userIMG); // State to manage image preview
    const [success, setSuccess] = useState(''); // State to handle success messages
    const navigate = useNavigate(); // Hook for navigation

    // Function to handle form field changes, including image uploads
    function handleChange(event) {
        const { name, value, type, files } = event.target;
        const new_data = type === "file" ? { ...formData, [name]: files[0] } : { ...formData, [name]: value };
        setFormData(new_data);

        // Preview the uploaded image
        if (type === "file" && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Update image preview with the selected file
            };
            reader.readAsDataURL(files[0]);
        }
    }

    // Function to handle form submission for creating or updating profiles
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading state
        setError(''); // Clear any previous errors
        setSuccess(''); // Clear any previous success messages
    
        // Validate form fields (basic validation to ensure all required fields are filled)
        if (!formData.name || !formData.profecion || !formData.year || !formData.month || !formData.date || !formData.contact || !formData.email) {
            setError("All fields are required.");
            setLoading(false); // Stop loading
            return;
        }
    
        // Prepare the birthdate in YYYY-MM-DD format
        const birthDate = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.date.padStart(2, '0')}`;
        const data = new FormData(); // FormData object to handle multipart data
        if (formData.image) {
            data.append("image", formData.image); // Append image if available
        }
        data.append("name", formData.name);
        data.append("profecion", formData.profecion);
        data.append("birth", birthDate); // Append the birthdate
        data.append("contact", formData.contact);
        data.append("email", formData.email);
        data.append("specility", formData.special);
    
        try {
            // API call to create or update profile based on the method prop
            if (props.method === "create") {
                await api.post("/api/doctors/", data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess("Profile created successfully!"); // Set success message for creation
            } else if (props.method === "update") {
                await api.patch("/api/profile/update/", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setSuccess("Profile updated successfully!"); // Set success message for update
            }
            setTimeout(() => navigate('/home'), 1000); // Redirect to home page after a brief delay
        } catch (error) {
            setError('Error updating doctor profile: ' + JSON.stringify(error.response?.data)); // Handle errors and display message
        } finally {
            setLoading(false); // Reset loading state
        }
    };
    
    // Function to fetch profile data when updating a profile
    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile/"); // Fetch profile data from the API
            setFormData(res.data); // Set the fetched data in form fields
            const [year1, month1, date1] = res.data.birth.split('-'); // Split the birthdate into parts
            setFormData(prevdata => ({
                ...prevdata,
                year: year1,
                month: month1,
                date: date1,
                special: res.data.specility, // Map speciality to form data
                image: null
            }));

            // Handle the image URL and update the image preview
            const imageUrl = res.data.image.startsWith('/') 
                ? res.data.image.substring(1) 
                : res.data.image;
                setImagePreview(`${import.meta.env.VITE_API_URL}${imageUrl}`);
        } catch (error) { 
            console.error("Error fetching profile data:", error);
            alert("An error occurred while fetching profile data.");
        }
    };

    // Effect to fetch profile data on component mount if the method is "update"
    React.useEffect(() => {
        if (props.method == "update"){
            fetchProfile();
        }
    }, []);

    // Function to handle profile deletion
    function handledelete(){
        navigate("/account-delete"); // Navigate to account delete confirmation page
    }

    return (
        <div className="form-container">
            {success ? (
                <p className="succ-message">{success}</p> // Display success message
            ) : (
                <>
                    <h1>{props.method == "create" ? "Create New Profile" : "Update Profile"}</h1>
                    <div className="image-preview-container">
                        <img src={imagePreview} alt="Profile Preview" className="image-preview" /> {/* Image preview */}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Profile Picture</label>
                            <input type="file" name="image" onChange={handleChange} /> {/* Input for profile picture */}
                        </div>
                        <div>
                            <label>Full Name</label>
                            <input type="text" name="name" onChange={handleChange} value={formData.name} /> {/* Input for name */}
                        </div>
                        <div>
                            <label>Job</label>
                            <select name="profecion" value={formData.profecion} onChange={handleChange}> {/* Dropdown for profession */}
                                <option value="">Select</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-date">
                            <label>Year</label>
                            <input placeholder="YYYY" type="text" name="year" onChange={handleChange} value={formData.year} /> {/* Year of birth */}
                            <label>Month</label>
                            <input placeholder="MM" type="text" name="month" onChange={handleChange} value={formData.month} /> {/* Month of birth */}
                            <label>Day</label>
                            <input placeholder="DD" type="text" name="date" onChange={handleChange} value={formData.date} /> {/* Day of birth */}
                        </div>
                        <div>
                            <label>Contact</label>
                            <input type="text" name="contact" onChange={handleChange} value={formData.contact} /> {/* Contact number */}
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" name="email" onChange={handleChange} value={formData.email} /> {/* Email address */}
                        </div>
                        <div>
                            <label>Speciality</label>
                            <input type="text" name="special" onChange={handleChange} value={formData.special} /> {/* Specialty */}
                        </div>
                        {loading && <div>Loading...</div>} {/* Show loading indicator */}
                        {error && <div className="error-message">{error}</div>} {/* Show error messages */}
                        <button type="submit" className="button1" disabled={loading}>{props.method == "create" ? "Create" : "Update"}</button> {/* Submit button */}
                        {props.method == "update" && <button type="buutton" className="button2" onClick={handledelete}>Delete Profile</button>} {/* Delete profile button */}
                    </form>
                </>
            )}
        </div>
    );
}
