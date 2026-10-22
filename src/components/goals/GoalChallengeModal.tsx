import React, { useState, useEffect } from 'react';
import { Target, X, Check } from 'lucide-react';
import { DEFAULT_CHALLENGE_DAYS } from '../../types/goals';
import { sound } from '../../utils/audio';

interface GoalChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalDays: number;
  startDate?: string;
  onSave: (totalDays: number, startDate: string) => void;
}

export const GoalChallengeModal: React.FC<GoalChallengeModalProps> = ({
  isOpen,
  onClose,
  totalDays,
  startDate,
  onSave
}) => {
  const [daysInput, setDaysInput] = useState<string>(() => String(totalDays || DEFAULT_CHALLENGE_DAYS));
  const [dateInput, setDateInput] = useState<string>(() => startDate || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen) {
      setDaysInput(String(totalDays || DEFAULT_CHALLENGE_DAYS));
      setDateInput(startDate || new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, totalDays, startDate]);

  if (!isOpen) return null;

  const handleSelectPreset = (days: number) => {
    sound.playPop();
    setDaysInput(String(days));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playVictoryFanfare();
    const parsedDays = parseInt(daysInput, 10);
    // If not provided, invalid, or 0, default strictly to 66
    const finalDays = !isNaN(parsedDays) && parsedDays > 0 ? parsedDays : DEFAULT_CHALLENGE_DAYS;
    const finalDate = dateInput || new Date().toISOString().split('T')[0];

    onSave(finalDays, finalDate);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'max(env(safe-area-inset-top, 48px), 48px) 1.5rem 1.5rem',
      zIndex: 1100
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#111218',
        border: '1px solid #1e202c',
        borderRadius: '6px',
        padding: '1.4rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              background: 'rgba(255, 85, 0, 0.15)',
              border: '1px solid rgba(255, 85, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={16} color="#ff5500" strokeWidth={2.4} />
            </div>
            <h2 style={{
              fontFamily: "var(--font-heading), 'Outfit', sans-serif",
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.03em',
              margin: 0
            }}>
              HABIT CHALLENGE SPAN
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{
          color: '#8b949e',
          fontSize: '0.8rem',
          lineHeight: 1.45,
          margin: '0 0 1.25rem'
        }}>
          Customize your challenge length. If left blank, it automatically defaults to the science-backed standard of <strong style={{ color: '#ffffff' }}>66 days</strong>.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Preset Buttons */}
          <div>
            <label style={{
              fontSize: '0.72rem',
              color: '#8b949e',
              display: 'block',
              marginBottom: '6px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Quick Presets
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {[
                { days: 21, label: '21 Days', sub: 'Quick Habit Sprint' },
                { days: 30, label: '30 Days', sub: 'Monthly Goal' },
                { days: 66, label: '66 Days', sub: 'Science Default' },
                { days: 100, label: '100 Days', sub: 'Mastery' }
              ].map(preset => {
                const isSelected = daysInput === String(preset.days);
                return (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => handleSelectPreset(preset.days)}
                    style={{
                      padding: '0.55rem 0.6rem',
                      borderRadius: '4px',
                      border: isSelected ? '1.5px solid #ff5500' : '1px solid #222434',
                      background: isSelected ? 'rgba(255,85,0,0.12)' : '#14151f',
                      color: isSelected ? '#ff5500' : '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 900 }}>{preset.label}</span>
                    <span style={{ fontSize: '0.65rem', color: isSelected ? '#ff5500' : '#64748b', fontWeight: 600 }}>{preset.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Duration Input */}
          <div>
            <label style={{
              fontSize: '0.72rem',
              color: '#8b949e',
              display: 'block',
              marginBottom: '4px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Custom Days (Default: 66)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              placeholder="66 (Default)"
              value={daysInput}
              onChange={e => setDaysInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #222434',
                background: '#14151f',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                fontWeight: 700
              }}
            />
          </div>

          {/* Start Date Input */}
          <div>
            <label style={{
              fontSize: '0.72rem',
              color: '#8b949e',
              display: 'block',
              marginBottom: '4px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Challenge Start Date
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #222434',
                background: '#14151f',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #222434',
                background: '#14151f',
                color: '#8b949e',
                fontSize: '0.8rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                cursor: 'pointer'
              }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '4px',
                border: 'none',
                background: '#ff5500',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: '0 4px 18px rgba(255, 85, 0, 0.35)'
              }}
            >
              <Check size={16} strokeWidth={3} /> SAVE SPAN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
