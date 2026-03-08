import { authApi } from '../auth/api/authApi'; // Your existing

export const enhancedApi = authApi.enhanceEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({ conversationId, before, limit = 20 }) => ({
        url: `/chat/messages/${conversationId}`,
        params: { before, limit },
      }),
      providesTags: ['Messages'],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, content }) => ({
        url: `/chat/messages/${conversationId}`,
        method: 'POST',
        body: { conversationId, content },
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = enhancedApi;