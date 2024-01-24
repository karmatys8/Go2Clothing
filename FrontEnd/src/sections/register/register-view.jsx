import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import EmailTextField from 'src/components/email-text-field';
import PasswordTextField from 'src/components/password-text-field';
// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();
  const [nameData, setNameData] = useState({ firstName: '', lastName: '' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNameChange = (event) => {
    const { name, value } = event.target;
    setNameData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...nameData, email, password, confirmPassword }),
      });
      if (response.ok) {
        await response.json();

        router.push('/login');
      }
    } catch (error) {
      console.error('Network error:', error.message);
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="firstName" label="First name" onChange={handleNameChange} />

        <TextField name="lastName" label="Last name" onChange={handleNameChange} />

        <EmailTextField email={email} setEmail={setEmail} />

        <PasswordTextField name="password" label="Password" setState={setPassword} />

        <PasswordTextField
          name="confirmPassword"
          label="Confirm password"
          setState={setConfirmPassword}
          error={password !== confirmPassword}
          helperText={password !== confirmPassword ? 'Passwords do not match' : ''}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        sx={{ mt: 5 }}
      >
        Register
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{ mb: 5 }}>
            Register to Minimal
          </Typography>

          <Divider sx={{ my: 3 }} />

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
