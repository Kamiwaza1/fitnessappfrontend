import AppSidebar from "@/shared/components/AppSidebar";

export default function AppPageShell({ children, mainClassName = "", aside = null }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background font-display text-foreground lg:flex-row">
      <AppSidebar />
      <main className={`min-w-0 flex-1 pb-20 lg:pb-0 ${mainClassName}`.trim()}>{children}</main>
      {aside}
    </div>
  );
}
