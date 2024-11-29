import React, { useState } from 'react';
import api from '../api'; // Assuming you have a configured Axios instance in api.js
import { useNavigate } from 'react-router-dom';
import "../styls/loginpage.css"; // Importing CSS file for styling

export default function DeleteAccountForm() {
    // State hooks for username, password, loading status, error messages, and success messages
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Hook for navigation
    const navigate = useNavigate();

    // Handler for updating the username state when input changes
    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
    };

    // Handler for updating the password state when input changes
    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    // Form submission handler to delete the account
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setLoading(true); // Show loading indicator
        setError(''); // Clear any previous error messages
        setSuccess(''); // Clear any previous success messages
    
        try {
            // Make a POST request to the API with username and password
            const response = await api.post('/api/delete-doctor/', {
                data: { user_name: username, password: password },
            });
    
            if (response.status === 200) {
                // Check the response message and update the UI accordingly
                if (response.data.message === "1") {
                    setSuccess('Account deleted successfully!');
                    // Redirect to the home page after 1 second
                    setTimeout(() => navigate('/home'), 1000);
                } else if (response.data.message === "0") {
                    setError("Wrong username."); // Handle incorrect username
                }
            }
        } catch (error) {
            // Handle API errors
            if (error.response) {
                setError(error.response.data.error || 'An error occurred.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <div className="delete-account-container">
            {success ? (
                // Show a success message if the account is deleted
                <p className="success-message">{success}</p>
            ) : (
                <>
                    {/* Delete Account form */}
                    <h2>Delete Account</h2>
                    <form onSubmit={handleSubmit} className="delete-account-form">
                        {/* Input field for username */}
                        <label htmlFor='username'>Username</label>
                        <input
                            type='text'
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleChangeUsername}
                            required
                        />
                        {/* Input field for password */}
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChangePassword}
                            required
                        />
                        {/* Display loading message when the form is submitting */}
                        {loading && <p>Loading...</p>}
                        {/* Display error message if any */}
                        {error && <p className="error-message">{error}</p>}
                        {/* Submit button */}
                        <button type="submit" disabled={loading}>Delete Account</button>
                    </form>
                </>
            )}
        </div>
    );
}
