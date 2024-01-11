import React, {useState} from "react";

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
import PasswordTextField from 'src/layouts/dashboard/common/password-text-field';

import Logo from 'src/components/logo';
// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();
  const [registerData, setRegisterData] = useState({ firstName: '', lastName: '',
                                                        email: '', password: '' ,confirmPassword: ''});


  const handleInputChange = event => {
      const { name, value } = event.target;
      setRegisterData(prevData => ({
          ...prevData,
          [name]: value
      }));
  };

    const handleClick = async () => {
      console.log(registerData);
      try {
          const response = await fetch('http://localhost:3000/users/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(registerData)
          });
          if(response.ok){
              const responseData = await response.json();
              router.push('/login');
          }
      } catch (error) {
          console.error('Network error:', error.message);
      }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="firstName" label="First name" onChange={handleInputChange}/>
        
        <TextField name="lastName" label="Last name" onChange={handleInputChange} />

        <TextField name="email" label="Email address" onChange={handleInputChange}/>

        <TextField name="password" label="Password" onChange={handleInputChange} />

        <TextField name="confirmPassword" label="Confirm password" onChange={handleInputChange} />
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
