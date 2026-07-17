import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

export default function Welcome() {
  const [apiMessage, setApiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiService.getWelcome()
      .then((res) => {
        setApiMessage(res.message);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to connect to the backend server.');
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center max-w-4xl mx-auto flex-grow">
      {/* Glow Effect Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10"></div>

      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Manage Your Thoughts with{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            VibeNotes
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          A premium, minimal dashboard to create, read, update, and organize your ideas. Fully syncs with our high-speed Node.js backend.
        </p>

        {/* API Connection Indicator */}
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-panel border-white/5 shadow-inner">
          <div className={`w-2.5 h-2.5 rounded-full mr-2.5 animate-pulse ${
            isLoading ? 'bg-amber-400' : error ? 'bg-rose-500' : 'bg-emerald-500'
          }`}></div>
          <span className="text-xs font-medium text-gray-300">
            {isLoading ? (
              'Connecting to API server...'
            ) : error ? (
              error
            ) : (
              `Server Status: ${apiMessage || 'Connected'}`
            )}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/notes"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-violet-600/25 hover:shadow-violet-600/35 hover:scale-[1.03] active:scale-[0.98]"
          >
            Go to My Notes
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
          
          <Link
            to="/notes/new"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-300 hover:text-white glass-panel hover:bg-white/5 border-white/5 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            Create First Note
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
        {[
          {
            title: 'Express Backend API',
            desc: 'Interacts with external databases and processes CRUD operations in real time.',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            ),
          },
          {
            title: 'Modern SPA Navigation',
            desc: 'Lightning-fast client-side routing powered by React Router, delivering instant page transitions.',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            ),
          },
          {
            title: 'Utility-First Styling',
            desc: 'Crafted with Tailwind CSS v4, utilizing responsive layouts and custom CSS transitions.',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            ),
          },
        ].map((feat, idx) => (
          <div key={idx} className="glass-panel rounded-2xl p-6 text-left border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-bl-full group-hover:bg-violet-600/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {feat.icon}
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">{feat.title}</h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
