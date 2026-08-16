import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} ApniDukan. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <a href="#" className="hover:text-white transition">About</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>
        <p className="text-sm font-medium text-slate-300">
          Made with <span className="text-red-500">❤️</span> by Amit
        </p>
      </div>
    </footer>
  );
};

export default Footer;
