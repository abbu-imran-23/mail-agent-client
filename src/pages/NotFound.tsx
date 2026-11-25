import { Link } from "react-router";
import { ArrowLeft, Home, Search, Bot } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 size-87.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl border bg-card shadow-sm">
          <Bot className="size-8 text-primary" />
        </div>

        {/* 404 */}
        <h1 className="text-5xl font-bold tracking-tighter text-primary sm:text-5xl">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
          Looks like you're lost
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          The page you're looking for doesn't exist, may have been moved, or the
          link might be incorrect.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Home className="size-4" />
            Back to Sign In
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Search className="size-3.5" />
          <span>Mail Agent · Page not found</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
