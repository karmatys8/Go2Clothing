import React, { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { handleNetworkError, handleUnexpectedError } from 'src/utils/handle-common-errors';

import { useUserContext } from 'src/contexts/use-user-context';

import Iconify from 'src/components/iconify';
import EmailTextField from 'src/components/email-text-field';
import StyledForm from 'src/components/styled-form/styled-form';
import PasswordTextField from 'src/components/password-text-field';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();
  const { setUserData } = useUserContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRequestPending, setIsRequestPending] = useState(false);

  const login = async (event) => {
    event.preventDefault();
    setIsRequestPending(true);

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        handleSuccess(data);
      } else handleError(response, data);
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setIsRequestPending(false);
    }
  };

  const handleSuccess = (data) => {
    localStorage.setItem('WDAI_Project_token', data.token);
    setUserData({ ...data.user, token: data.token });

    router.back();
    enqueueSnackbar('Login successful', { variant: 'success' });
  };

  const handleError = (response, data) => {
    if (response.status === 401) {
      enqueueSnackbar('Invalid password', { variant: 'error' });
    } else if (response.status === 404) {
      enqueueSnackbar('User with given email does not exist', { variant: 'error' });
    } else if (response.status === 422) {
      enqueueSnackbar(`Invalid data: ${data.error}`, { variant: 'error' });
    } else if (response.status === 500) {
      enqueueSnackbar(`Failed to login due to a server error`, { variant: 'error' });
    } else handleUnexpectedError(data.error, 'while logging in');
  };

  const renderQuickLogin = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        size="large"
        color="inherit"
        variant="outlined"
        sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
      >
        <Iconify icon="eva:google-fill" color="#DF3E30" />
      </Button>

      <Button
        fullWidth
        size="large"
        color="inherit"
        variant="outlined"
        sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
      >
        <Iconify icon="eva:facebook-fill" color="#1877F2" />
      </Button>

      <Button
        fullWidth
        size="large"
        color="inherit"
        variant="outlined"
        sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
      >
        <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
      </Button>
    </Stack>
  );

  const renderForm = (
    <form onSubmit={login}>
      <Stack spacing={3}>
        <EmailTextField email={email} setEmail={setEmail} />
        <PasswordTextField name="password" label="Password" setState={setPassword} />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link component={RouterLink} variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        loading={isRequestPending}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
      >
        Login
      </LoadingButton>
    </form>
  );

  return (
    <StyledForm>
      <Typography variant="h4">Sign in to Go2Clothes</Typography>

      <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
        Don’t have an account?
        <Link component={RouterLink} href="/register" variant="subtitle2" sx={{ ml: 0.5 }}>
          Get started
        </Link>
      </Typography>

      {renderQuickLogin}

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>

      {renderForm}
    </StyledForm>
  );
}
