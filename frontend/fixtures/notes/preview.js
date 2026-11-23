import catalog from './catalog.json';

const storageKey = id => 'wenoted:notes-preview:v1:' + id;
function read(id) {
  const base = catalog.find(item => item.id === id);
  if (!base) throw new Error('Note not found.');
  const local = JSON.parse(localStorage.getItem(storageKey(id)) || '{}');
  const comments = [...(local.comments || []), ...base.comments];
  return {
    ...base,
    comments,
    commentCount: comments.length,
    likeCount: base.likeCount + Number(Boolean(local.like)),
    liked: Boolean(local.like),
    saved: Boolean(local.save),
    previewUrl: new URL('./' + id + '.png', import.meta.url).href,
    pdfUrl: new URL('./' + id + '.pdf', import.meta.url).href,
  };
}
function change(id, update) {
  const key = storageKey(id);
  const local = JSON.parse(localStorage.getItem(key) || '{}');
  localStorage.setItem(key, JSON.stringify(update(local)));
  return read(id);
}
export default {
  list: () => catalog.map(note => read(note.id)),
  get: read,
  react: (id, kind, enabled) => change(id, local => ({ ...local, [kind]: enabled })),
  comment: (id, text) => change(id, local => ({
    ...local, comments: [{ id: crypto.randomUUID(), author: 'You', text, created: new Date().toISOString() }, ...(local.comments || [])],
  })),
};
