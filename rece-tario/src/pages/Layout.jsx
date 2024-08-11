import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import { AuthProvider } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <div className="container">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
