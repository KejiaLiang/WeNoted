async function request(path, method = 'GET', body) {
  const response = await fetch('/api/notes' + path, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (!response.ok) {
    const error = new Error(response.status === 404 ? 'Note not found.' : 'Request failed. Please try again.');
    error.status = response.status;
    throw error;
  }
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The notes service is unavailable.');
  }
  return response.json();
}

const pathFor = id => '/' + encodeURIComponent(id);
const live = {
  list: () => request(''),
  get: id => request(pathFor(id)),
  react: (id, field, enabled) => request(pathFor(id) + '/' + field, enabled ? 'PUT' : 'DELETE'),
  comment: (id, text) => request(pathFor(id) + '/comments', 'POST', { text }),
};

export const preview = import.meta.env.DEV && import.meta.env.MODE === 'notes-preview';
export const notesApi = preview ? (await import('../../fixtures/notes/preview.js')).default : live;
