import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';

export default function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [notesText, setNotesText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setIsFetching(true);
      apiService.getNoteById(id)
        .then((res) => {
          if (res.data) {
            setNotesText(res.data.notes || '');
          } else {
            setError('Note details not found.');
          }
          setIsFetching(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load note data. The note may have been deleted.');
          setIsFetching(false);
        });
    }
  }, [id, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const trimmedText = notesText.trim();
    if (!trimmedText) {
      setValidationError('Note content cannot be empty.');
      return;
    }

    setIsLoading(true);
    const savePromise = isEditMode
      ? apiService.updateNote(id, trimmedText)
      : apiService.createNote(trimmedText);

    savePromise
      .then(() => {
        setIsLoading(false);
        // Redirect back to notes list
        navigate('/notes');
      })
      .catch((err) => {
        console.error(err);
        setError(`Failed to save note: ${err.message || 'Server error'}`);
        setIsLoading(false);
      });
  };

  return (
    <div className="py-8 px-6 md:px-12 max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center">
      {/* Back link */}
      <div className="mb-6 self-start">
        <Link
          to="/notes"
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Cancel &amp; Go Back
        </Link>
      </div>

      {/* Loader for Edit mode fetching */}
      {isFetching && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 animate-ping absolute"></div>
            <div className="w-12 h-12 rounded-full border-t-4 border-violet-500 animate-spin"></div>
          </div>
          <p className="text-gray-400 text-sm">Fetching note details...</p>
        </div>
      )}

      {/* Main Form container */}
      {(!isEditMode || !isFetching) && (
        <div className="glass-panel rounded-2xl border-white/5 shadow-2xl p-6 md:p-8 space-y-6">
          <div>
            <div className="text-xs text-violet-400 font-medium tracking-wide uppercase mb-1">
              {isEditMode ? 'Modify Note' : 'Create Note'}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {isEditMode ? `Edit Note #${id}` : 'Create a New Note'}
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-light">
              {isEditMode 
                ? 'Update your existing note details below.' 
                : 'Write down your ideas, task items, or snippets.'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
                Note Content
              </label>
              
              <textarea
                id="notes"
                rows="8"
                value={notesText}
                onChange={(e) => {
                  setNotesText(e.target.value);
                  if (e.target.value.trim()) setValidationError('');
                }}
                disabled={isLoading}
                placeholder="Type your notes here..."
                className={`w-full px-4 py-3 text-sm text-white placeholder-gray-500 bg-gray-900 border rounded-2xl focus:outline-none focus:ring-1 transition-colors resize-y min-h-48 ${
                  validationError 
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' 
                    : 'border-white/5 focus:border-violet-500 focus:ring-violet-500'
                }`}
              />
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-400 font-medium">{validationError}</span>
                <span className="text-gray-500">
                  {notesText.length} characters
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <Link
                to="/notes"
                className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-transparent hover:bg-white/5 border border-transparent rounded-xl transition-all"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 hover:scale-[1.02] active:scale-[0.98] ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 mr-1.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Note'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
