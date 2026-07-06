import React, { useState, useEffect, useRef } from 'react';
import type { Todo } from '../types/todo';
import { sound } from '../utils/audio';
import { Play, Pause, RotateCcw, X, CheckCircle2, Volume2, VolumeX, Plus, Sparkles, Flame } from 'lucide-react';

interface SprintTimerModalProps {
  isOpen: boolean;
  todo: Todo | null;
  onClose: () => void;
  onCompleteTodo: (id: string) => void;
}

const PRESETS = [
  { label: '2 mins', seconds: 120 },
  { label: '5 mins', seconds: 300 },
  { label: '10 mins', seconds: 600 },
  { label: '15 mins', seconds: 900 }
];

export const SprintTimerModal: React.FC<SprintTimerModalProps> = ({ isOpen, todo, onClose, onCompleteTodo }) => {
  const [totalSeconds, setTotalSeconds] = useState(120);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Initialize preset based on task timeEstimate or title if available
  useEffect(() => {
    if (isOpen && todo) {
      let initialSeconds = 120; // Default 2-Minute Sprint
      const titleLower = todo.title.toLowerCase();
      const descLower = (todo.description || '').toLowerCase();
      
      if (titleLower.includes('5 min') || descLower.includes('5 min')) initialSeconds = 300;
      else if (titleLower.includes('10 min') || descLower.includes('10 min')) initialSeconds = 600;
      else if (titleLower.includes('15 min') || descLower.includes('15 min')) initialSeconds = 900;
      else if (titleLower.includes('3 min') || descLower.includes('3 min')) initialSeconds = 180;
      
      setTotalSeconds(initialSeconds);
      setTimeLeft(initialSeconds);
      setIsRunning(false);
    }
  }, [isOpen, todo]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer Finished!
            setIsRunning(false);
            sound.playVictoryFanfare();
            return 0;
          }
          if (!isMuted && prev <= 10) {
            sound.playTick(); // Tick faster/louder on last 10 seconds
          } else if (!isMuted && prev % 2 === 0) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, isMuted]);

  if (!isOpen || !todo) return null;

  const handleSelectPreset = (seconds: number) => {
    setIsRunning(false);
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    if (!isMuted) sound.playChime();
  };

  const handleTogglePlay = () => {
    if (!isRunning && !isMuted) {
      sound.playChime();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  };

  const handleAddMinute = () => {
    setTotalSeconds(prev => prev + 60);
    setTimeLeft(prev => prev + 60);
  };

  const handleToggleMute = () => {
    sound.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFinishAndCelebrate = () => {
    setIsRunning(false);
    sound.playVictoryFanfare();
    onCompleteTodo(todo.id);
    onClose();
  };

  // Format MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Circular progress calculations
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progress);

  // Dynamic color based on time left
  let ringColor = 'var(--accent-primary)';
  if (progress <= 0.25) ringColor = 'hsl(350, 80%, 55%)'; // Pulsing red/orange
  else if (progress <= 0.5) ringColor = 'hsl(40, 95%, 50%)'; // Yellow/Gold

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'max(env(safe-area-inset-top, 48px), 48px) 1.5rem 1.5rem',
      zIndex: 1100
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 0 50px var(--accent-primary-glow)',
        padding: '1.75rem',
        position: 'relative',
        textAlign: 'center'
      }}>
        {/* Close Button */}
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
          aria-label="Close timer"
        >
          <X size={20} />
        </button>

        {/* Mute Toggle Button */}
        <button
          onClick={handleToggleMute}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'none',
            border: 'none',
            color: isMuted ? 'var(--text-muted)' : 'var(--accent-primary)',
            cursor: 'pointer',
            padding: '0.4rem'
          }}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Title & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', justifyContent: 'center' }}>
          <Flame color="var(--accent-primary)" className="animate-pulse" size={22} />
          <span className="badge badge-improv">
            <Sparkles size={12} style={{ marginRight: '4px' }} /> Sprint Studio
          </span>
        </div>

        <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {todo.title}
        </h2>

        {todo.description && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {todo.description}
          </p>
        )}

        {/* Preset Duration Selector */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', justifyContent: 'center' }}>
          {PRESETS.map(preset => (
            <button
              key={preset.seconds}
              onClick={() => handleSelectPreset(preset.seconds)}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                background: totalSeconds === preset.seconds ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: totalSeconds === preset.seconds ? 'white' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* CIRCULAR TIMER DISPLAY */}
        <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
          <svg width="220" height="220" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
            {/* Background Ring */}
            <circle
              cx="110" cy="110" r={radius}
              stroke="var(--bg-tertiary)"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="110" cy="110" r={radius}
              stroke={ringColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
            />
          </svg>

          {/* Time Text Inside Ring */}
          <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '2.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {timeFormatted}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '6px' }}>
              {timeLeft === 0 ? 'Sprint Finished!' : isRunning ? 'In Progress...' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Timer Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={handleTogglePlay}
            className="btn"
            style={{
              flex: 1,
              background: isRunning ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
              color: isRunning ? 'var(--text-primary)' : 'white',
              border: isRunning ? '1px solid var(--border-color)' : 'none',
              boxShadow: isRunning ? 'none' : '0 4px 15px var(--accent-primary-glow)'
            }}
          >
            {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> {timeLeft < totalSeconds ? 'Resume' : 'Start'}</>}
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-full)' }}
            title="Reset Timer"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={handleAddMinute}
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
            title="Add 1 Minute"
          >
            <Plus size={16} /> 1m
          </button>
        </div>

        {/* Complete & Celebrate Action */}
        <button
          onClick={handleFinishAndCelebrate}
          className="btn btn-improv"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--accent-secondary), hsl(165, 80%, 35%))',
            boxShadow: '0 4px 20px var(--accent-secondary-glow)'
          }}
        >
          <CheckCircle2 size={20} /> Complete Task!
        </button>
      </div>
    </div>
  );
};
