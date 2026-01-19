import { AppProvider } from "@/context/AppContext";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/sidebar";
import { SidebarFooter } from "@/components/sidebar/SidebarFooter";
import { BrandConfig } from "@/components/brand-config";
import { WalletsConfig } from "@/components/wallets-config";
import { MainContent } from "@/components/main-content";

function MainArea() {
  const { isOpen, sidebarWidth, isLargeScreen, hasMounted } = useSidebar();

  // Only apply padding on large screens; on small screens the sidebar overlays
  const paddingLeft = isLargeScreen && isOpen ? sidebarWidth : 0;

  return (
    <div
      className={`h-svh w-full flex flex-col ${
        hasMounted ? "transition-[padding] duration-300 ease-in-out" : ""
      }`}
      style={{ paddingLeft }}
    >
      <MainContent />
      <footer className="p-4 sm:p-6 bg-background shrink-0 shadow-[0_-1px_0_0_var(--border)]">
        <SidebarFooter />
      </footer>
    </div>
  );
}

function DemoLayout() {
  return (
    <SidebarProvider>
      <Sidebar>
        <BrandConfig />
        <WalletsConfig />
      </Sidebar>
      <MainArea />
    </SidebarProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <DemoLayout />
    </AppProvider>
  );
}

export default App;
