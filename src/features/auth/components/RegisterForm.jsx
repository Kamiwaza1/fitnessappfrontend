import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterForm({
  values,
  error,
  fieldErrors,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-10 font-display sm:px-6">
      <Card className="w-full max-w-md border-primary/20 bg-card p-2 backdrop-blur-xl">
        <CardHeader className="text-center">
          <p className="mb-2 text-2xl font-extrabold italic tracking-tighter text-primary">DARK LIFT</p>
          <CardTitle className="text-2xl font-bold">Create account</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}

        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-primary/60">
              Full Name
            </label>
            <Input
              className={
                fieldErrors.fullName
                  ? "border-red-500/80 ring-2 ring-red-500/30"
                  : ""
              }
              type="text"
              value={values.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
              required
            />
            {fieldErrors.fullName ? (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-primary/60">
              Email
            </label>
            <Input
              className={
                fieldErrors.email
                  ? "border-red-500/80 ring-2 ring-red-500/30"
                  : ""
              }
              type="email"
              value={values.email}
              onChange={(event) => onChange("email", event.target.value)}
              required
            />
            {fieldErrors.email ? <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-primary/60">
              Password
            </label>
            <Input
              className={
                fieldErrors.password
                  ? "border-red-500/80 ring-2 ring-red-500/30"
                  : ""
              }
              type="password"
              value={values.password}
              onChange={(event) => onChange("password", event.target.value)}
              required
            />
            {fieldErrors.password ? (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
            ) : null}
          </div>

          <Button
            className="w-full rounded-full tracking-[0.05em]"
            size="lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-primary/60">
          <span>Already have an account?</span>
          <Link href="/login" className="ml-1 font-bold text-primary hover:underline">
            Login
          </Link>
        </div>
        </CardContent>
      </Card>
    </section>
  );
}
