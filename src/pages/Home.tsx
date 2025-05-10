
import React from 'react';
import { Navigate } from 'react-router-dom';

const Home: React.FC = () => {
  // Redirect to SiteAudit page which is now our homepage
  return <Navigate to="/site-audit" replace />;
};

export default Home;
