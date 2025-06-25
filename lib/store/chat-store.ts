import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}

interface ChatState {
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  addMessage: (
    paperId: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: (paperId: string) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: {},
      isLoading: false,
      error: null,
      addMessage: (paperId, message) => {
        try {
          if (!paperId?.trim()) {
            throw new Error('Paper ID is required');
          }
          if (!message.content?.trim()) {
            throw new Error('Message content cannot be empty');
          }

          const newMessage: Message = {
            ...message,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          };

          set((state) => {
            const currentMessages = state.messages[paperId] || [];
            return {
              messages: {
                ...state.messages,
                [paperId]: [...currentMessages, newMessage],
              },
            };
          });
        } catch (error) {
          console.error('Failed to add message:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to add message';
          set({ error: errorMessage });
          return Promise.reject(errorMessage);
        }
      },
      setLoading: (isLoading) => {
        // Only update if the state is actually changing
        if (get().isLoading !== isLoading) {
          set({
            isLoading,
            // Only clear error when starting a new operation
            error: isLoading ? null : get().error,
          });
        }
      },
      setError: (error) => {
        if (get().error !== error) {
          set({ error });
        }
      },
      clearError: () => {
        if (get().error !== null) {
          set({ error: null });
        }
      },
      clearChat: (paperId) => {
        if (!paperId) return;
        set((state) => {
          if (!state.messages[paperId]) return state;

          const newMessages = { ...state.messages };
          delete newMessages[paperId];
          return { messages: newMessages };
        });
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
      }),
      version: 1,
      // Add migration if needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            version: 1,
          };
        }
        return persistedState;
      },
    }
  )
);
