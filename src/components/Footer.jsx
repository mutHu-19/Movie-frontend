import React from 'react';
import '../index.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Movie Explore. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
