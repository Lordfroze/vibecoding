const BASE_URL = 'http://localhost:3000';

/**
 * Helper to handle fetch responses and handle HTTP errors.
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export const apiService = {
  /**
   * Fetch welcome message
   */
  async getWelcome() {
    const response = await fetch(`${BASE_URL}/`);
    return handleResponse(response);
  },

  /**
   * Fetch all notes
   */
  async getNotes() {
    const response = await fetch(`${BASE_URL}/api/notes`);
    return handleResponse(response);
  },

  /**
   * Fetch a single note by ID
   */
  async getNoteById(id) {
    const response = await fetch(`${BASE_URL}/api/notes/${id}`);
    return handleResponse(response);
  },

  /**
   * Create a new note
   * @param {string} notesText The content of the note
   */
  async createNote(notesText) {
    const response = await fetch(`${BASE_URL}/api/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: '1',
        notes: notesText
      }),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing note
   * @param {number|string} id The note ID
   * @param {string} notesText The updated content of the note
   */
  async updateNote(id, notesText) {
    const response = await fetch(`${BASE_URL}/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: '1',
        notes: notesText
      }),
    });
    return handleResponse(response);
  },

  /**
   * Delete a note by ID
   */
  async deleteNote(id) {
    const response = await fetch(`${BASE_URL}/api/notes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};
