import React, { useId } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "./loading";
import "../styls/loginpage.css";
import h2back from "../images/h2back.jpg";

function LoginForm(props) {
  const navigate = useNavigate();
  const [FormData, SetFormData] = React.useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const id = useId();
  const [Loading, SetLoading] = React.useState(false);
  const [Error, SetError] = React.useState("");
  const title = props.method === "login" ? "Login" : "Register";

  function handleChange(event) {
    const { name, value } = event.target;
    SetFormData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  }

  // Regular expression to check for strong password (only for registration)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const handleSubmit = async (event) => {
    SetLoading(true);
    event.preventDefault();

    try {
      const username = FormData.username;
      const password = FormData.password;
      const confirm = FormData.confirmPassword;

      if (props.method === "register") {
        if (!passwordRegex.test(password)) {
          SetError(
            "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character."
          );
          SetLoading(false);
          return;
        }
      }

      if (props.method === "login") {
        const res = await api.post(props.rout, { username, password });
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/home");
      } else {
        if (password === confirm) {
          const res = await api.post(props.rout, { username, password });
          navigate("/home");
        } else {
          SetError("Password and Confirm Password didn't match");
        }
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            SetError("There is a user with this username");
            break;
          case 401:
            SetError("Unauthorized: Incorrect username or password.");
            break;
          case 403:
            SetError(
              "Forbidden: You do not have permission to access this resource."
            );
            break;
          case 404:
            SetError("Not Found: The requested resource could not be found.");
            break;
          case 500:
            SetError("Server Error: Please try again later.");
            break;
          default:
            SetError("An unexpected error occurred: " + error.response.status);
            break;
        }
      }
    } finally {
      SetLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="content">
        <div
          className="form-container-login"
          style={{
            backgroundImage: `url(${h2back})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.9,
          }}
        >
          <h1>{title}</h1>
          <form onSubmit={handleSubmit} className="login-Form">
            <label htmlFor={id + "--username"}>User name</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              value={FormData.username}
              id={id + "--username"}
              required
            />
            <label htmlFor={id + "--password"}>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={FormData.password}
              id={id + "--password"}
              required
            />
            {props.method === "register" && (
              <div>
                <label htmlFor={id + "--conf"}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={FormData.confirmPassword}
                  id={id + "--conf"}
                  required
                />
              </div>
            )}
            {Loading && (
              <div className="loader1">
                <LoadingIndicator />
              </div>
            )}
            {Error !== "" && <div className="error-message">{Error}</div>}
            <button type="submit">{title}</button>
          </form>
        </div>
        <footer className="login-footer">
          <div className="footer-content">
            <p className="logo">CathLab</p>
            <p>
              &copy; 2024 Peradeniya Hospital Cath Lab Management System. All
              rights reserved.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f">facebook</i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter">twitter</i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in">linkedin</i>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LoginForm;
