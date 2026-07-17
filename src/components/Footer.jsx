export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-white/5 py-6 mt-auto text-center text-sm text-gray-500 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        <p>&copy; {new Date().getFullYear()} VibeNotes. Built with React, Vite &amp; Tailwind v4.</p>
        <div className="flex space-x-6">
          <a
            href="https://yogatama.biz.id"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-violet-400 transition-colors"
          >
            Express API Source
          </a>
          <span className="text-gray-700">|</span>
          <span className="text-gray-400 font-medium">Premium Client Edition</span>
        </div>
      </div>
    </footer>
  );
}
