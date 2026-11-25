import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@clerk/react";
import { toast } from "sonner";
import { Send, Bot, Loader2, Mail } from "lucide-react";
import { useConversations } from "../components/core/ConversationContext";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type EmailDraft = {
  to: string;
  subject: string;
  body: string;
  emailSent?: boolean;
  sentAt?: string;
};

type ChatMessage = {
  id?: string;
  role: "USER" | "ASSISTANT";
  content: string;
  draft?: EmailDraft | null;
};

const API_URL = import.meta.env.VITE_API_URL;

const Conversation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { refreshConversations, addConversation } = useConversations();

  const activeConversationId = useRef<string | null>(
    id && id !== "new" ? id : null,
  );

  const skipNextLoadRef = useRef<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [error, setError] = useState("");

  // Load an existing conversation.
  useEffect(() => {
    let cancelled = false;

    if (id && skipNextLoadRef.current === id) {
      skipNextLoadRef.current = null;
      activeConversationId.current = id;
      setIsLoadingConversation(false);

      return () => {
        cancelled = true;
      };
    }

    activeConversationId.current = id && id !== "new" ? id : null;

    if (!id || id === "new") {
      setMessages([]);
      setError("");
      setIsLoadingConversation(false);

      return () => {
        cancelled = true;
      };
    }

    async function loadConversation() {
      setIsLoadingConversation(true);
      setMessages([]);
      setError("");

      try {
        const token = await getToken();

        if (!token) {
          throw new Error("Unable to authenticate. Please sign in again.");
        }

        const response = await fetch(`${API_URL}/conversations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load conversation.");
        }

        const conversation = data.conversation ?? data;

        if (cancelled) return;

        setMessages(
          (conversation.messages ?? []).map((item: ChatMessage) => ({
            id: item.id,
            role: item.role,
            content: item.content,
            draft: item.draft ?? null,
          })),
        );
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "Unable to load conversation.";

          setError(errorMessage);

          toast.error("Unable to load conversation", {
            description: errorMessage,
          });
        }
      } finally {
        if (!cancelled) {
          setIsLoadingConversation(false);
        }
      }
    }

    void loadConversation();

    return () => {
      cancelled = true;
    };
  }, [id, getToken]);

  // Send a message to the AI agent.
  async function handleSendMessage() {
    if (!message.trim() || loading || isLoadingConversation) return;

    const userMessage = message.trim();
    const isFirstMessage = !activeConversationId.current;

    setMessages((previous) => [
      ...previous,
      {
        role: "USER",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);
    setError("");

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Unable to authenticate. Please sign in again.");
      }

      let conversationId = activeConversationId.current;

      // Create a conversation if this is the first message.
      if (!conversationId) {
        const createResponse = await fetch(`${API_URL}/conversations`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const createData = await createResponse.json();

        if (!createResponse.ok) {
          throw new Error(
            createData.message || "Unable to create conversation.",
          );
        }

        const conversation = createData.conversation ?? createData;
        conversationId = conversation.id;

        if (typeof conversationId !== "string") {
          throw new Error("Conversation ID was not returned by the server.");
        }

        activeConversationId.current = conversationId;

        addConversation({
          id: conversationId,
          title: conversation.title || "New conversation",
          createdAt: conversation.createdAt || new Date().toISOString(),
          updatedAt: conversation.updatedAt || new Date().toISOString(),
          _count: conversation._count ?? { messages: 0 },
        });
      }

      const response = await fetch(
        `${API_URL}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            tone,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Agent request failed.");
      }

      if (!data.messageId) {
        throw new Error(
          "Assistant message ID was not returned. Check sendMessageController.",
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          id: data.messageId,
          role: "ASSISTANT",
          content: data.reply,
          draft: data.draft ?? null,
        },
      ]);

      if (isFirstMessage) {
        await refreshConversations();

        skipNextLoadRef.current = conversationId;

        navigate(`/conversation/${conversationId}`, {
          replace: true,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(errorMessage);

      toast.error("Mail Agent request failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  // Send the approved draft using its persisted assistant message ID.
  async function handleSendEmail(
    draft: EmailDraft,
    messageId: string,
  ): Promise<boolean> {
    if (sending) return false;

    if (!messageId) {
      toast.error("Unable to send email", {
        description: "The persisted assistant message ID is missing.",
      });
      return false;
    }

    setSending(true);
    setError("");

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Unable to authenticate. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/integrations/google/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...draft,
          conversationMessageId: messageId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send email.");
      }

      const updatedDraft: EmailDraft = data.draft ?? {
        ...draft,
        emailSent: true,
        sentAt: new Date().toISOString(),
      };

      setMessages((previous) =>
        previous.map((item) =>
          item.id === messageId
            ? {
                ...item,
                draft: updatedDraft,
              }
            : item,
        ),
      );

      toast.success("Email sent successfully", {
        description: `Your email to ${draft.to} has been sent.`,
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Email sending failed.";

      setError(errorMessage);

      // Gmail connection errors are displayed as a toast.
      toast.error("Email could not be sent", {
        description: errorMessage,
      });

      return false;
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b px-6 py-4">
        <h1 className="font-semibold">Mail Agent</h1>
        <p className="text-sm text-muted-foreground">
          Compose and manage emails with AI
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col space-y-6">
          {isLoadingConversation && (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading conversation...
              </p>
            </div>
          )}

          {!isLoadingConversation && messages.length === 0 && (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
              <Bot className="mb-4 size-10 text-muted-foreground" />
              <h2 className="text-xl font-semibold">
                What email can I help you with?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask me to compose, edit or improve an email.
              </p>
            </div>
          )}

          {!isLoadingConversation &&
            messages.map((item, index) => (
              <div
                key={item.id ?? index}
                className={`flex w-full min-w-0 gap-3 ${
                  item.role === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                {item.role === "ASSISTANT" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Bot className="size-4" />
                  </div>
                )}

                <div
                  className={`min-w-0 space-y-3 ${
                    item.role === "USER" ? "max-w-[85%]" : "w-full max-w-3xl"
                  }`}
                >
                  <div
                    className={`whitespace-pre-wrap wrap-break-words rounded-xl px-4 py-3 text-sm ${
                      item.role === "USER"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {item.content}
                  </div>

                  {item.draft && (
                    <EmailDraftCard
                      key={item.id ?? index}
                      draft={item.draft}
                      onSend={(updatedDraft) =>
                        item.id
                          ? handleSendEmail(updatedDraft, item.id)
                          : Promise.resolve(false)
                      }
                      sending={sending}
                      sent={item.draft.emailSent === true}
                    />
                  )}
                </div>
              </div>
            ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Mail Agent is thinking...
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mx-auto w-full max-w-3xl px-4 pb-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="border-t px-4 py-4">
        <div className="mx-auto w-full max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Tone</label>
            <select
              value={tone}
              onChange={(event) => setTone(event.target.value)}
              className="rounded-md border bg-background px-2 py-1 text-xs"
              disabled={isLoadingConversation}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="flex items-end gap-2 rounded-xl border bg-background p-3 focus-within:ring-1 focus-within:ring-ring">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }}
              placeholder={
                isLoadingConversation
                  ? "Loading conversation..."
                  : "Message Mail Agent..."
              }
              rows={2}
              disabled={isLoadingConversation || loading}
              className="max-h-40 min-h-12 flex-1 resize-none bg-transparent text-sm outline-none disabled:opacity-50"
            />

            <button
              onClick={() => void handleSendMessage()}
              disabled={loading || isLoadingConversation || !message.trim()}
              className="rounded-lg bg-primary p-2 text-primary-foreground disabled:opacity-50"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Review every email draft before sending.
          </p>
        </div>
      </div>
    </div>
  );
};

function EmailDraftCard({
  draft,
  onSend,
  sending,
  sent,
}: {
  draft: EmailDraft;
  onSend: (updatedDraft: EmailDraft) => Promise<boolean>;
  sending: boolean;
  sent: boolean;
}) {
  const [to, setTo] = useState(draft.to);
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);

  const [validationError, setValidationError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleOpenConfirmation() {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      const errorMessage = "Please complete all email fields.";

      setValidationError(errorMessage);

      toast.error("Incomplete email draft", {
        description: errorMessage,
      });

      return;
    }

    setValidationError("");
    setConfirmOpen(true);
  }

  async function handleConfirmSend() {
    const updatedDraft = {
      to: to.trim(),
      subject: subject.trim(),
      body: body.trim(),
    };

    // Close the confirmation dialog immediately after confirmation.
    // The sending result is reported separately through a toast.
    setConfirmOpen(false);

    await onSend(updatedDraft);
  }

  return (
    <>
      <div className="w-full min-w-0 max-w-3xl space-y-3 rounded-xl border p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <Mail className="size-4" />
            Email Draft
          </div>

          {sent && (
            <span className="text-xs font-medium text-green-600">
              Sent successfully
            </span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To</label>
          <input
            type="email"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="w-full min-w-0 rounded-md border bg-background p-2 text-sm"
            disabled={sent}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Subject</label>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="w-full min-w-0 rounded-md border bg-background p-2 text-sm"
            disabled={sent}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Message</label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={Math.max(6, body.split("\n").length + 1)}
            disabled={sent}
            className="min-h-40 w-full resize-none overflow-hidden whitespace-pre-wrap wrap-break-words rounded-md border bg-background p-3 text-sm leading-6 disabled:opacity-70"
          />
        </div>

        {validationError && (
          <p className="text-sm text-destructive">{validationError}</p>
        )}

        <button
          onClick={handleOpenConfirmation}
          disabled={sending || sent}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}

          {sent ? "Email Sent" : sending ? "Sending..." : "Send Email"}
        </button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send this email?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send this email to{" "}
              <span className="font-medium text-foreground">{to}</span>. Please
              make sure the recipient, subject, and message are correct. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={sending}>
              Review email
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmSend();
              }}
              disabled={sending}
            >
              {sending ? "Sending..." : "Confirm and send"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Conversation;
