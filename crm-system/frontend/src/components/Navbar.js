import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/create-audience">Create Audience</Link>
    </nav>
  );
}

export default Navbar;