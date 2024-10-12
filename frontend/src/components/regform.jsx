import React, { useState } from "react";
import api from "../api";
import "../styls/regform.css";
import userIMG from "../images/user.jpg";
import { useNavigate } from "react-router-dom";

export default function RegisterForm(props) {
    const [formData, setFormData] = useState({
        image: null,
        name: "",
        profecion: "",
        year: "",
        month: "",
        date: "",
        contact: "",
        email: "",
        special: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState(userIMG);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value, type, files } = event.target;
        const new_data = type === "file" ? { ...formData, [name]: files[0] } : { ...formData, [name]: value };
        setFormData(new_data);

        if (type === "file" && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the image preview to the uploaded file
            };
            reader.readAsDataURL(files[0]);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
    
        // Validate form fields (optional but recommended)
        if (!formData.name || !formData.profecion || !formData.year || !formData.month || !formData.date || !formData.contact || !formData.email) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }
    
        const birthDate = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.date.padStart(2, '0')}`;
        const data = new FormData();
        if (formData.image) {
            data.append("image", formData.image);
        }
        data.append("name", formData.name);
        data.append("profecion", formData.profecion);
        data.append("birth", birthDate);
        data.append("contact", formData.contact);
        data.append("email", formData.email);
        data.append("specility", formData.special);
    
        try {
            if (props.method === "create") {
                await api.post("/api/doctors/", data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess("Profile created successfully!");
            } else if (props.method === "update") {
                await api.patch("/api/profile/update/", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setSuccess("Profile updated successfully!");
            }
            setTimeout(() => navigate('/home'), 1000);
        } catch (error) {
            setError('Error updating doctor profile: ' + JSON.stringify(error.response?.data));
        } finally {
            setLoading(false);
        }
    };
    

    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/profile/");
            setFormData(res.data);
            const [year1, month1, date1] = res.data.birth.split('-');
            setFormData(prevdata => ({
                ...prevdata,
                year: year1,
                month: month1,
                date: date1,
                special: res.data.specility,
                image:null
            }))

            const imageUrl = res.data.image.startsWith('/') 
                ? res.data.image.substring(1) 
                : res.data.image;
                setImagePreview(`${import.meta.env.VITE_API_URL}${imageUrl}`);

        } catch (error) { 
            console.error("Error fetching profile data:", error);
            alert("An error occurred while fetching profile data.");
        }
    };

    React.useEffect(() => {
        if (props.method == "update"){
            fetchProfile();
        }
    }, []);

    function handledelete(){
        navigate("/account-delete")
    }
    return (
        <div className="form-container">
            {success ? (
                <p className="succ-message">{success}</p>
            ) : (
                <>
                    <h1>{props.method == "create" ? "Create New Profile" : "Update Profile"}</h1>
                    <div className="image-preview-container">
                        <img src={imagePreview} alt="Profile Preview" className="image-preview" />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Profile Picture</label>
                            <input type="file" name="image" onChange={handleChange} />
                        </div>
                        <div>
                            <label>Full Name</label>
                            <input type="text" name="name" onChange={handleChange} value={formData.name} />
                        </div>
                        <div>
                            <label>Job</label>
                            <select name="profecion" value={formData.profecion} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-date">
                            <label>Year</label>
                            <input placeholder="YYYY" type="text" name="year" onChange={handleChange} value={formData.year} />
                            <label>Month</label>
                            <input placeholder="MM" type="text" name="month" onChange={handleChange} value={formData.month} />
                            <label>Day</label>
                            <input placeholder="DD" type="text" name="date" onChange={handleChange} value={formData.date} />
                        </div>
                        <div>
                            <label>Contact</label>
                            <input type="text" name="contact" onChange={handleChange} value={formData.contact} />
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" name="email" onChange={handleChange} value={formData.email} />
                        </div>
                        <div>
                            <label>Speciality</label>
                            <input type="text" name="special" onChange={handleChange} value={formData.special} />
                        </div>
                        {loading && <div>Loading...</div>}
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="button1" disabled={loading}>{props.method == "create" ? "Create" : "Update"}</button>
                        {props.method == "update" && <button type="buutton" className="button2" onClick={handledelete}>Delete Profile</button>}
                    </form>
                </>
            )}
        </div>
    );
}
