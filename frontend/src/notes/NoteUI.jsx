import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PrivateNav from '../components/PrivateNav';
import Footer from '../components/Footer';
import { notesApi, preview } from './api';
import './notes.css';

const paths = {
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  star: 'm12 2.5 2.9 6 6.6 1-4.8 4.6 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.6 6.6-1Z',
  comment: 'M21 11.5a8.5 8.5 0 0 1-9 8.5 10 10 0 0 1-4-.8L3 21l1.4-4.6A8.3 8.3 0 0 1 3 11.5a9 9 0 0 1 18 0Z',
  search: 'M16 16l5 5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4',
  share: 'M10 13.5l4-4M8 16l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 8a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-1 1',
};
export function Icon({ name, filled = false }) {
  return <svg className="wn-icon" viewBox="0 0 24 24" aria-hidden="true" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}
export function NoteLayout({ children }) {
  return <div className="whole-page"><PrivateNav /><main className="wn-main">
    {preview && <div className="wn-preview">Local preview · Sample notes</div>}
    {children}
  </main><Footer /></div>;
}
export function Status({ error, retry }) {
  return <div className="wn-status" role="status">{error || 'Loading notes…'} {error && <button onClick={retry}>Retry</button>}</div>;
}
export function Reaction({ note, kind, onUpdate, onError, compact = false }) {
  const isLike = kind === 'like';
  const selected = isLike ? note.liked : note.saved;
  const label = isLike ? 'Like' : 'Save';
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  async function toggle() {
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    try {
      const updated = await notesApi.react(note.id, kind, !selected);
      onUpdate(updated, kind);
    } catch (error) {
      onError(error);
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return <button className={'wn-action' + (compact ? ' compact' : '')} aria-label={label + ' ' + note.title}
    aria-pressed={selected} disabled={pending} onClick={toggle} title={label + ' note'}>
    <Icon name={isLike ? 'heart' : 'star'} filled={selected} />
    {isLike ? note.likeCount : !compact && (selected ? 'Saved' : 'Save note')}
  </button>;
}
export function BackLink({ to }) {
  return <Link className="wn-back" to={to}>← Back to results</Link>;
}
