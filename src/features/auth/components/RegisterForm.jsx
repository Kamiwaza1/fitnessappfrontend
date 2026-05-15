import Link from "next/link";

export default function RegisterForm({
  values,
  error,
  fieldErrors,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light px-4 py-6 font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 sm:px-6 sm:py-10">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-primary/10 bg-white p-5 shadow-lg dark:bg-background-dark sm:p-8">
        <h1 className="mb-4 text-2xl font-extrabold tracking-tighter text-primary italic sm:mb-6 sm:text-3xl">
          DARK LIFT
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-300 sm:mb-8 sm:text-base">
          Create your account to get started.
        </p>

        <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
          <div>
            <input
              className={`w-full rounded-lg border bg-background-light px-4 py-3 text-sm text-slate-900 focus:ring-2 dark:bg-background-dark dark:text-slate-100 sm:text-base ${
                fieldErrors.fullName
                  ? "border-red-400 focus:ring-red-400"
                  : "border-primary/20 focus:ring-primary"
              }`}
              type="text"
              placeholder="Full Name"
              value={values.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
              required
            />
            {fieldErrors.fullName ? (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>
            ) : null}
          </div>

          <div>
            <input
              className={`w-full rounded-lg border bg-background-light px-4 py-3 text-sm text-slate-900 focus:ring-2 dark:bg-background-dark dark:text-slate-100 sm:text-base ${
                fieldErrors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-primary/20 focus:ring-primary"
              }`}
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={(event) => onChange("email", event.target.value)}
              required
            />
            {fieldErrors.email ? <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p> : null}
          </div>

          <div>
            <input
              className={`w-full rounded-lg border bg-background-light px-4 py-3 text-sm text-slate-900 focus:ring-2 dark:bg-background-dark dark:text-slate-100 sm:text-base ${
                fieldErrors.password
                  ? "border-red-400 focus:ring-red-400"
                  : "border-primary/20 focus:ring-primary"
              }`}
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={(event) => onChange("password", event.target.value)}
              required
            />
            {fieldErrors.password ? (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
            ) : null}
          </div>

          <button
            className="mt-2 flex w-full items-center justify-center space-x-2 rounded-lg bg-primary py-3 font-bold text-background transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-4"
            type="submit"
            disabled={isSubmitting}
          >
            <span className="material-icons">person_add</span>
            <span>{isSubmitting ? "Registering..." : "Register"}</span>
          </button>
        </form>

        {error ? <div className="mt-4 text-sm text-red-500">{error}</div> : null}

        <div className="mt-5 text-center text-xs text-slate-400 sm:mt-6 sm:text-sm">
          <span>Already have an account?</span>
          <Link href="/" className="ml-1 font-bold text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
