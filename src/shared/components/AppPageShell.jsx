import AppSidebar from "@/shared/components/AppSidebar";

export default function AppPageShell({ children, mainClassName = "", aside = null }) {
  return (
    <div className="flex min-h-dvh justify-center bg-background font-display text-foreground lg:justify-start">
      <AppSidebar />
      <main className={`min-w-0 w-full max-w-md pb-24 md:max-w-2xl lg:max-w-none lg:flex-1 lg:pb-0 ${mainClassName}`.trim()}>
        {children}
      </main>
      {aside}
    </div>
  );
}
