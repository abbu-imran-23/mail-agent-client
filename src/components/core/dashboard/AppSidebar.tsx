import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth, UserButton, useUser } from "@clerk/react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "../../ui/sidebar";

import logo from "../../../../public/logo.svg";
import { Button } from "@/components/ui/button";

import {
  Plus,
  MessageSquare,
  Loader2,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Unplug,
} from "lucide-react";

import { useConversations } from "../ConversationContext";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_URL = import.meta.env.VITE_API_URL;

const GMAIL_CACHE_KEY = "mail-agent-gmail-status";
const GMAIL_CACHE_TTL = 5 * 60 * 1000;

type GmailStatus = {
  connected: boolean;
  email: string | null;
};

type GmailStatusCache = {
  status: GmailStatus;
  timestamp: number;
};

function getGmailCacheKey(userId: string) {
  return `${GMAIL_CACHE_KEY}:${userId}`;
}

function getCachedGmailStatus(userId: string): GmailStatus | null {
  try {
    const key = getGmailCacheKey(userId);
    const cached = sessionStorage.getItem(key);

    if (!cached) return null;

    const parsed: GmailStatusCache = JSON.parse(cached);

    if (
      !parsed ||
      typeof parsed.timestamp !== "number" ||
      typeof parsed.status?.connected !== "boolean" ||
      Date.now() - parsed.timestamp > GMAIL_CACHE_TTL
    ) {
      sessionStorage.removeItem(key);
      return null;
    }

    return parsed.status;
  } catch {
    return null;
  }
}

function cacheGmailStatus(userId: string, status: GmailStatus) {
  try {
    sessionStorage.setItem(
      getGmailCacheKey(userId),
      JSON.stringify({
        status,
        timestamp: Date.now(),
      }),
    );
  } catch {
    // Continue without caching if browser storage is unavailable.
  }
}

