import React from 'react';
import '../styls/Footer.css';

import fb from '../img/fb.svg';
import ig from '../img/ig.svg';
import tt from '../img/tt.svg';
import li from '../img/li.svg';
import env from '../img/env.png';
import phone from '../img/phone.png';
import loc from '../img/loc.png';


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>CathLab</h2>
          <p>Protect Lives</p>
          <div className="contact">
            <span><img src={phone} alt='phone'/> +94 70 2 4 8 16 32</span>
            <span><img src={env} alt='env'/> support@cathlab.com</span>
            <span><img src={loc} alt='loc'/> cathlab, Peradeniya, Kandy</span>
          </div>
        </div>

        <div className="footer-section">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/">Home</a></li>

          </ul>
        </div>

        <div className="footer-section social">
          <h2>Follow Us</h2>
          <div className="social-links">
            <a href="https://www.facebook.com"><img src={fb} alt="fb" /></a>
            <a href="https://www.twitter.com"><img src={tt} alt="tt" /></a>
            <a href="https://www.linkedin.com"><img src={li} alt="li" /></a>
            <a href="https://www.instagram.com"><img src={ig} alt="ig" /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} SmartHub. All rights reserved.
      </div>
    </footer>
  );
}
