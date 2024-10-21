import React, { useState } from "react";
import api from "../api";
import "../styls/regform.css";
import { useNavigate } from "react-router-dom";

export default function PatientForm(props) {
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate form fields (optional but recommended)
        if (!formData.national_id || !formData.hospital_id || !formData.name || !formData.year || !formData.month || !formData.date || !formData.address || !formData.contact) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        const birthDate = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.date.padStart(2, '0')}`;
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
            if (props.method === "create") {
                await api.post("/api/patients/", data);
                setSuccess("Patient created successfully!");
            } else if (props.method === "update") {
                await api.patch("/api/patients/update/", data);
                setSuccess("Patient updated successfully!");
            }
            setTimeout(() => navigate('/home'), 1000);
        } catch (error) {
            setError('Error updating patient profile: Invalid National ID or Hospita ID ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            {success ? (
                <p className="succ-message">{success}</p>
            ) : (
                <>
                    <h1>{props.method === "create" ? "Create New Patient" : "Update Patient"}</h1>
                    <form onSubmit={handleSubmit}>
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
                        {loading && <div>Loading...</div>}
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="button1" disabled={loading}>
                            {props.method === "create" ? "Create" : "Update"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
