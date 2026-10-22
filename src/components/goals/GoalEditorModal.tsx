import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { GoalItem, GoalDifficulty, GoalPreset } from '../../types/goals';
import { GOAL_BACKDROPS } from '../../data/goalBackdrops';
import { sound } from '../../utils/audio';

interface GoalEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goal: Omit<GoalItem, 'id' | 'createdAt'>) => void;
}

export const GoalEditorModal: React.FC<GoalEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal
}) => {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [difficulty, setDifficulty] = useState<GoalDifficulty>('Easy');
  const [targetMetric, setTargetMetric] = useState<number>(2);
  const [unit, setUnit] = useState('L');
  const [bgPreset, setBgPreset] = useState<GoalPreset>('water');
  const [customImageUrl, setCustomImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playPop();
    onSaveGoal({
      title: title.trim(),
      frequency,
      difficulty,
      currentMetric: 0,
      targetMetric: Number(targetMetric) || 1,
      unit: unit.trim() || '',
      streakDays: 1,
      status: 'todo',
      bgPreset,
      bgImageUrl: customImageUrl.trim() || undefined,
      completedDates: []
    });

    // Reset & close
    setTitle('');
    setCustomImageUrl('');
    onClose();
  };

  const presetKeys = Object.keys(GOAL_BACKDROPS) as GoalPreset[];

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
      padding: 'max(env(safe-area-inset-top, 40px), 40px) 1rem 1rem',
      zIndex: 1100
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        maxHeight: '90vh',
        background: '#ffffff',
        border: '1.5px solid #1a1a1a',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🎯</span>
            <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 900, color: '#121212' }}>Create New Goal</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#71717a',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Goal Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#27272a', marginBottom: '4px' }}>
              Goal or Habit Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Drink 3L water, Run 5km..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1.5px solid #d4d4d8',
                fontSize: '0.95rem',
                fontWeight: 600,
                outline: 'none',
                background: '#fafafa'
              }}
            />
          </div>

          {/* Frequency & Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#27272a', marginBottom: '4px' }}>
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1.5px solid #d4d4d8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: '#fafafa'
                }}
              >
                <option value="Daily">Daily</option>
                <option value="6x/week">6x/week</option>
                <option value="5x/week">5x/week</option>
                <option value="3x/week">3x/week</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#27272a', marginBottom: '4px' }}>
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as GoalDifficulty)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1.5px solid #d4d4d8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: '#fafafa'
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Target Metric & Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#27272a', marginBottom: '4px' }}>
                Target Amount
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                value={targetMetric}
                onChange={(e) => setTargetMetric(parseFloat(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1.5px solid #d4d4d8',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: '#fafafa'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#27272a', marginBottom: '4px' }}>
                Unit (L, hrs, km, reps)
              </label>
              <input
                type="text"
                placeholder="e.g. L, km, hrs"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1.5px solid #d4d4d8',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: '#fafafa'
                }}
              />
            </div>
          </div>

          {/* Theme Art Preset */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#27272a', marginBottom: '6px' }}>
              Card Visual Artwork
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {presetKeys.map(key => {
                const isSelected = bgPreset === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => {
                      sound.playPop();
                      setBgPreset(key);
                    }}
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #121212' : '1px solid #e4e4e7',
                      background: isSelected ? '#18181b' : '#fafafa',
                      color: isSelected ? '#ffffff' : '#27272a',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>
                      {key === 'water' && '💧'}
                      {key === 'workout' && '🏋️'}
                      {key === 'running' && '🏃'}
                      {key === 'study' && '📚'}
                      {key === 'mindset' && '🧘'}
                      {key === 'custom' && '🎨'}
                    </span>
                    <span style={{ textTransform: 'capitalize' }}>{key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Image URL option if 'custom' is selected */}
          {bgPreset === 'custom' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#27272a', marginBottom: '4px' }}>
                Custom Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/artwork.jpg"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1.5px solid #d4d4d8',
                  fontSize: '0.85rem',
                  background: '#fafafa'
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1.5px solid #d4d4d8',
                background: '#ffffff',
                color: '#27272a',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: '#121212',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <Plus size={18} /> Create Habit Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
