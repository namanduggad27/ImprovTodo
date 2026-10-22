import React, { useState } from 'react';
import type { Note } from '../types/todo';
import { Plus, Edit3, Trash2, CheckSquare, Circle, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface QuickNotesProps {
  notes: Note[];
  onOpenNewNote: () => void;
  onOpenEditNote: (note: Note) => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
}

type NoteFilter = 'all' | 'notes' | 'checklists';

export const QuickNotes: React.FC<QuickNotesProps> = ({
  notes,
  onOpenNewNote,
  onOpenEditNote,
  onDeleteNote
}) => {
  const [filter, setFilter] = useState<NoteFilter>('all');

  const textNotes = notes.filter(n => !n.isList);
  const checklistNotes = notes.filter(n => n.isList);

  const filteredNotes = notes.filter(note => {
    if (filter === 'notes') return !note.isList;
    if (filter === 'checklists') return note.isList;
    return true;
  });

  const getWordCount = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%'
    }}>
      {/* Title & Action Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.25rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '4px',
            background: 'rgba(255, 85, 0, 0.15)',
            border: '1px solid rgba(255, 85, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={15} color="#ff5500" strokeWidth={2.4} />
          </div>
          <h2 style={{
            fontFamily: "var(--font-heading), 'Outfit', sans-serif",
            fontSize: '1.05rem',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.04em',
            margin: 0,
            textTransform: 'uppercase'
          }}>
            QUICK NOTES & LISTS <span style={{ color: '#ff5500' }}>({notes.length})</span>
          </h2>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            onOpenNewNote();
          }}
          style={{
            background: '#ff5500',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '0.74rem',
            letterSpacing: '0.06em',
            padding: '0.55rem 0.9rem',
            border: 'none',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255, 85, 0, 0.35)',
            transition: 'transform var(--transition-fast)'
          }}
        >
          <Plus size={15} strokeWidth={3} /> NEW NOTE
        </button>
      </div>

      {/* Bracket Filters Row */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        paddingBottom: '2px'
      }}>
        {/* ALL */}
        <button
          onClick={() => {
            sound.playPop();
            setFilter('all');
          }}
          style={{
            height: '32px',
            padding: '0 0.85rem',
            borderRadius: '3px',
            background: '#111218',
            border: filter === 'all' ? '1.5px solid #ff5500' : '1px solid #1e202c',
            color: filter === 'all' ? '#ff5500' : '#8b949e',
            fontSize: '0.72rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)'
          }}
        >
          [ ALL ({notes.length}) ]
        </button>

        {/* NOTES */}
        <button
          onClick={() => {
            sound.playPop();
            setFilter('notes');
          }}
          style={{
            height: '32px',
            padding: '0 0.85rem',
            borderRadius: '3px',
            background: '#111218',
            border: filter === 'notes' ? '1.5px solid #ff5500' : '1px solid #1e202c',
            color: filter === 'notes' ? '#ff5500' : '#8b949e',
            fontSize: '0.72rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)'
          }}
        >
          [ NOTES ({textNotes.length}) ]
        </button>

        {/* CHECKLISTS */}
        <button
          onClick={() => {
            sound.playPop();
            setFilter('checklists');
          }}
          style={{
            height: '32px',
            padding: '0 0.85rem',
            borderRadius: '3px',
            background: '#111218',
            border: filter === 'checklists' ? '1.5px solid #ff5500' : '1px solid #1e202c',
            color: filter === 'checklists' ? '#ff5500' : '#8b949e',
            fontSize: '0.72rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)'
          }}
        >
          [ CHECKLISTS ({checklistNotes.length}) ]
        </button>
      </div>

      {/* Cards List or Empty State */}
      {filteredNotes.length === 0 ? (
        <div style={{
          background: '#090a0e',
          border: '1px solid #1a1c26',
          borderRadius: '6px',
          padding: '3.5rem 1.5rem',
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Box with orange corner accent */}
          <div style={{
            width: '54px',
            height: '54px',
            background: '#14151f',
            border: '1.5px solid #222434',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 4px 18px rgba(0,0,0,0.5)'
          }}>
            <BookOpen size={26} color="#ff5500" />
            <div style={{
              position: 'absolute',
              top: '-3px',
              left: '-3px',
              width: '10px',
              height: '10px',
              borderTop: '2px solid #ff5500',
              borderLeft: '2px solid #ff5500'
            }} />
          </div>

          <h3 style={{
            fontFamily: "var(--font-heading), 'Outfit', sans-serif",
            fontSize: '1.15rem',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.04em',
            margin: '1.25rem 0 0.5rem',
            textAlign: 'center'
          }}>
            NO NOTES FOUND
          </h3>

          <p style={{
            color: '#8b949e',
            fontSize: '0.78rem',
            letterSpacing: '0.04em',
            textAlign: 'center',
            maxWidth: '240px',
            margin: '0 0 1.5rem',
            lineHeight: 1.45
          }}>
            Capture your quick thoughts, scripts, or checklists.
          </p>

          <button
            onClick={() => {
              sound.playPop();
              onOpenNewNote();
            }}
            style={{
              width: '100%',
              maxWidth: '240px',
              background: '#ff5500',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(255, 85, 0, 0.35)'
            }}
          >
            <Plus size={16} strokeWidth={3} /> CREATE FIRST NOTE
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredNotes.map(note => {
            const isChecklist = note.isList;
            const items = note.items || [];
            const completedItems = items.filter(i => i.completed).length;

            return (
              <div
                key={note.id}
                onClick={() => onOpenEditNote(note)}
                style={{
                  background: '#101218',
                  border: '1px solid #1e2230',
                  borderRadius: '6px',
                  padding: '1.1rem 1.15rem 0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.7rem',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                {/* Orange Top-Left Corner Accent for Checklists */}
                {isChecklist && (
                  <div style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '-1px',
                    width: '10px',
                    height: '10px',
                    borderTop: '2.5px solid #ff5500',
                    borderLeft: '2.5px solid #ff5500',
                    borderTopLeftRadius: '5px'
                  }} />
                )}

                {/* Top Row: Badge + Title + Edit Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    {isChecklist ? (
                      <span style={{
                        background: 'rgba(255, 85, 0, 0.12)',
                        border: '1px solid rgba(255, 85, 0, 0.35)',
                        color: '#ff5500',
                        fontSize: '0.62rem',
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        textTransform: 'uppercase',
                        flexShrink: 0
                      }}>
                        CHECKLIST
                      </span>
                    ) : (
                      <span style={{
                        background: '#1a1c26',
                        border: '1px solid #282b3c',
                        color: '#8b949e',
                        fontSize: '0.62rem',
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        textTransform: 'uppercase',
                        flexShrink: 0
                      }}>
                        TEXT NOTE
                      </span>
                    )}

                    <h3 style={{
                      fontFamily: "var(--font-heading), 'Outfit', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      letterSpacing: '0.03em',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {note.title || 'Untitled Note'}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditNote(note);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8b949e',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                    title="Edit Note"
                    aria-label="Edit Note"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>

                {/* Content Area */}
                {isChecklist ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginTop: '0.2rem'
                  }}>
                    {items.slice(0, 3).map(item => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem'
                        }}
                      >
                        {item.completed ? (
                          <div style={{
                            width: '15px',
                            height: '15px',
                            background: '#ff5500',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <CheckSquare size={13} color="#ffffff" strokeWidth={2.6} />
                          </div>
                        ) : (
                          <Circle size={15} color="#8b949e" strokeWidth={2} style={{ flexShrink: 0 }} />
                        )}
                        <span style={{
                          color: item.completed ? '#8b949e' : '#cbd5e1',
                          textDecoration: item.completed ? 'line-through' : 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: 500
                        }}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <span style={{ color: '#64748b', fontSize: '0.78rem', fontStyle: 'italic' }}>
                        No checklist items yet
                      </span>
                    )}
                  </div>
                ) : (
                  <p style={{
                    color: '#8b949e',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {note.content || <span style={{ fontStyle: 'italic', color: '#64748b' }}>Empty note...</span>}
                  </p>
                )}

                {/* Footer Row: Date + Meta Tag + Delete Trash */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.6rem',
                  borderTop: '1px solid #181a24',
                  marginTop: '0.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      color: '#64748b',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em'
                    }}>
                      {formatDate(note.updatedAt)}
                    </span>

                    {isChecklist ? (
                      <span style={{
                        color: '#ff5500',
                        fontSize: '0.74rem',
                        fontWeight: 900,
                        letterSpacing: '0.04em'
                      }}>
                        {completedItems}/{items.length} completed
                      </span>
                    ) : (
                      <span style={{
                        color: '#64748b',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        letterSpacing: '0.04em'
                      }}>
                        {getWordCount(note.content)} words
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id, e);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color var(--transition-fast)'
                    }}
                    title="Delete Note"
                    aria-label="Delete Note"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
