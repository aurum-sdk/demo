import type { ReactNode } from "react";

type SidebarSectionProps = {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
};

export function SidebarSection({ title, children, icon }: SidebarSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        {icon && <span className="text-muted-foreground/70">{icon}</span>}
        <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest">
          {title}
        </h3>
      </div>
      <div className="flex flex-col gap-5 pl-0.5">{children}</div>
    </section>
  );
}
