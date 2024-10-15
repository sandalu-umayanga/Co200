import React from "react";
import { useNavigate } from "react-router-dom";
import "../styls/homepage.css"; // Ensure the path is correct
import homeimage from "../images/home-img.png";
import hback from "../images/hback.jpg";
import h3back from "../images/h3back.jpg";

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${h3back})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

      }}
    >

      {/* Background overlay */}
      <div className="background-overlay"></div>

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
              <button type="button" onClick={handleLogin} className="staffLogin">
                <span>Staff Login</span>
              </button>
            </div>
          </div>
          <div className="image-container">
            <img className="homeimage" src={homeimage} alt="Home" loading="lazy" />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <p>&copy; 2024 Peradeniya Hospital Cath Lab Management System. All rights reserved.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
