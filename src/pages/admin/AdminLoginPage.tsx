import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";

export const AdminLoginPage = () => {
  const { signIn, loading, user } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Signed in successfully!");
      const redirectTo = (location.state as { from?: Location })?.from?.pathname;
      navigate(redirectTo ?? "/admin/properties", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="space-y-4 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold text-white shadow-soft">
            RE
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              ERP Admin Login
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Access the dashboard to manage clients, properties, and site visits.
            </p>
          </div>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

