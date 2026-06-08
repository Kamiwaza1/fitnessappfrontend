import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginForm({
  values,
  error,
  fieldErrors,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-md border-primary/20 bg-card p-2 backdrop-blur-xl">
        <CardHeader className="text-center">
          <p className="mb-2 text-2xl font-extrabold italic tracking-tighter text-primary">DARK LIFT</p>
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your credentials to continue.</CardDescription>
        </CardHeader>
        <CardContent>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-primary/60">
              Email / Username
            </label>
            <Input
              type="email"
              value={values.email}
              onChange={(event) => onChange("email", event.target.value)}
              required
              autoComplete="username"
              className={
                fieldErrors.email
                  ? "border-red-500/80 ring-2 ring-red-500/30"
                  : ""
              }
            />
            {fieldErrors.email ? <p className="text-xs text-red-300">{fieldErrors.email}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-primary/60">
              Password
            </label>
            <Input
              type="password"
              value={values.password}
              onChange={(event) => onChange("password", event.target.value)}
              required
              autoComplete="current-password"
              className={
                fieldErrors.password
                  ? "border-red-500/80 ring-2 ring-red-500/30"
                  : ""
              }
            />
            {fieldErrors.password ? (
              <p className="text-xs text-red-300">{fieldErrors.password}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full rounded-full tracking-[0.05em]"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-primary/60">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>
        </CardContent>
      </Card>
    </section>
  );
}
