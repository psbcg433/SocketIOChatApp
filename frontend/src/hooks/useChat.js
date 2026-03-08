import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSocket } from './useSocket';
import { messageReceived, typingStart, typingStop } from '../features/chat/chatSlice.js';

export const useChat = (conversationId) => {
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleReceived = ({ message }) => dispatch(messageReceived({ conversationId, message }));
    const handleTypingStart = ({ userId }) => dispatch(typingStart({ conversationId, userId }));
    const handleTypingStop = ({ userId }) => dispatch(typingStop({ conversationId, userId }));

    socket.on('message:received', handleReceived);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);

    return () => {
      socket.off('message:received', handleReceived);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
    };
  }, [socket, dispatch, conversationId]);

  const sendMessage = useCallback((content) => {
    socket.emit('message:send', { conversationId, content });
  }, [socket, conversationId]);

  const startTyping = useCallback(() => socket.emit('typing:start', { conversationId }), [socket, conversationId]);
  const stopTyping = useCallback(() => socket.emit('typing:stop', { conversationId }), [socket, conversationId]);

  return { sendMessage, startTyping, stopTyping };
};