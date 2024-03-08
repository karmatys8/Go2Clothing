import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useDebouncedCallback } from 'use-debounce';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { handleNetworkError, handleUnexpectedError } from 'src/utils/handle-common-errors';

import EmailTextField from 'src/components/email-text-field';
import StyledForm from 'src/components/styled-form/styled-form';
import PasswordTextField from 'src/components/password-text-field';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const router = useRouter();
  const [nameData, setNameData] = useState({ firstName: '', lastName: '' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [arePasswordsEqual, setArePasswordsEqual] = useState(true);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const debounce = useDebouncedCallback(() => {
    setArePasswordsEqual(password === confirmPassword);
  }, 500);

  const handleNameChange = (event) => {
    const { name, value } = event.target;
    setNameData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const register = async (event) => {
    event.preventDefault();
    setIsRequestPending(true);

    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...nameData, email, password, confirmPassword }),
      });

      if (response.ok) {
        router.push('/login');
        enqueueSnackbar('Register successful', { variant: 'success' });
      } else handleError(response);
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setIsRequestPending(false);
    }
  };

  const handleError = async (response) => {
    const data = await response.json();

    if (response.status === 409) {
      enqueueSnackbar('Email already in use', { variant: 'error' });
    } else if (response.status === 422) {
      enqueueSnackbar(`Invalid data: ${data.error}`, { variant: 'error' });
    } else if (response.status === 500) {
      enqueueSnackbar(`Failed to register due to a server error`, { variant: 'error' });
    } else handleUnexpectedError(data.error, 'while registering');
  };

  const renderForm = (
    <form onSubmit={register}>
      <Stack spacing={3}>
        <TextField name="firstName" label="First name" onChange={handleNameChange} />

        <TextField name="lastName" label="Last name" onChange={handleNameChange} />

        <EmailTextField email={email} setEmail={setEmail} />

        <PasswordTextField
          name="password"
          label="Password"
          setState={setPassword}
          additionalOnChangeFunction={debounce}
        />

        <PasswordTextField
          name="confirmPassword"
          label="Confirm password"
          setState={setConfirmPassword}
          additionalOnChangeFunction={debounce}
          error={!arePasswordsEqual}
          helperText={`Passwords do ${arePasswordsEqual ? '' : 'not'} match`}
        />
      </Stack>

      <LoadingButton
        loading={isRequestPending}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        sx={{ mt: 5 }}
      >
        Register
      </LoadingButton>
    </form>
  );

  return (
    <StyledForm>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Register to Minimal
      </Typography>

      <Divider sx={{ my: 3 }} />

      {renderForm}
    </StyledForm>
  );
}
