import { NavLink, useLocation } from "react-router";

export default function Navbar() {
  const location = useLocation();

  // Highlight Doctors when on home "/" or "/doctors"
  const isDoctorsActive =
    location.pathname === "/" || location.pathname.startsWith("/doctors");

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 text-decoration-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0d9488] flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                width="18"
                height="18"
                x="3"
                y="3"
                rx="2"
                stroke="none"
                fill="transparent"
              />
              <path d="M12 7v10M7 12h10" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Care<span className="text-[#0d9488]">Point</span>
          </span>
        </NavLink>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isDoctorsActive || isActive
                  ? "bg-[#e6f4f1] text-[#0d9488]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`
            }
          >
            Doctors
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-[#e6f4f1] text-[#0d9488]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`
            }
          >
            <span>MyAppointments</span>
            <span className="bg-[#0d9488] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center leading-tight">
              2
            </span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#e6f4f1] text-[#0d9488]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`
            }
          >
            Profile
          </NavLink>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>

          <div className="h-5 w-[1px] bg-slate-200" />

          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#0f172a] text-white flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            aria-label="User profile"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
