import React, { useState, useEffect } from 'react';
import type { ImprovPrompt, Todo } from '../types/todo';
import { IMPROV_PROMPTS } from '../data/improvPrompts';
import { sound } from '../utils/audio';
import { Sparkles, X, Shuffle, PlusCircle, Clock, Flame, Plus } from 'lucide-react';

interface ImprovModalProps {
  isOpen: boolean;
  prompts?: ImprovPrompt[];
  onClose: () => void;
  onAddAsTodo: (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => void;
  onOpenCustomModal?: () => void;
}

export const ImprovModal: React.FC<ImprovModalProps> = ({ isOpen, prompts = IMPROV_PROMPTS, onClose, onAddAsTodo, onOpenCustomModal }) => {
  const [currentPrompt, setCurrentPrompt] = useState<ImprovPrompt>(prompts[0] || IMPROV_PROMPTS[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (prompts && prompts.length > 0) {
      setCurrentPrompt(prompts[0]);
    }
  }, [prompts]);

  if (!isOpen) return null;

  const handleSpin = () => {
    setIsSpinning(true);
    sound.playTick();
    setTimeout(() => {
      const activePrompts = prompts.length > 0 ? prompts : IMPROV_PROMPTS;
      const randomIndex = Math.floor(Math.random() * activePrompts.length);
      setCurrentPrompt(activePrompts[randomIndex]);
      setIsSpinning(false);
      sound.playChime();
    }, 400);
  };

  const handleAdd = () => {
    sound.playChime();
    onAddAsTodo({
      title: currentPrompt.title,
      description: currentPrompt.description,
      priority: 'improv',
      category: currentPrompt.category,
      isImprovPrompt: true
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'max(env(safe-area-inset-top, 48px), 48px) 1.5rem 1.5rem',
      zIndex: 1000
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '400px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Flame color="var(--accent-primary)" className="animate-pulse" />
          <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Improv Challenge</h2>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Stuck or procrastinating? Spin the wheel for an instant creative unlock or micro-action challenge!
        </p>

        <div style={{
          background: 'var(--bg-tertiary)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          minHeight: '160px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          transform: isSpinning ? 'scale(0.95)' : 'scale(1)',
          opacity: isSpinning ? 0.5 : 1
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-improv">
              <Sparkles size={12} style={{ marginRight: '4px' }} /> {currentPrompt?.category || 'creative'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Clock size={12} /> {currentPrompt?.timeEstimate || '5 mins'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {currentPrompt?.title || 'Challenge'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {currentPrompt?.description || 'Spin to get a challenge!'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <button
            onClick={handleSpin}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            <Shuffle size={18} /> Spin New
          </button>
          <button
            onClick={handleAdd}
            className="btn btn-improv"
            style={{ flex: 1 }}
          >
            <PlusCircle size={18} /> Add Task
          </button>
        </div>

        {onOpenCustomModal && (
          <button
            onClick={() => {
              onClose();
              onOpenCustomModal();
            }}
            style={{
              width: '100%',
              padding: '0.6rem',
              background: 'transparent',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Plus size={14} /> Create Your Own Improv Idea
          </button>
        )}
      </div>
    </div>
  );
};
