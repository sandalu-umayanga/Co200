import React, { useId } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";  // Importing token constants
import api from "../api";  // Importing the API instance for making requests
import { useNavigate } from "react-router-dom";  // Importing useNavigate hook for navigation after login/register
import LoadingIndicator from "./loading";  // Importing a loading indicator component
import "../styls/loginpage.css";  // Importing the CSS file for styling the login page

function LoginForm(props) {
  const navigate = useNavigate();  // Initialize navigation function
  // State to handle form data (username, password, confirmPassword)
  const [FormData, SetFormData] = React.useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const id = useId();  // Generate a unique ID for form elements
  const [Loading, SetLoading] = React.useState(false);  // State to handle loading indicator
  const [Error, SetError] = React.useState("");  // State to handle error messages
  const title = props.method === "login" ? "Login" : "Register";  // Dynamic title based on method (login/register)

  // Handle input change for form fields
  function handleChange(event) {
    const { name, value } = event.target;
    SetFormData((prevdata) => ({
      ...prevdata,  // Spread the previous form data and update the respective field
      [name]: value,  // Dynamically update the form field based on name attribute
    }));
  }

  // Handle form submission (login or register)
  const handleSubmit = async (event) => {
    SetLoading(true);  // Set loading state to true when form is submitted
    event.preventDefault();  // Prevent the default form submission behavior

    try {
      const username = FormData.username;
      const password = FormData.password;
      const confirm = FormData.confirmPassword;
      if (props.method === "login") {  // If login method is selected
        const res = await api.post(props.rout, { username, password });  // Send POST request for login
        localStorage.setItem(ACCESS_TOKEN, res.data.access);  // Store access token in localStorage
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);  // Store refresh token in localStorage
        navigate("/home");  // Redirect to the home page after successful login
      } else {  // If register method is selected
        if (password === confirm) {  // Check if password and confirm password match
          const res = await api.post(props.rout, { username, password });  // Send POST request for registration
          navigate("/home");  // Redirect to the home page after successful registration
        } else {
          SetError("Password and Confirm Password didn't match");  // Display error if passwords don't match
        }
      }
    } catch (error) {
      // Handle different error responses from the backend
      if (error.response) {
        switch (error.response.status) {
          case 400:
            SetError("There is a user with this username");  // Error for existing username
            break;
          case 401:
            SetError("Unauthorized: Incorrect username or password.");  // Error for invalid credentials
            break;
          case 403:
            SetError(
              "Forbidden: You do not have permission to access this resource."  // Error for forbidden access
            );
            break;
          case 404:
            SetError("Not Found: The requested resource could not be found.");  // Error for resource not found
            break;
          case 500:
            SetError("Server Error: Please try again later.");  // Error for server issues
            break;
          default:
            SetError("An unexpected error occurred: " + error.response.status);  // Default error message
            break;
        }
      }
    } finally {
      SetLoading(false);  // Set loading state to false after the request is finished (either success or failure)
    }
  };

  return (
    <div className="main-container">
      <div className="content">
        <div
          className="form-container-login"
        >
          <h1>{title}</h1>  {/* Display dynamic title */}
          <form onSubmit={handleSubmit} className="login-Form">
            {/* Input field for username */}
            <label htmlFor={id + "--username"}>User name</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}  // Handle username change
              value={FormData.username}
              id={id + "--username"}  // Use dynamically generated ID
              required
            />
            {/* Input field for password */}
            <label htmlFor={id + "--password"}>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}  // Handle password change
              value={FormData.password}
              id={id + "--password"}  // Use dynamically generated ID
              required
            />
            {/* Conditional render for confirm password field during registration */}
            {props.method === "register" && (
              <div>
                <label htmlFor={id + "--conf"}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}  // Handle confirm password change
                  value={FormData.confirmPassword}
                  id={id + "--conf"}  // Use dynamically generated ID
                  required
                />
              </div>
            )}
            {/* Display loading indicator when form is submitting */}
            {Loading && (
              <div className="loader1">
                <LoadingIndicator />  {/* Display loading indicator */}
              </div>
            )}
            {/* Display error message if any */}
            {Error !== "" && <div className="error-message">{Error}</div>}
            {/* Submit button */}
            <button type="submit">{title}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
