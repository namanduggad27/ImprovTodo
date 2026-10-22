import React from 'react';
import type { ImprovPrompt } from '../types/todo';
import { Flame, Sparkles, Plus, Zap, Clock, Trash2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface StudioProps {
  prompts: ImprovPrompt[];
  onLaunchWheel: () => void;
  onCreateIdea: () => void;
  onDeleteCustomPrompt: (id: string) => void;
  onAddPromptAsTodo: (prompt: ImprovPrompt) => void;
}

export const Studio: React.FC<StudioProps> = ({
  prompts,
  onLaunchWheel,
  onCreateIdea,
  onDeleteCustomPrompt,
  onAddPromptAsTodo
}) => {
  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      {/* Hero Banner */}
      <div style={{
        background: '#111218',
        border: '1px solid #1e202c',
        borderRadius: '6px',
        marginBottom: '1.5rem',
        textAlign: 'center',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <Flame size={36} color="#ff5500" style={{ margin: '0 auto 0.5rem' }} className="animate-pulse" />
        <h2 style={{
          fontFamily: "var(--font-heading), 'Outfit', sans-serif",
          fontSize: '1.3rem',
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: '0.4rem',
          letterSpacing: '0.04em'
        }}>
          IMPROV STUDIO
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#8b949e', marginBottom: '1.25rem', lineHeight: 1.45 }}>
          Break creative blocks, beat procrastination, and turn tedious chores into games.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => {
              sound.playPop();
              onLaunchWheel();
            }}
            style={{
              flex: 1,
              minWidth: '170px',
              padding: '0.75rem 1rem',
              background: '#ff5500',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.78rem',
              letterSpacing: '0.05em',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(255,85,0,0.35)'
            }}
          >
            <Sparkles size={16} /> LAUNCH CHALLENGE WHEEL
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onCreateIdea();
            }}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: '0.75rem 1rem',
              background: '#14151f',
              border: '1px solid #222434',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.78rem',
              letterSpacing: '0.05em',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> CREATE YOUR IDEA
          </button>
        </div>
      </div>

      {/* Title & Action Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <h3 style={{
          fontFamily: "var(--font-heading), 'Outfit', sans-serif",
          fontSize: '1rem',
          fontWeight: 900,
          margin: 0,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          letterSpacing: '0.04em'
        }}>
          <Zap size={16} color="#ff5500" /> ALL CHALLENGES ({prompts.length})
        </h3>
        <button
          onClick={() => {
            sound.playPop();
            onCreateIdea();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff5500',
            fontSize: '0.78rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          + ADD NEW IDEA
        </button>
      </div>

      {/* Challenges List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {prompts.map(prompt => {
          const isCustom = prompt.id.startsWith('custom-');
          return (
            <div
              key={prompt.id}
              style={{
                background: '#111218',
                border: '1px solid #1e202c',
                borderRadius: '6px',
                padding: '1rem 1.15rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                borderLeft: isCustom ? '3px solid #ff5500' : '1px solid #1e202c'
              }}
            >
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'rgba(255, 85, 0, 0.12)',
                    border: '1px solid rgba(255, 85, 0, 0.35)',
                    color: '#ff5500',
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    textTransform: 'uppercase'
                  }}>
                    {prompt.category}
                  </span>
                  {isCustom && (
                    <span style={{
                      fontSize: '0.62rem',
                      background: '#14151f',
                      border: '1px solid #222434',
                      color: '#e2e8f0',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}>
                      CUSTOM IDEA
                    </span>
                  )}
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
                    <Clock size={12} /> {prompt.timeEstimate}
                  </span>
                </div>
                <h4 style={{
                  fontFamily: "var(--font-heading), 'Outfit', sans-serif",
                  fontSize: '0.96rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: '0 0 0.25rem',
                  letterSpacing: '0.02em'
                }}>
                  {prompt.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#8b949e', margin: 0, lineHeight: 1.45 }}>{prompt.description}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                {isCustom && (
                  <button
                    onClick={() => onDeleteCustomPrompt(prompt.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Delete Custom Idea"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => onAddPromptAsTodo(prompt)}
                  style={{
                    background: '#14151f',
                    border: '1px solid #222434',
                    color: '#ff5500',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Add to Tasks Today"
                >
                  <Plus size={18} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
