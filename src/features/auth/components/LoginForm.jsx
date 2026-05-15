import Link from "next/link";

export default function LoginForm({
  loginRef,
  values,
  error,
  fieldErrors,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  return (
    <section ref={loginRef} id="auth-section" className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
        <h2 className="mb-2 text-2xl font-bold text-white">Sign in</h2>
        <p className="mb-8 text-sm text-zinc-400">Enter your credentials to continue.</p>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-400">
              Email / Username
            </label>
            <input
              type="email"
              value={values.email}
              onChange={(event) => onChange("email", event.target.value)}
              required
              autoComplete="username"
              className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors ${
                fieldErrors.email
                  ? "border-red-500/80 shadow-[0_0_0_1px_rgba(239,68,68,0.45)]"
                  : "border-white/10 focus:border-primary focus:shadow-[0_0_0_1px_var(--color-primary)]"
              }`}
            />
            {fieldErrors.email ? <p className="text-xs text-red-300">{fieldErrors.email}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-400">
              Password
            </label>
            <input
              type="password"
              value={values.password}
              onChange={(event) => onChange("password", event.target.value)}
              required
              autoComplete="current-password"
              className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors ${
                fieldErrors.password
                  ? "border-red-500/80 shadow-[0_0_0_1px_rgba(239,68,68,0.45)]"
                  : "border-white/10 focus:border-primary focus:shadow-[0_0_0_1px_var(--color-primary)]"
              }`}
            />
            {fieldErrors.password ? (
              <p className="text-xs text-red-300">{fieldErrors.password}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-full bg-primary text-sm font-bold tracking-[0.05em] text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
