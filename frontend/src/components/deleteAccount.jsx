import React, { useState } from 'react';
import api from '../api'; // Assuming you have a configured Axios instance in api.js
import { useNavigate } from 'react-router-dom';
import "../styls/loginpage.css"

export default function DeleteAccountForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
    
        try {
            const response = await api.post('/api/delete-doctor/', {
                data: {user_name: username, password: password},
            });
    
            if (response.status === 200) {
                if (response.data.message === "1") {
                    setSuccess('Account deleted successfully!');
                    setTimeout(() => navigate('/home'), 1000);
                } else if (response.data.message === "0") {
                    setError("Wrong username.");
                }
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || 'An error occurred.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-account-container">
            {success ? (
                <p className="success-message">{success}</p>
            ) : (
                <>
                    <h2>Delete Account</h2>
                    <form onSubmit={handleSubmit} className="delete-account-form">
                        <label htmlFor='username'>Username</label>
                        <input
                            type='text'
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleChangeUsername}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChangePassword}
                            required
                        />
                        {loading && <p>Loading...</p>}
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" disabled={loading}>Delete Account</button>
                    </form>
                </>
            )}
        </div>
    );
}
