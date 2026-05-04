export default function StatusMessage({ children, tone = "muted", className = "" }) {
  const toneClasses = {
    muted: "text-slate-500 dark:text-slate-400",
    error: "text-red-400",
  };

  return (
    <div className={`text-center text-sm ${toneClasses[tone] || toneClasses.muted} ${className}`.trim()}>
      {children}
    </div>
  );
}
