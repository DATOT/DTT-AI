import { create } from "zustand";
import {
  Chat,
  ChatType,
  Message,
  SenderTypes,
  User,
  createChat,
  createUser,
} from "@/app/lib/types";

interface ChatState {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;

  chats: Chat[];
  addChat: (chatOptions:
    | { type: ChatType.Direct | ChatType.Group; name: string; members: string[]; }
    | { type: ChatType.Bot; name: string; botName: string; botId?: string; botAvatar?: string }
  ) => void;

  messages: Message[];
  input: string;
  setInput: (content?: string) => void;
  updateChat: (content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  chats: [],
  addChat: (chatOptions) =>
    set((state) => ({
      chats: [...state.chats, createChat(chatOptions)],
    })),

  messages: [],
  input: "",
  setInput: (content = "") => set({ input: content }),

  updateChat: async (content: string) => {
    const user = get().currentUser;
    if (!user) {
      console.warn("⚠️ No user is logged in!");
      return;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender: {
        type: SenderTypes.User,
        senderId: user.id,
        senderName: user.name,
      },
      text: content,
      time: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // Optional: If current chat is a BotChat → send to backend
    const currentChat = get().chats.at(-1);
    if (currentChat && currentChat.type === ChatType.Bot) {
      console.log(`Sending "${content}" to bot: ${currentChat.botName}`);
      await new Promise((r) => setTimeout(r, 300)); // simulate delay
    }
  },
}));
