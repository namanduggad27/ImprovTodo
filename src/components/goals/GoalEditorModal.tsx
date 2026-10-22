import React, { useState } from 'react';
import { Target, X, Plus } from 'lucide-react';
import type { GoalItem, GoalDifficulty, GoalPreset } from '../../types/goals';
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
  const [targetMetric, setTargetMetric] = useState<number | string>(2);
  const [unit, setUnit] = useState('L');
  const [bgPreset, setBgPreset] = useState<GoalPreset>('water');
  const [customImageUrl, setCustomImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playVictoryFanfare();
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
      completedDates: [],
      isImprov: difficulty === 'Focus' || bgPreset === 'mindset'
    });

    // Reset & close
    setTitle('');
    setCustomImageUrl('');
    onClose();
  };

  const PRESETS: { key: GoalPreset; label: string; icon: string }[] = [
    { key: 'water', label: 'WATER', icon: '💧' },
    { key: 'workout', label: 'WORKOUT', icon: '🏋️' },
    { key: 'running', label: 'RUNNING', icon: '🏃' },
    { key: 'study', label: 'STUDY', icon: '📚' },
    { key: 'mindset', label: 'MINDSET', icon: '🧘' },
    { key: 'custom', label: 'CUSTOM', icon: '🎨' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'max(env(safe-area-inset-top, 40px), 40px) 1.25rem 1.25rem',
      zIndex: 1100
    }}>
      <div style={{
        width: '100%',
        maxWidth: '430px',
        maxHeight: '90vh',
        background: '#101218',
        border: '1px solid #1e202c',
        borderRadius: '6px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)',
        padding: '1.4rem 1.35rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto'
      }}>
        {/* Top-left corner bracket accent */}
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
        {/* Bottom-right corner bracket accent */}
        <div style={{
          position: 'absolute',
          bottom: '-1px',
          right: '-1px',
          width: '10px',
          height: '10px',
          borderBottom: '2.5px solid #ff5500',
          borderRight: '2.5px solid #ff5500',
          borderBottomRightRadius: '5px'
        }} />

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '4px',
              background: '#14151f',
              border: '1px solid rgba(255, 85, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255, 85, 0, 0.2)'
            }}>
              <Target size={20} color="#ff5500" strokeWidth={2.4} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <h2 style={{
                fontFamily: "var(--font-heading), 'Outfit', sans-serif",
                fontSize: '1.25rem',
                margin: 0,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.03em'
              }}>
                CREATE NEW GOAL
              </h2>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#8b949e',
                marginTop: '3px'
              }}>
                SYS:GOAL_V1.0 <span style={{ color: '#ff5500' }}>//</span> HABIT_MATRIX
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              background: '#14151f',
              border: '1px solid #222434',
              cursor: 'pointer',
              color: '#8b949e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'all var(--transition-fast)'
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Field 1: Goal Title */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '5px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              GOAL OR HABIT TITLE <span style={{ color: '#ff5500' }}>*</span>
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
                borderRadius: '4px',
                border: '1px solid #222434',
                fontSize: '0.88rem',
                fontWeight: 600,
                outline: 'none',
                background: '#14151f',
                color: '#ffffff'
              }}
            />
          </div>

          {/* Field 2: Frequency & Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '5px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                FREQUENCY
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '4px',
                  border: '1px solid #222434',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  background: '#14151f',
                  color: '#ffffff',
                  outline: 'none'
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
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '5px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                DIFFICULTY
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as GoalDifficulty)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '4px',
                  border: '1px solid #222434',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  background: '#14151f',
                  color: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Focus">Focus</option>
              </select>
            </div>
          </div>

          {/* Field 3: Target Amount & Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '5px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                TARGET AMOUNT
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '4px',
                  border: '1px solid #222434',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  background: '#14151f',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '5px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                UNIT (L, HRS, KM, REPS)
              </label>
              <input
                type="text"
                placeholder="e.g. L, km, hrs"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '4px',
                  border: '1px solid #222434',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  background: '#14151f',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Field 4: Visual Artwork Presets */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px'
            }}>
              <label style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                CARD VISUAL ARTWORK
              </label>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 800,
                color: '#ff5500',
                letterSpacing: '0.06em'
              }}>
                SELECT PRESET
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {PRESETS.map(preset => {
                const isSelected = bgPreset === preset.key;
                return (
                  <button
                    type="button"
                    key={preset.key}
                    onClick={() => {
                      sound.playPop();
                      setBgPreset(preset.key);
                    }}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '4px',
                      border: isSelected ? '1.5px solid #ff5500' : '1px solid #222434',
                      background: isSelected ? 'rgba(255, 85, 0, 0.08)' : '#14151f',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      position: 'relative',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {/* Orange Dot Indicator for Selected */}
                    {isSelected && (
                      <span style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#ff5500'
                      }} />
                    )}
                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{preset.icon}</span>
                    <span style={{
                      fontFamily: "var(--font-heading), 'Outfit', sans-serif",
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      color: isSelected ? '#ffffff' : '#cbd5e1'
                    }}>
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Image URL option if 'custom' is selected */}
          {bgPreset === 'custom' && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                Custom Artwork Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/artwork.jpg"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '4px',
                  border: '1px solid #222434',
                  fontSize: '0.85rem',
                  background: '#14151f',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Actions: CANCEL & CREATE HABIT GOAL */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100px',
                padding: '0.8rem',
                borderRadius: '4px',
                border: '1px solid #222434',
                background: '#14151f',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.78rem',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: '4px',
                border: 'none',
                background: '#ff5500',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 18px rgba(255, 85, 0, 0.4)',
                transition: 'transform var(--transition-fast)'
              }}
            >
              <Plus size={16} strokeWidth={3} /> CREATE HABIT GOAL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
