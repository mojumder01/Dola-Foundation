"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global error boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="font-bold text-2xl text-dark mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-6">
            The application hit an unexpected error. Please try again.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
