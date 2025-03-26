
import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center font-bold text-xl">
      <span className="text-primary">SEO</span>
      <span>Market</span>
    </Link>
  );
};

export default NavbarLogo;
