import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

EmailTextField.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
};

export default function EmailTextField({ email, setEmail }) {
  const [isValid, setIsValid] = useState('');

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  useEffect(() => {
    const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    setIsValid(emailRegExp.test(email));
  }, [email]);

  return (
    <TextField
      name="email"
      label="Email address"
      onChange={handleChange}
      error={!isValid}
      helperText={`Email is ${isValid ? '' : 'in'}valid`}
    />
  );
}
