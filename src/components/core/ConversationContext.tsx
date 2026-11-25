import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@clerk/react";

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
};

type ConversationContextType = {
  conversations: Conversation[];
  loading: boolean;
  error: string;
  refreshConversations: () => Promise<void>;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
};

const API_URL = import.meta.env.VITE_API_URL;

const ConversationContext = createContext<ConversationContextType | null>(null);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ensures an older request cannot overwrite a newer refresh.
  const requestVersion = useRef(0);

  const refreshConversations = useCallback(async () => {
    const currentRequest = ++requestVersion.current;

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Unable to authenticate. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load conversations.");
      }

      // Ignore stale responses.
      if (currentRequest !== requestVersion.current) return;

      setConversations(data.conversations ?? []);
      setError("");
    } catch (err) {
      if (currentRequest !== requestVersion.current) return;

      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }, [getToken]);

  // Add a newly created conversation immediately to the shared list.
  const addConversation = useCallback((conversation: Conversation) => {
    setConversations((previous) => {
      const existing = previous.find((item) => item.id === conversation.id);

      if (existing) {
        return previous.map((item) =>
          item.id === conversation.id ? { ...item, ...conversation } : item,
        );
      }

      return [conversation, ...previous];
    });
  }, []);

  const removeConversation = useCallback((id: string) => {
    setConversations((previous) =>
      previous.filter((conversation) => conversation.id !== id),
    );
  }, []);

  // Initial fetch only. Background refreshes do not change loading.
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      requestVersion.current += 1;
      setConversations([]);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;

    async function initialLoad() {
      setLoading(true);

      try {
        await refreshConversations();
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialLoad();

    return () => {
      cancelled = true;
      requestVersion.current += 1;
    };
  }, [isLoaded, isSignedIn, refreshConversations]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        loading,
        error,
        refreshConversations,
        addConversation,
        removeConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationContext);

  if (!context) {
    throw new Error(
      "useConversations must be used inside ConversationProvider.",
    );
  }

  return context;
}
