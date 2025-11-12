import { Outlet } from "react-router-dom";

import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import { AdminSidebar } from "./AdminSidebar";

export const AdminLayout = () => {
  const { user, signOut } = useSupabaseAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Real Estate ERP
            </h1>
            <p className="text-sm text-slate-500">
              Manage clients, properties, site visits, and receipts.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-slate-600 md:block">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-600 hover:text-brand-600"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

