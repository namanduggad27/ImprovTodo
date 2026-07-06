import React from 'react';
import type { AppSettings } from '../types/todo';
import { DEFAULT_APP_SETTINGS } from '../types/todo';
import { X, Sparkles, FileText, Calendar, Zap, BarChart2, Volume2, RotateCcw, Sliders } from 'lucide-react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  const handleToggle = (key: keyof AppSettings) => {
    sound.playPop();
    const updated = {
      ...settings,
      [key]: !settings[key]
    };
    onUpdateSettings(updated);
  };

  const handleReset = () => {
    sound.playChime();
    onUpdateSettings(DEFAULT_APP_SETTINGS);
  };

  const featureItems: {
    key: keyof AppSettings;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      key: 'enableImprov',
      title: 'Improv Challenges & Studio',
      description: 'Challenge Wheel, creative unlocks, custom ideas, and Improv filters.',
      icon: <Sparkles size={20} />,
      color: 'var(--accent-primary)'
    },
    {
      key: 'enableNotes',
      title: 'Quick Notes & Notebooks',
      description: 'Google Keep style color-coded notes and interactive checklists.',
      icon: <FileText size={20} />,
      color: 'hsl(40, 95%, 45%)'
    },
    {
      key: 'enableRecurring',
      title: 'Calendar & Recurring Tasks',
      description: 'Recurring day schedules, date ranges, and full monthly calendar tab.',
      icon: <Calendar size={20} />,
      color: 'var(--accent-secondary)'
    },
    {
      key: 'enableSprintTimer',
      title: '2-Minute Sprint Timer',
      description: 'Interactive countdown sprint button on uncompleted task cards.',
      icon: <Zap size={20} />,
      color: 'hsl(280, 80%, 60%)'
    },
    {
      key: 'enableStats',
      title: 'Progress & Analytics',
      description: 'Overall completion rates, win counters, and productivity tips tab.',
      icon: <BarChart2 size={20} />,
      color: 'hsl(210, 85%, 52%)'
    },
    {
      key: 'enableSound',
      title: 'Web Audio Sound Effects',
      description: 'Zero-dependency lofi ticks, chimes, and victory fanfares.',
      icon: <Volume2 size={20} />,
      color: 'hsl(165, 70%, 42%)'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'max(env(safe-area-inset-top, 48px), 48px) 1.25rem 1.25rem',
      zIndex: 1100
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        maxHeight: '85vh',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.4rem',
            zIndex: 10
          }}
          aria-label="Close settings"
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', textAlign: 'left' }}>
          <Sliders color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--text-primary)' }}>Modular Studio Settings</h2>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'left', margin: '0 0 1.25rem', lineHeight: 1.4 }}>
          Select only the features you need. The application will dynamically hide unselected tools to keep your workspace focused and uncluttered!
        </p>

        {/* Feature List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          overflowY: 'auto',
          paddingRight: '4px',
          marginBottom: '1.25rem',
          flex: 1
        }}>
          {featureItems.map((item) => {
            const isEnabled = settings[item.key];
            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isEnabled ? 'var(--bg-tertiary)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isEnabled ? 'var(--border-glow)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  opacity: isEnabled ? 1 : 0.5
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left', flex: 1 }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: isEnabled ? `color-mix(in srgb, ${item.color} 20%, transparent)` : 'var(--bg-secondary)',
                    color: isEnabled ? item.color : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 2px', color: isEnabled ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <div style={{
                  width: '46px',
                  height: '26px',
                  borderRadius: '13px',
                  background: isEnabled ? 'var(--accent-primary)' : 'var(--border-color)',
                  position: 'relative',
                  transition: 'background 0.25s ease',
                  flexShrink: 0,
                  marginLeft: '0.75rem'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '3px',
                    left: isEnabled ? '23px' : '3px',
                    transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <RotateCcw size={15} /> Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary"
            style={{ flex: 1, fontSize: '0.85rem' }}
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
