import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    apiService.getNoteById(id)
      .then((res) => {
        // API response format: { status: "success", data: { id, user_id, notes, created_at } }
        if (res.data) {
          setNote(res.data);
        } else {
          setError('Note data not found.');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch the note details. It might have been deleted.');
        setIsLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsDeleting(true);
      apiService.deleteNote(id)
        .then(() => {
          setIsDeleting(false);
          navigate('/notes');
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to delete the note. Please try again.');
          setIsDeleting(false);
        });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="py-8 px-6 md:px-12 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 self-start">
        <Link
          to="/notes"
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Notes
        </Link>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 animate-ping absolute"></div>
            <div className="w-12 h-12 rounded-full border-t-4 border-violet-500 animate-spin"></div>
          </div>
          <p className="text-gray-400 text-sm">Opening note details...</p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="glass-panel border-rose-500/20 bg-rose-950/10 rounded-2xl p-8 text-center max-w-lg mx-auto w-full">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-white mb-2">Note Not Found</h3>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Link
            to="/notes"
            className="px-5 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-colors shadow-md"
          >
            Return to Vault
          </Link>
        </div>
      )}

      {/* Note Details Panel */}
      {!isLoading && !error && note && (
        <div className="glass-panel rounded-2xl border-white/5 shadow-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <div className="text-xs text-violet-400 font-medium tracking-wide uppercase mb-1">
                Note Info
              </div>
              <h2 className="text-xl font-semibold text-white">ID: #{note.id}</h2>
            </div>
            
            <div className="text-xs text-gray-400">
              <p className="font-medium text-gray-500">Created At</p>
              <p className="mt-0.5">{formatDate(note.created_at)}</p>
            </div>
          </div>

          {/* Note Body */}
          <div className="text-gray-200 text-base md:text-lg font-light leading-relaxed whitespace-pre-line bg-gray-900/30 p-6 rounded-2xl border border-white/5 min-h-48 shadow-inner">
            {note.notes}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Link
              to={`/notes/edit/${note.id}`}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all duration-200 shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Note
            </Link>

            <button
              disabled={isDeleting}
              onClick={handleDelete}
              className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isDeleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isDeleting ? (
                <>
                  <svg className="w-4 h-4 mr-1.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Note
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
