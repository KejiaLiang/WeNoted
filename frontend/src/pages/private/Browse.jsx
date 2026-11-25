import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon, NoteLayout, Reaction, Status } from '../../notes/NoteUI';
import { dateLabel, useNotes } from '../../notes/useNotes';
import './Browse.css';

const facets = { course: 'Class', semester: 'Semester' };
const perPage = 6;

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const { data, error, retry, update, handleError } = useNotes();
  const [actionError, setActionError] = useState('');
  const query = params.get('q') || '';
  const sort = params.get('sort') || 'newest';
  const notes = data || [];
  const searchTerm = query.trim().toLowerCase();
  const filtered = notes.filter(note => {
    const matchesFilters = Object.keys(facets).every(key => !params.get(key) || note[key] === params.get(key));
    const words = [note.title, note.course, note.author, note.description].join(' ').toLowerCase();
    return matchesFilters && words.includes(searchTerm);
  }).sort((a, b) => {
    if (sort === 'liked' && a.likeCount !== b.likeCount) return b.likeCount - a.likeCount;
    return Date.parse(b.published) - Date.parse(a.published);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(totalPages, Math.max(1, Number.parseInt(params.get('page'), 10) || 1));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);
  const returnTo = '/browse' + (params.size ? '?' + params : '');
  function onReaction(updated, kind) {
    setActionError('');
    update(updated, kind);
  }

  function onReactionError(error) {
    setActionError(handleError(error));
  }

  function change(key, value) {
    const next = new URLSearchParams(params);
    if (key !== 'page') next.delete('page');
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: key === 'q' });
  }
  return <NoteLayout>
    <header className="wn-heading"><div><h1>Browse notes</h1>
      {data && <p role="status">{filtered.length} {filtered.length === 1 ? 'note' : 'notes'} found</p>}
    </div><Link className="wn-primary" to="/upload">+ Upload notes</Link></header>
    <div className="wn-browse">
      <aside className="wn-filters" aria-label="Note filters">
        <h2>Filters</h2>
        <label>Search <span className="wn-search"><Icon name="search" /><input type="search" value={query} placeholder="Search notes" onChange={e => change('q', e.target.value)} /></span></label>
        {Object.entries(facets).map(([key, label]) => <div className="wn-field" key={key}><label htmlFor={key}>{label}</label>
          <select id={key} value={params.get(key) || ''} onChange={e => change(key, e.target.value)}>
            <option value="">All {key === 'course' ? 'classes' : key + 's'}</option>
            {[...new Set([...notes.map(note => note[key]), params.get(key)].filter(Boolean))].sort().map(value => <option key={value}>{value}</option>)}
          </select>
        </div>)}
        <div className="wn-field"><label htmlFor="sort">Sort by</label><select id="sort" value={sort} onChange={e => change('sort', e.target.value)}>
          <option value="newest">Newest</option><option value="liked">Most liked</option>
        </select></div>
        {params.size > 0 && <button className="wn-clear" onClick={() => setParams({})}>Clear filters</button>}
      </aside>
      <section aria-label="Note results" className="wn-results">
        {actionError && <p role="alert">{actionError}</p>}
        {!data ? <Status error={error} retry={retry} /> : visible.length === 0
          ? <div className="wn-status"><h2>No matching notes</h2>{params.size > 0 && <button onClick={() => setParams({})}>Clear filters</button>}</div>
          : <div className="wn-grid">{visible.map(note => {
            const detail = '/note-page?id=' + encodeURIComponent(note.id);
            return <article className="wn-card" key={note.id}>
              <Link to={detail} state={{ returnTo }} className="wn-card-link">
                <div className="wn-thumb">{note.previewUrl ? <img src={note.previewUrl} alt="" /> : <span>PDF</span>}</div>
                <div className="wn-card-body"><p className="wn-course">{note.course} · {note.semester}</p>
                  <h2>{note.title}</h2><p className="wn-meta">{note.author} · {dateLabel(note.published)}</p></div>
              </Link>
              <div className="wn-card-actions">
                <Reaction kind="like" compact note={note} onUpdate={onReaction} onError={onReactionError} />
                <Link to={detail + '#comments'} state={{ returnTo }} className="wn-action compact" aria-label={note.commentCount + ' comments on ' + note.title}>
                  <Icon name="comment" />{note.commentCount}</Link>
                <Reaction kind="save" compact note={note} onUpdate={onReaction} onError={onReactionError} />
              </div>
            </article>;
          })}</div>}
        {totalPages > 1 && <nav className="wn-pager" aria-label="Results pages">
          <button disabled={page === 1} onClick={() => change('page', page - 1)}>← Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => change('page', page + 1)}>Next →</button>
        </nav>}
      </section>
    </div>
  </NoteLayout>;
}
