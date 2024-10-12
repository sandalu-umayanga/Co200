import React from "react";
import { useNavigate } from "react-router-dom";
import "../styls/homepage.css";
import homeimage from "../images/home-img.png";

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home-page">
      {/* Background container */}
      <div className="background"></div>

      {/* Fixed header at the top */}
      <header className="home-header">
        <h1>Welcome to the Cath Lab Management System</h1>
        <p>Manage all your cath lab operations efficiently.</p>
      </header>

      {/* Main content container */}
      <div className="home-container">
        <section className="home-info">
          <div className="home-info-detail">
            <h3>Peradeniya Hospital</h3>
            <p>Contact: 077XXXXXXXX</p>
            <p>Email: cathlab@gmail.com</p>
            <div className="b_container">
              <button type="submit" onClick={handleLogin}>
                Staff Login
              </button>
            </div>
          </div>
          <div>
            <img className="homeimage" src={homeimage} alt="Home Image" />
          </div>
        </section>
      </div>
    </div>
  );
}
