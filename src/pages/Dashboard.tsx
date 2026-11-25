import { ConversationProvider } from "@/components/core/ConversationContext";
import { AppSidebar } from "@/components/core/dashboard/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const Dashboard = () => {
  return (
    <ConversationProvider>
      <SidebarProvider>
        <AppSidebar />

        <main className="h-screen w-full overflow-hidden">
          <SidebarTrigger />
          <Outlet />
        </main>

        <Toaster
          position="top-center"
          theme="system"
          duration={4000}
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "border border-border bg-background text-foreground shadow-lg",
              title: "text-foreground font-medium",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-muted text-muted-foreground",
              closeButton:
                "border-border bg-background text-muted-foreground hover:bg-muted",
            },
          }}
        />
      </SidebarProvider>
    </ConversationProvider>
  );
};

export default Dashboard;
