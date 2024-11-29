import { Navigate } from "react-router-dom"; // Importing Navigate to redirect the user to login page
import { jwtDecode } from "jwt-decode"; // Importing jwt-decode to decode JWT tokens
import api from "../api"; // Importing the api module to make API requests
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"; // Importing constants for token keys
import { useState, useEffect } from "react"; // Importing React hooks for managing state and side effects

function Protected({ children }) {
    // State to track if the user is authorized
    const [isAuthorized, setIsAuthorized] = useState(null);

    // useEffect hook to run authentication check on component mount
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false)) // If authentication fails, set isAuthorized to false
    }, []) // Empty dependency array ensures this runs once when the component is mounted

    // Function to refresh the access token using the refresh token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN); // Getting the refresh token from localStorage
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken, // Sending refresh token in the API request
            });
            // If refresh is successful, update the access token in localStorage
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true); // Set user as authorized
            } else {
                setIsAuthorized(false); // If refresh fails, set user as unauthorized
            }
        } catch (error) {
            console.log(error); // Log any errors in the process
            setIsAuthorized(false); // Set user as unauthorized on error
        }
    };

    // Function to check if the access token is valid and not expired
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN); // Get the access token from localStorage
        if (!token) {
            setIsAuthorized(false); // If no token, set unauthorized
            return;
        }
        const decoded = jwtDecode(token); // Decode the JWT token to check its expiration
        const tokenExpiration = decoded.exp; // Extract the expiration time from the token
        const now = Date.now() / 1000; // Get current time in seconds

        // If the token is expired, refresh the token
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true); // If the token is valid, set authorized
        }
    };

    // If authorization check is in progress, show loading message
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // If authorized, render the children components; otherwise, redirect to login page
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default Protected;
