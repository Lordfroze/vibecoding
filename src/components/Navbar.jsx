import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const activeClass = ({ isActive }) => 
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-violet-400 font-semibold' : 'text-gray-300 hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
            VibeNotes
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className={activeClass}>
            Home
          </NavLink>
          <NavLink to="/notes" className={activeClass}>
            My Notes
          </NavLink>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Mobile quick links */}
        <div className="flex md:hidden items-center space-x-4 mr-2">
          <NavLink to="/" className={activeClass}>
            Home
          </NavLink>
          <NavLink to="/notes" className={activeClass}>
            Notes
          </NavLink>
        </div>

        <Link
          to="/notes/new"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 shadow-md shadow-violet-600/20 hover:shadow-violet-600/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Note
        </Link>
      </div>
    </nav>
  );
}
