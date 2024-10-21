import React from 'react';
import '../styls/Footer.css'; // Separate CSS file for styling

const Footer = () => {
  return (
    <footer className="home-footer">
      <div className="footer-content">
        <p className="logo">CathLab</p>
        <p>&copy; 2024 Peradeniya Hospital Cath Lab Management System. All rights reserved.</p>
        <div className="social-links">
          <a href="#" aria-label="Facebook">
            <i className="fab fa-facebook-f">Facebook</i>
          </a>
          <a href="#" aria-label="Twitter">
            <i className="fab fa-twitter">Twitter</i>
          </a>
          <a href="#" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in">LinkedIn</i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
