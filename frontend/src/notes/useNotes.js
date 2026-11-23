import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesApi } from './api';

export function useNotes(id) {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({});
  const handleError = useCallback(error => {
    if (error.status === 401) {
      navigate('/login', { replace: true, state: { from: window.location.pathname + window.location.search } });
    }
    return error.message || 'The notes service is unavailable.';
  }, [navigate]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = id === undefined ? await notesApi.list() : await notesApi.get(id);
        if (active) setResult({ id, data, attempt });
      } catch (error) {
        if (active) setResult({ id, error: handleError(error), attempt });
      }
    }
    load();
    return () => { active = false; };
  }, [id, attempt, handleError]);

  // Independent like, save and comment requests may finish in a different order.
  function update(note, kind) {
    let fields;
    if (kind === 'like') fields = { liked: note.liked, likeCount: note.likeCount };
    if (kind === 'save') fields = { saved: note.saved };
    if (kind === 'comment') fields = { comments: note.comments, commentCount: note.commentCount };
    setResult(current => {
      if (!current.data || current.id !== id) return current;
      const data = Array.isArray(current.data)
        ? current.data.map(item => item.id === note.id ? { ...item, ...fields } : item)
        : { ...current.data, ...fields };
      return { ...current, data };
    });
  }
  const current = result.id === id && result.attempt === attempt ? result : {};
  return { ...current, update, retry: () => setAttempt(n => n + 1), handleError };
}

export function dateLabel(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
}
