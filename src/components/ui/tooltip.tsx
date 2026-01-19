import { useState, useRef, useEffect } from "react";

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
};

export function Tooltip({ children, content }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {children}
      </div>
      <div
        className={`absolute right-0 top-full mt-2 w-64 p-3 rounded-lg bg-popover border shadow-lg transition-all text-sm text-muted-foreground z-10 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
