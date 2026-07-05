import React from 'react';
import type { Note, NoteColor } from '../types/todo';
import { Trash2, CheckSquare, FileText, CheckCircle2, Circle } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const COLOR_STYLES: Record<NoteColor, { bg: string; border: string }> = {
  default: { bg: 'var(--bg-card)', border: 'var(--border-color)' },
  blue: { bg: 'hsla(210, 85%, 52%, 0.12)', border: 'hsla(210, 85%, 52%, 0.35)' },
  sage: { bg: 'hsla(165, 70%, 42%, 0.12)', border: 'hsla(165, 70%, 42%, 0.35)' },
  yellow: { bg: 'hsla(45, 95%, 50%, 0.15)', border: 'hsla(45, 95%, 50%, 0.4)' },
  lavender: { bg: 'hsla(265, 80%, 65%, 0.12)', border: 'hsla(265, 80%, 65%, 0.35)' },
  pink: { bg: 'hsla(340, 85%, 65%, 0.12)', border: 'hsla(340, 85%, 65%, 0.35)' },
};

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete }) => {
  const style = COLOR_STYLES[note.color] || COLOR_STYLES.default;
  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div
      onClick={() => onClick(note)}
      className="glass-card animate-fade-in"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1rem',
        minHeight: '130px',
        position: 'relative',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {note.title || 'Untitled Note'}
          </h3>
          {note.isList ? <CheckSquare size={16} color="var(--text-muted)" /> : <FileText size={16} color="var(--text-muted)" />}
        </div>

        {/* Content Preview */}
        {note.isList && note.items ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0.75rem' }}>
            {note.items.slice(0, 4).map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: item.completed ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                {item.completed ? <CheckCircle2 size={14} color="var(--accent-secondary)" /> : <Circle size={14} color="var(--text-muted)" />}
                <span style={{ textDecoration: item.completed ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.text}
                </span>
              </div>
            ))}
            {note.items.length > 4 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                + {note.items.length - 4} more items...
              </span>
            )}
          </div>
        ) : (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {note.content || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Empty note...</span>}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', borderTop: '1px solid hsla(220, 15%, 80%, 0.4)', paddingTop: '0.5rem', marginTop: 'auto' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {formattedDate}
        </span>
        <button
          onClick={(e) => onDelete(note.id, e)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            transition: 'color var(--transition-fast)'
          }}
          aria-label="Delete note"
          title="Delete Note"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
