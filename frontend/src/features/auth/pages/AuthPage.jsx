import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import toast from 'react-hot-toast';
import { Container, Box, Typography, TextField, Button, Link, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = loginLoading || registerLoading;

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const result = isLogin
        ? await login({ email: formData.email, password: formData.password }).unwrap()
        : await register(formData).unwrap();

      if (result.success) {
        dispatch(setCredentials({ token: result.token, user: result.user }));
        toast.success(isLogin ? 'Welcome back!' : 'Account created!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  }, [isLogin, formData, login, register, dispatch, navigate]);

  const toggleMode = useCallback(() => {
    setIsLogin((prev) => !prev);
    setFormData({ username: '', email: '', password: '' }); // reset
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {isLogin ? 'Sign In' : 'Create Account'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          {!isLogin && (
            <TextField
              name="username"
              label="Username"
              fullWidth
              margin="normal"
              required
              value={formData.username}
              onChange={handleInputChange}
            />
          )}

          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={formData.email}
            onChange={handleInputChange}
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={formData.password}
            onChange={handleInputChange}
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            loading={isLoading}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </LoadingButton>

          <Typography sx={{ mt: 3, textAlign: 'center' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link component="button" type="button" onClick={toggleMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}