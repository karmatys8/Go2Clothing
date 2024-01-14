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
};

export default function PasswordTextField({ name, label, setState }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setState(event.target.value);
  };

  return (
    <TextField
      name={name}
      label={label}
      type={showPassword ? 'text' : 'password'}
      onChange={handleChange}
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
