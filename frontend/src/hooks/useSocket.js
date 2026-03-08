import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:5000', { autoConnect: false });

export const useSocket = () => {
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (!token) {
      socket.disconnect();
      return;
    }

    socket.auth = { token };
    socket.connect();

    return () => socket.disconnect();
  }, [token]);

  return socket;
};