import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,           
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   setCredentials: (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.accessToken;        
  state.refreshToken = action.payload.refreshToken; 
  state.isAuthenticated = true;
},
    logout: (state) => {
  state.user = null;
  state.token = null;
  state.refreshToken = null;
  state.isAuthenticated = false;
}
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;