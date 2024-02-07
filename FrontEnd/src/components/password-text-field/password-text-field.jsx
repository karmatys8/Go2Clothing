import PropTypes from 'prop-types';
import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

PasswordTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  additionalOnChangeFunction: PropTypes.func,
};

export default function PasswordTextField({
  name,
  label,
  setState,
  error,
  helperText,
  additionalOnChangeFunction,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setState(event.target.value);
    if (typeof additionalOnChangeFunction === 'function') additionalOnChangeFunction();
  };

  return (
    <TextField
      name={name}
      label={label}
      type={showPassword ? 'text' : 'password'}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
