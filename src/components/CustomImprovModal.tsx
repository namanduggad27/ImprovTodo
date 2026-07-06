import React, { useState } from 'react';
import type { ImprovPrompt } from '../types/todo';
import { X, PlusCircle, Flame, Clock } from 'lucide-react';

interface CustomImprovModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promptData: Omit<ImprovPrompt, 'id'>) => void;
}

export const CustomImprovModal: React.FC<CustomImprovModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'creative' | 'action' | 'mindset' | 'quick-win'>('creative');
  const [timeEstimate, setTimeEstimate] = useState('5 mins');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSave({
      title: title.trim(),
      category,
      timeEstimate: timeEstimate.trim() || '5 mins',
      description: description.trim()
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setCategory('creative');
    setTimeEstimate('5 mins');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'max(env(safe-area-inset-top, 48px), 48px) 1.5rem 1.5rem',
      zIndex: 1050
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 0 40px var(--accent-primary-glow)',
        padding: '1.75rem',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.4rem'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Flame color="var(--accent-primary)" className="animate-pulse" />
          <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>Create Improv Challenge</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Challenge Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., The Pirate Voice Challenge"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none'
                }}
              >
                <option value="creative">Creative</option>
                <option value="action">Action</option>
                <option value="mindset">Mindset</option>
                <option value="quick-win">Quick-Win</option>
              </select>
            </div>

            <div style={{ width: '120px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} /> Time
              </label>
              <input
                type="text"
                placeholder="5 mins"
                value={timeEstimate}
                onChange={e => setTimeEstimate(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Description & Rules *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain how to play this challenge or what rules apply..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-improv"
              style={{ flex: 1 }}
            >
              <PlusCircle size={18} /> Save Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
