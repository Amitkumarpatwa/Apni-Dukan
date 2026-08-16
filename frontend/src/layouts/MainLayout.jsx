import { Link, Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100 selection:bg-cyan-500/30">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
              <span className="font-bold">A</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Apni<span className="text-cyan-400">Dukan</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm sm:gap-6">
            <Link to="/" className="font-medium text-slate-300 transition hover:text-white">
              Products
            </Link>
            <Link
              to="/admin/login"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
