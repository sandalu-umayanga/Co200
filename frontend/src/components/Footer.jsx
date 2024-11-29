import React from 'react';
import '../styls/Footer.css'; // Importing the CSS file for styling the Footer component

// Importing images for social media icons and contact details
import fb from '../img/fb.svg';
import ig from '../img/ig.svg';
import tt from '../img/tt.svg';
import li from '../img/li.svg';
import env from '../img/env.png';
import phone from '../img/phone.png';
import loc from '../img/loc.png';

// Footer component definition
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About section with company name, tagline, and contact information */}
        <div className="footer-section about">
          <h2>CathLab</h2>
          <p>Protect Lives</p>
          <div className="contact">
            {/* Contact information with phone, email, and location */}
            <span>
              <img src={phone} alt='phone' /> +94 70 2 4 8 16 32 {/* Display phone number */}
            </span>
            <span>
              <img src={env} alt='env' /> support@cathlab.com {/* Display email */}
            </span>
            <span>
              <img src={loc} alt='loc' /> cathlab, Peradeniya, Kandy {/* Display location */}
            </span>
          </div>
        </div>

        {/* Quick Links section for navigation */}
        <div className="footer-section">
          <h2>Quick Links</h2>
          <ul>
            <li>
              <a href="/">Home</a> {/* Link to the home page */}
            </li>
          </ul>
        </div>

        {/* Social media links section */}
        <div className="footer-section social">
          <h2>Follow Us</h2>
          <div className="social-links">
            {/* Social media icons linking to their respective platforms */}
            <a href="https://www.facebook.com">
              <img src={fb} alt="fb" />
            </a>
            <a href="https://www.twitter.com">
              <img src={tt} alt="tt" />
            </a>
            <a href="https://www.linkedin.com">
              <img src={li} alt="li" />
            </a>
            <a href="https://www.instagram.com">
              <img src={ig} alt="ig" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer bottom section with copyright information */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} SmartHub. All rights reserved.
      </div>
    </footer>
  );
}
