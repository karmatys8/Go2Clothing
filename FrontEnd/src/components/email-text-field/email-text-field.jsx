import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

EmailTextField.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
};

export default function EmailTextField({ email, setEmail }) {
  const [isValid, setIsValid] = useState(true);

  const debounce = useDebouncedCallback(() => {
    if (email) {
      const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      setIsValid(emailRegExp.test(email));
    } else {
      setIsValid(true);
    }
  }, 500);

  const handleChange = (event) => {
    setEmail(event.target.value);
    debounce();
  };

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
