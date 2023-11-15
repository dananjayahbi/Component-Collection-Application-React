import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, Typography, Container, CssBaseline, Grid, Link, TextField, Paper } from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import axios from 'axios';

const CustomTextField = ({ field, form, ...props }) => {
  return <TextField {...field} {...props} />;
};

const Login = () => {
  const [error, setError] = useState('');

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post('http://localhost:8070/users/login', values);
      // Handle successful login
      console.log('Login successful', response.data);
      window.localStorage.setItem('token', response.data);
      window.localStorage.setItem('LoggedIn', true);
      window.location.href = '/';
    } catch (error) {
      // Handle login error
      console.error('Login failed', error);
      setError('Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CssBaseline />
      <Paper elevation={3} style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}>
        <LockOutlinedIcon />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate>
              <Field
                component={CustomTextField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
              />
              <Field
                component={CustomTextField}
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                style={{ margin: '16px 0' }}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Login;
