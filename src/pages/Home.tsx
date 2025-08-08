
import React from 'react';
import { Navigate } from 'react-router-dom';

const Home: React.FC = () => {
  // Redirect to Index page which is our homepage
  return <Navigate to="/" replace />;
};

export default Home;
