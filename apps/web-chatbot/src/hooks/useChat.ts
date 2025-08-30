import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  timestamp: Date;
}

const fetchChatHistory = async (): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          text: 'مرحباً! أنا مساعد AzizSys الذكي. كيف يمكنني مساعدتك اليوم؟',
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }, 500);
  });
};

const sendMessageToAPI = async (message: string): Promise<ChatResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: `شكراً لك على رسالتك: "${message}". أنا هنا لمساعدتك في أي استفسار حول النظام.`,
        timestamp: new Date()
      });
    }, 1000);
  });
};

export const useChat = () => {
  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: fetchChatHistory,
    staleTime: 0,
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessageToAPI,
    onSuccess: (response, variables) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: variables,
        sender: 'user',
        timestamp: new Date()
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'ai',
        timestamp: response.timestamp
      };

      queryClient.setQueryData(['chatHistory'], (old: Message[] = []) => [
        ...old,
        userMessage,
        aiMessage
      ]);
    },
  });

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const clearChat = () => {
    queryClient.setQueryData(['chatHistory'], []);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    isSending: sendMessageMutation.isPending,
  };
};