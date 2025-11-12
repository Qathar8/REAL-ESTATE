export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-center text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:text-left">
        <p>&copy; {new Date().getFullYear()} Real Estate ERP. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
          <a href="/privacy-policy" className="hover:text-brand-600">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-brand-600">
            Terms of Service
          </a>
          <a href="/admin" className="hover:text-brand-600">
            Admin Login
          </a>
        </div>
      </div>
    </footer>
  );
};

