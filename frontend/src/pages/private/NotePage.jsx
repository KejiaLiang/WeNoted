import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { notesApi } from '../../notes/api';
import { BackLink, Icon, NoteLayout, Reaction, Status } from '../../notes/NoteUI';
import { dateLabel, useNotes } from '../../notes/useNotes';
import './NotePage.css';

function Detail({ id, returnTo, jump }) {
  const { data: note, error, retry, update, handleError } = useNotes(id);
  const [draft, setDraft] = useState('');
  const [limit, setLimit] = useState(10);
  const [posting, setPosting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const commentBox = useRef(null);
  const hasNote = Boolean(note);
  useEffect(() => {
    if (jump && hasNote) commentBox.current?.focus();
  }, [jump, hasNote]);

  async function post(event) {
    event.preventDefault();
    const text = draft.trim();
    if (posting || !text) return;
    setPosting(true);
    setFeedback('');
    try {
      const updated = await notesApi.comment(id, text);
      update(updated, 'comment');
      setDraft('');
    } catch (reason) {
      setFeedback(handleError(reason));
    } finally {
      setPosting(false);
    }
  }
  async function share() {
    const url = new URL('/note-page', window.location.origin);
    url.searchParams.set('id', id);
    try {
      await navigator.clipboard.writeText(url.href);
      setFeedback('Link copied.');
      setShareUrl('');
    } catch {
      setShareUrl(url.href);
      setFeedback('');
    }
  }
  const reactions = { note, onUpdate: update, onError: reason => setFeedback(handleError(reason)) };
  const comments = note ? [...note.comments].sort((a, b) => Date.parse(b.created) - Date.parse(a.created)) : [];
  return <NoteLayout><BackLink to={returnTo} />
    {!note ? <Status error={error} retry={retry} /> : <div className="wn-detail">
      <div className="wn-reader">
        <object type="application/pdf" data={note.pdfUrl.split('#')[0] + '#navpanes=0&view=FitH'} aria-label={'PDF preview of ' + note.title}>
          <a href={note.pdfUrl}>Open PDF</a>
        </object>
      </div>
      <section className="wn-info"><p className="wn-course">{note.course} · {note.semester}</p>
        <h1>{note.title}</h1><p className="wn-meta">{note.author} · {dateLabel(note.published)}</p>
        {note.description && <p className="wn-description">{note.description}</p>}
        <div className="wn-toolbar">
          <Reaction kind="like" {...reactions} />
          <button className="wn-action" onClick={() => commentBox.current.focus()}><Icon name="comment" />Comment</button>
          <button className="wn-action" onClick={share}><Icon name="share" />Share</button>
          <a className="wn-action" href={note.pdfUrl} download={note.title + '.pdf'}><Icon name="download" />Download PDF</a>
          <Reaction kind="save" {...reactions} />
        </div>
        {shareUrl && <label className="wn-share-url">Note link<input readOnly value={shareUrl} onFocus={e => e.target.select()} /></label>}
        {feedback && <p role="status">{feedback}</p>}
        <section id="comments" className="wn-comments"><h2>Comments ({note.commentCount})</h2>
          <form onSubmit={post}><textarea ref={commentBox} aria-label="Write a comment" placeholder="Write a comment…" maxLength={100} value={draft} disabled={posting} onChange={e => setDraft(e.target.value)} />
            {draft.length >= 85 && <span className="wn-count">{draft.length}/100</span>}
            <button className="wn-primary" disabled={!draft.trim() || posting}>{posting ? 'Posting…' : 'Post'}</button></form>
          <ol>{comments.slice(0, limit).map(comment => <li key={comment.id}>
            <div><strong>{comment.author}</strong><time dateTime={comment.created}>{dateLabel(comment.created)}</time></div>
            <p>{comment.text}</p></li>)}</ol>
          {comments.length > limit && <button className="wn-clear" onClick={() => setLimit(limit + 10)}>Load more comments</button>}
        </section>
      </section>
    </div>}
  </NoteLayout>;
}
export default function NotePage() {
  const [params] = useSearchParams();
  const location = useLocation();
  const id = params.get('id');
  const from = location.state?.returnTo || '';
  const returnTo = /^\/browse(?:\?|$)/.test(from) ? from : '/browse';
  if (!id) return <NoteLayout><BackLink to={returnTo} /><h1>Note not found</h1></NoteLayout>;
  return <Detail key={id} id={id} returnTo={returnTo} jump={location.hash === '#comments'} />;
}
