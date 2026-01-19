import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { ChevronsRight } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";

type SidebarProps = {
  children: ReactNode;
};

export function Sidebar({ children }: SidebarProps) {
  const { isOpen, setIsOpen, toggle, setSidebarWidth, isLargeScreen } =
    useSidebar();
  const sidebarRef = useRef<HTMLElement>(null);

  const updateWidth = useCallback(() => {
    if (sidebarRef.current && isOpen) {
      setSidebarWidth(sidebarRef.current.offsetWidth);
    } else if (!isOpen) {
      setSidebarWidth(0);
    }
  }, [isOpen, setSidebarWidth]);

  useEffect(() => {
    updateWidth();

    // Also update after transition completes
    const timeout = setTimeout(updateWidth, 350);
    return () => clearTimeout(timeout);
  }, [isOpen, updateWidth]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const observer = new ResizeObserver(() => {
      if (isOpen) {
        setSidebarWidth(sidebar.offsetWidth);
      }
    });

    observer.observe(sidebar);
    return () => observer.disconnect();
  }, [isOpen, setSidebarWidth]);

  return (
    <>
      {/* Hamburger button - visible when sidebar is closed */}
      <Button
        variant="ghost"
        onClick={toggle}
        className={`
          fixed top-4 left-4 z-50
          h-10 px-3 rounded-lg
          bg-card/80 backdrop-blur-sm border shadow-sm
          hover:bg-accent cursor-pointer
          transition-opacity duration-200
          flex items-center gap-2
          ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
        aria-label="Open menu"
      >
        <ChevronsRight className="h-5 w-5" />
        <span className="text-sm font-medium">Configure</span>
      </Button>

      {/* Overlay - visible when sidebar is open on small screens */}
      {!isLargeScreen && (
        <div
          className={`
            fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
            transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        className={`
          fixed
          top-0 left-0 z-40
          h-svh w-fit min-w-80
          overflow-y-auto scrollbar-hide
          border-r
          bg-card/95 backdrop-blur-md
          p-4 sm:p-6
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarHeader />
        <div className="flex-1 flex flex-col gap-6 md:gap-8">{children}</div>
      </aside>
    </>
  );
}