function clearGmailStatusCache(userId: string) {
  try {
    sessionStorage.removeItem(getGmailCacheKey(userId));
  } catch {
    // Ignore storage errors.
  }
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();

  const {
    conversations,
    loading,
    error,
    refreshConversations,
    removeConversation,
  } = useConversations();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [gmailStatus, setGmailStatus] = useState<GmailStatus>({
    connected: false,
    email: null,
  });

  const [gmailLoading, setGmailLoading] = useState(true);
  const [connectingGmail, setConnectingGmail] = useState(false);
  const [disconnectingGmail, setDisconnectingGmail] = useState(false);
  const [gmailError, setGmailError] = useState("");

  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);

  const [errorDialog, setErrorDialog] = useState({
    open: false,
    title: "",
    message: "",
  });

  const gmailRequestRef = useRef<Promise<void> | null>(null);
  const conversationsErrorRef = useRef<string | null>(null);

  const fullName = (user?.fullName || user?.firstName || "User")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const email = user?.primaryEmailAddress?.emailAddress || "";

  const showErrorDialog = (title: string, message: string) => {
    setErrorDialog({ open: true, title, message });
  };

  // Show a toast when conversation loading fails.
  useEffect(() => {
    if (!error) {
      conversationsErrorRef.current = null;
      return;
    }

    if (conversationsErrorRef.current === error) return;

    conversationsErrorRef.current = error;
    toast.error("Unable to load conversations", {
      description: error,
    });
  }, [error]);

  const fetchGmailStatus = useCallback(
    async (forceRefresh = false) => {
      if (!isLoaded || !user?.id) return;

      const userId = user.id;

      if (!forceRefresh) {
        const cachedStatus = getCachedGmailStatus(userId);

        if (cachedStatus) {
          setGmailStatus(cachedStatus);
          setGmailError("");
          setGmailLoading(false);
          return;
        }
      }

      if (gmailRequestRef.current) {
        return gmailRequestRef.current;
      }

      const request = (async () => {
        try {
          setGmailLoading(true);
          setGmailError("");

          const token = await getToken();

          if (!token) {
            throw new Error("Unable to authenticate. Please sign in again.");
          }

          const response = await fetch(
            `${API_URL}/integrations/google/status`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Unable to fetch Gmail status.");
          }

          const status: GmailStatus = {
            connected: Boolean(data.connected),
            email: data.email || null,
          };

          setGmailStatus(status);
          cacheGmailStatus(userId, status);
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to fetch Gmail connection status.";

          setGmailError(message);
          toast.error("Gmail status check failed", {
            description: message,
          });
        } finally {
          setGmailLoading(false);
          gmailRequestRef.current = null;
        }
      })();

      gmailRequestRef.current = request;
      return request;
    },
    [getToken, isLoaded, user?.id],
  );

  // Initial Gmail check and Google OAuth callback.
  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const params = new URLSearchParams(location.search);
    const gmailResult = params.get("gmail");
    const reason = params.get("reason");

    if (gmailResult === "connected") {
      clearGmailStatusCache(user.id);
      void fetchGmailStatus(true);

      toast.success("Gmail connected successfully");

      params.delete("gmail");
      params.delete("reason");

      const query = params.toString();

      navigate(
        {
          pathname: location.pathname,
          search: query ? `?${query}` : "",
        },
        { replace: true },
      );

      return;
    }

    if (gmailResult === "error") {
      const reasonMessage =
        reason === "invalid_state"
          ? "The Google authorization session expired. Please try again."
          : reason === "invalid_callback"
            ? "Google returned an invalid authorization response."
            : "Unable to connect your Google account. Please try again.";

      toast.error("Gmail connection failed", {
        description: reasonMessage,
      });

      params.delete("gmail");
      params.delete("reason");

      const query = params.toString();

      navigate(
        {
          pathname: location.pathname,
          search: query ? `?${query}` : "",
        },
        { replace: true },
      );

      return;
    }

    void fetchGmailStatus();
  }, [
    isLoaded,
    user?.id,
    location.pathname,
    location.search,
    fetchGmailStatus,
    navigate,
  ]);

  async function handleConnectGmail() {
    try {
      setConnectingGmail(true);
      setGmailError("");

      const token = await getToken();

      if (!token) {
        throw new Error("Unable to authenticate. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/integrations/google/connect`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to connect Gmail.");
      }

      if (!data.authorizationUrl) {
        throw new Error("Google authorization URL was not returned.");
      }

      window.location.assign(data.authorizationUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to connect Gmail.";

      setGmailError(message);
      toast.error("Unable to connect Gmail", { description: message });
      setConnectingGmail(false);
    }
  }

  async function handleDisconnectGmail() {
    try {
      setDisconnectingGmail(true);
      setGmailError("");

      const token = await getToken();

      if (!token) {
        throw new Error("Unable to authenticate. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/integrations/google/disconnect`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to disconnect Gmail.");
      }

      const disconnectedStatus: GmailStatus = {
        connected: false,
        email: null,
      };

      setGmailStatus(disconnectedStatus);

      if (user?.id) {
        cacheGmailStatus(user.id, disconnectedStatus);
      }

      setDisconnectDialogOpen(false);
      toast.success("Gmail disconnected successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to disconnect Gmail.";

      setGmailError(message);
      toast.error("Unable to disconnect Gmail", {
        description: message,
      });
    } finally {
      setDisconnectingGmail(false);
    }
  }

  async function handleDeleteConversation() {
    if (!deleteTarget) return;

    const conversationId = deleteTarget.id;

    try {
      setDeletingId(conversationId);

      const token = await getToken();

      if (!token) {
        throw new Error("Unable to authenticate. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/conversations/${conversationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete conversation.");
      }

      removeConversation(conversationId);
      setDeleteTarget(null);

      if (location.pathname === `/conversation/${conversationId}`) {
        navigate("/conversation/new");
      }

      toast.success("Conversation deleted");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setDeleteTarget(null);
      toast.error("Unable to delete conversation", {
        description: message,
      });

      showErrorDialog("Unable to delete conversation", message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex flex-col">
          <div className="flex flex-row items-center gap-3 px-4 pt-5 pb-2">
            <img src={logo} alt="Mail Agent Logo" width="22" height="22" />
            <span className="text-lg font-semibold">Mail Agent</span>
          </div>

          <Button
            variant="secondary"
            className="rounded-xl px-2 py-5"
            onClick={() => navigate("/conversation/new")}
          >
            <Plus />
            New Conversation
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="flex flex-col gap-2">
            <SidebarGroupLabel className="text-sm font-medium">
              Gmail Account
            </SidebarGroupLabel>

            <div className="space-y-3 rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Gmail Integration</span>

                <div className="ml-auto">
                  {gmailLoading || connectingGmail || disconnectingGmail ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : gmailError ? (
                    <AlertCircle className="size-4 text-destructive" />
                  ) : gmailStatus.connected ? (
                    <CheckCircle2 className="size-4 text-green-500" />
                  ) : (
                    <AlertCircle className="size-4 text-amber-500" />
                  )}
                </div>
              </div>

              {gmailLoading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  Checking Gmail connection...
                </div>
              ) : gmailError ? (
                <div className="space-y-2">
                  <p className="text-xs text-destructive">{gmailError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => void fetchGmailStatus(true)}
                    disabled={connectingGmail || disconnectingGmail}
                  >
                    <RefreshCw className="mr-2 size-3" />
                    Retry
                  </Button>
                </div>
              ) : gmailStatus.connected ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-green-600">
                      Gmail connected
                    </p>
                    <p className="break-all text-xs text-muted-foreground">
                      {gmailStatus.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-2 py-2">
                    <CheckCircle2 className="size-3 shrink-0 text-green-600" />
                    <span className="text-xs text-green-700 dark:text-green-400">
                      Ready to send emails
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={async () => {
                      await fetchGmailStatus(true);
                      toast.success("Gmail status refreshed");
                    }}
                    disabled={disconnectingGmail}
                  >
                    <RefreshCw className="mr-2 size-3" />
                    Refresh status
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => setDisconnectDialogOpen(true)}
                    disabled={disconnectingGmail || connectingGmail}
                  >
                    <Unplug className="mr-2 size-4" />
                    Disconnect Gmail
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    Connect your Gmail account to allow the agent to send emails
                    on your behalf.
                  </p>

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => void handleConnectGmail()}
                    disabled={connectingGmail || disconnectingGmail}
                  >
                    {connectingGmail ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 size-4" />
                        Connect Gmail
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </SidebarGroup>

          <SidebarGroup className="flex flex-col gap-2">
            <SidebarGroupLabel className="text-sm font-medium">
              Conversations
            </SidebarGroupLabel>

            <SidebarMenu className="gap-2">
              {loading && (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading conversations...
                </div>
              )}

              {!loading && error && (
                <div className="space-y-2 px-3 py-2">
                  <p className="text-xs text-destructive">{error}</p>
                  <button
                    onClick={() => void refreshConversations()}
                    className="text-xs underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && conversations.length === 0 && (
                <p className="px-3 py-3 text-xs text-muted-foreground">
                  No conversations yet.
                </p>
              )}

              {!loading &&
                !error &&
                conversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      isActive={
                        location.pathname === `/conversation/${conversation.id}`
                      }
                      tooltip={conversation.title}
                      onClick={() =>
                        navigate(`/conversation/${conversation.id}`)
                      }
                      className="h-10 pr-10"
                    >
                      <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate">
                        {conversation.title || "New conversation"}
                      </span>
                    </SidebarMenuButton>

                    <SidebarMenuAction
                      showOnHover
                      className="top-1/2! right-1! -translate-y-1/2!"
                      disabled={deletingId === conversation.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteTarget({
                          id: conversation.id,
                          title: conversation.title || "Untitled conversation",
                        });
                      }}
                      aria-label={`Delete ${conversation.title}`}
                    >
                      {deletingId === conversation.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4 text-destructive" />
                      )}
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex flex-row items-center gap-3 rounded-md bg-accent-foreground/2 px-3 py-2">
            <UserButton />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">
                {isLoaded ? fullName : "Loading..."}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {isLoaded ? email : ""}
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <AlertDialog
        open={disconnectDialogOpen}
        onOpenChange={(open) => {
          if (!disconnectingGmail) setDisconnectDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Gmail?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect{" "}
              <span className="font-medium text-foreground">
                {gmailStatus.email}
              </span>
              ? Mail Agent will no longer be able to send emails using this
              account. You can connect it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={disconnectingGmail}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDisconnectGmail();
              }}
              disabled={disconnectingGmail}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {disconnectingGmail ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect Gmail"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deletingId) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                "{deleteTarget?.title}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(deletingId)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteConversation();
              }}
              disabled={Boolean(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete conversation"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={errorDialog.open}
        onOpenChange={(open) =>
          setErrorDialog((previous) => ({ ...previous, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{errorDialog.title}</DialogTitle>
            <DialogDescription>{errorDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() =>
                setErrorDialog((previous) => ({ ...previous, open: false }))
              }
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
