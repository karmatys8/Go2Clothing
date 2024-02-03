import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { useUserContext } from 'src/contexts/use-user-context';

// ----------------------------------------------------------------------

const PrivateComponent = ({ component: Component, allowedRoles }) => {
  const { userData } = useUserContext();

  const redirectComponent = allowedRoles.includes(userData?.role) ? (
    Component
  ) : (
    <Navigate to="/" replace />
  );

  // if user is not logged in go to login page
  return userData?.role ? redirectComponent : <Navigate to="/login" replace />;
};

export default PrivateComponent;

PrivateComponent.propTypes = {
  component: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
