import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({ query: (body) => ({ url: '/auth/login', method: 'POST', body }) }),
    register: builder.mutation({ query: (body) => ({ url: '/auth/register', method: 'POST', body }) }),
    logout: builder.mutation({ query: () => ({ url: '/auth/logout', method: 'POST' }) }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;