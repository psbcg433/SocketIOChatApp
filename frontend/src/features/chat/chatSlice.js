// src/features/chat/chatSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: {},
  typing: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    messageSent: (state, action) => {
      const { conversationId, message } = action.payload;
      state.messages[conversationId] = [...(state.messages[conversationId] || []), message];
    },
    messageReceived: (state, action) => {
      // same as messageSent for now - or customize if needed
      const { conversationId, message } = action.payload;
      state.messages[conversationId] = [...(state.messages[conversationId] || []), message];
    },
    typingStart: (state, action) => {
      const { conversationId, userId } = action.payload;
      state.typing[conversationId] = new Set(state.typing[conversationId] || []);
      state.typing[conversationId].add(userId);
    },
    typingStop: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (state.typing[conversationId]) {
        state.typing[conversationId].delete(userId);
        if (state.typing[conversationId].size === 0) delete state.typing[conversationId];
      }
    },
  },
});

// Export the actions as named exports (this is what useChat.js needs)
export const { 
  messageSent, 
  messageReceived, 
  typingStart, 
  typingStop 
} = chatSlice.actions;

// Export the reducer as default (already there for store)
export default chatSlice.reducer;