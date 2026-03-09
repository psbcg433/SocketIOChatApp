import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../features/auth/api/authApi';
import authReducer from '../features/auth/slices/authSlice';
import chatReducer from '../features/chat/chatSlice';
import { enhancedApi as chatApi } from '../features/chat/chatApi'; 

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,  
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware), 
});

setupListeners(store.dispatch);
export default store;