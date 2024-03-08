import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { useUserContext } from 'src/contexts/use-user-context';

// ----------------------------------------------------------------------

const PrivateComponent = ({ component: Component, allowedRoles }) => {
  const { userData } = useUserContext();

  // If user is not logged in, go to login page
  if (!userData?.role) {
    enqueueSnackbar('You need to login to access this page.', { variant: 'info' });
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userData.role)) {
    enqueueSnackbar('You are not authorized to access this page.', { variant: 'info' });
    return <Navigate to="/" replace />;
  }

  return Component;
};

export default PrivateComponent;

PrivateComponent.propTypes = {
  component: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
