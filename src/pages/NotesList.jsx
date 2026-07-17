import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(
        notes.filter((note) => note.notes?.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, notes]);

  const fetchNotes = () => {
    setIsLoading(true);
    apiService.getNotes()
      .then((res) => {
        // API response format is { status: "success", data: [...] }
        const notesList = res.data || [];
        // Sort notes by id descending (newest first)
        notesList.sort((a, b) => b.id - a.id);
        setNotes(notesList);
        setFilteredNotes(notesList);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch notes from the database.');
        setIsLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setDeletingId(id);
      apiService.deleteNote(id)
        .then(() => {
          setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
          setDeletingId(null);
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to delete note. Please try again.');
          setDeletingId(null);
        });
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr.replace(' ', 'T')); // Handle format difference if any
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="py-8 px-6 md:px-12 max-w-7xl mx-auto w-full flex-grow">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Notes</h1>
          <p className="text-gray-400 text-sm">
            {notes.length === 0 
              ? 'No notes saved yet' 
              : `Showing ${filteredNotes.length} of ${notes.length} notes`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 bg-gray-900 border border-white/5 rounded-xl focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 animate-ping absolute"></div>
            <div className="w-12 h-12 rounded-full border-t-4 border-violet-500 animate-spin"></div>
          </div>
          <p className="text-gray-400 text-sm">Loading your vault...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="glass-panel border-rose-500/20 bg-rose-950/10 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-white mb-2">Connection Problem</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchNotes}
            className="px-5 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-colors shadow-md shadow-violet-600/20"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredNotes.length === 0 && (
        <div className="glass-panel border-white/5 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gray-800/50 text-gray-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-white mb-2">No Notes Found</h3>
          <p className="text-gray-400 text-sm mb-6">
            {searchQuery 
              ? `No notes match "${searchQuery}". Try a different term.` 
              : 'Keep track of thoughts, tasks, and ideas in one place.'}
          </p>
          <Link
            to="/notes/new"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-colors shadow-md shadow-violet-600/20"
          >
            Create New Note
          </Link>
        </div>
      )}

      {/* Notes Grid */}
      {!isLoading && !error && filteredNotes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border-white/5 relative group h-64"
            >
              {/* Note Content */}
              <div className="space-y-3 overflow-hidden flex-grow mb-4">
                <div className="text-xs text-violet-400 font-medium tracking-wide uppercase">
                  Note #{note.id}
                </div>
                <p className="text-gray-200 text-sm font-light leading-relaxed whitespace-pre-line line-clamp-6">
                  {note.notes}
                </p>
              </div>

              {/* Note Footer / Actions */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatDate(note.created_at)}
                </span>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/notes/${note.id}`}
                    title="View Details"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>

                  <Link
                    to={`/notes/edit/${note.id}`}
                    title="Edit Note"
                    className="p-2 rounded-lg text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Link>

                  <button
                    disabled={deletingId === note.id}
                    onClick={() => handleDelete(note.id)}
                    title="Delete Note"
                    className={`p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ${
                      deletingId === note.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {deletingId === note.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
