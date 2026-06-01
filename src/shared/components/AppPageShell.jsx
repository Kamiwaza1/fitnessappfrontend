import AppSidebar from "@/shared/components/AppSidebar";

export default function AppPageShell({ children, mainClassName = "", aside = null }) {
  return (
    <div className="flex min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <AppSidebar />
      <main className={`flex-1 ${mainClassName}`.trim()}>{children}</main>
      {aside}
    </div>
  );
}
