import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGetMessagesQuery, useSendMessageMutation } from '../features/chat/chatApi';
import { useChat } from '../hooks/useChat';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useSelector, useDispatch } from 'react-redux';
import { messageSent } from '../features/chat/chatSlice';
import { Box, List, ListItem, Typography, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useDebounce } from 'use-debounce';

const ChatRoom = () => {
  const { conversationId } = useParams();
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();
  const { sendMessage, startTyping, stopTyping } = useChat(conversationId);
  const typingUsers = useSelector(state => state.chat.typing[conversationId] || new Set());
  const messages = useSelector(state => state.chat.messages[conversationId] || []);
  const { data, fetchNextPage, isFetching, hasNextPage } = useGetMessagesQuery({ conversationId });
  const [debouncedContent] = useDebounce(content, 500);
  const listRef = useRef(null);

  const { ref } = useInfiniteScroll(fetchNextPage, hasNextPage);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'chat/receiveMessages', payload: { conversationId, messages: data.pages.flatMap(p => p.messages) } }); // Initial sync
    }
  }, [data, dispatch, conversationId]);

  const handleSend = () => {
    if (!content.trim()) return;
    const optimistic = { content, sender: 'me', id: Date.now() };
    dispatch(messageSent({ conversationId, message: optimistic }));
    sendMessage(content);
    setContent('');
  };

  useEffect(() => {
    if (debouncedContent && !isTyping) {
      setIsTyping(true);
      startTyping();
    } else if (!debouncedContent && isTyping) {
      setIsTyping(false);
      stopTyping();
    }
  }, [debouncedContent, isTyping, startTyping, stopTyping]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <List ref={listRef} sx={{ flex: 1, overflow: 'auto' }}>
        {isFetching && <CircularProgress />}
        {messages.map(msg => (
          <ListItem key={msg._id || msg.id}>
            <Typography>{msg.content}</Typography>
          </ListItem>
        ))}
        <div ref={ref} />
      </List>
      {typingUsers.size > 0 && <Typography variant="caption">Someone is typing...</Typography>}
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField fullWidth value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type..." />
        <IconButton onClick={handleSend} disabled={!content.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatRoom;