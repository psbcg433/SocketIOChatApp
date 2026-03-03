import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/slices/authSlice';
import { useLogoutMutation } from '../features/auth/api/authApi';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import toast from 'react-hot-toast';
import { memo } from 'react';

const DashboardPage = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {}
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <Container>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h3">Welcome, {user?.username} 👋</Typography>
        <Typography sx={{ mt: 2 }}>Phase 1 complete with refresh token security</Typography>
        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 4 }}>
          Logout
        </Button>
      </Box>
    </Container>
  );
});

export default DashboardPage;