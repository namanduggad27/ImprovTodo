// Cinematic anime & fitness backdrops for habit goal cards
import type { GoalPreset } from '../types/goals';

export interface GoalBackdropPreset {
  id: GoalPreset;
  label: string;
  accentColor: string;
  defaultImage: string;
}

// Crisp anime-aesthetic SVG data URLs that work 100% offline and load instantaneously
export const GOAL_BACKDROPS: Record<GoalPreset, GoalBackdropPreset> = {
  water: {
    id: 'water',
    label: 'Hydration & Water',
    accentColor: '#38bdf8',
    defaultImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230c1e33"/><stop offset="60%" stop-color="%23081422"/><stop offset="100%" stop-color="%2303080e"/></linearGradient><radialGradient id="glow" cx="75%" cy="40%" r="55%"><stop offset="0%" stop-color="%2338bdf8" stop-opacity="0.35"/><stop offset="100%" stop-color="%230c1e33" stop-opacity="0"/></radialGradient><linearGradient id="stream" x1="0%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stop-color="%2367e8f9" stop-opacity="0.6"/><stop offset="100%" stop-color="%230284c7" stop-opacity="0.1"/></linearGradient></defs><rect width="600" height="300" fill="url(%23bg)"/><rect width="600" height="300" fill="url(%23glow)"/><path d="M420,40 Q450,110 440,180 T410,270" stroke="url(%23stream)" stroke-width="12" fill="none" opacity="0.45" stroke-linecap="round"/><circle cx="480" cy="90" r="45" fill="none" stroke="%2338bdf8" stroke-width="3" opacity="0.25"/><polygon points="460,70 510,95 470,140" fill="%2338bdf8" opacity="0.15"/><path d="M380,240 C430,210 520,230 570,190" stroke="%230284c7" stroke-width="4" fill="none" opacity="0.3"/><circle cx="430" cy="130" r="14" fill="%23e0f2fe" opacity="0.3"/><circle cx="510" cy="170" r="8" fill="%23e0f2fe" opacity="0.25"/><circle cx="390" cy="80" r="6" fill="%2338bdf8" opacity="0.35"/><path d="M460,30 L490,50 L475,80 Z" fill="%237dd3fc" opacity="0.2"/></svg>`
  },
  workout: {
    id: 'workout',
    label: 'Strength & Gym',
    accentColor: '#f97316',
    defaultImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%232b130a"/><stop offset="50%" stop-color="%23170a05"/><stop offset="100%" stop-color="%230a0402"/></linearGradient><radialGradient id="fire" cx="80%" cy="50%" r="50%"><stop offset="0%" stop-color="%23f97316" stop-opacity="0.35"/><stop offset="100%" stop-color="%23170a05" stop-opacity="0"/></radialGradient><linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%2352525b"/><stop offset="50%" stop-color="%23d4d4d8"/><stop offset="100%" stop-color="%2371717a"/></linearGradient></defs><rect width="600" height="300" fill="url(%23bg)"/><rect width="600" height="300" fill="url(%23fire)"/><line x1="320" y1="140" x2="580" y2="140" stroke="url(%23bar)" stroke-width="12" stroke-linecap="round"/><rect x="520" y="80" width="22" height="120" rx="4" fill="%2327272a" stroke="%23f97316" stroke-width="2" opacity="0.85"/><rect x="546" y="95" width="18" height="90" rx="3" fill="%2318181b" stroke="%2371717a" stroke-width="1.5" opacity="0.8"/><circle cx="430" cy="115" r="32" fill="%23f97316" opacity="0.2"/><path d="M400,160 L450,110 L480,180 Z" fill="%23fb923c" opacity="0.18"/><polygon points="370,140 430,90 440,160 380,190" fill="%23ea580c" opacity="0.15"/></svg>`
  },
  running: {
    id: 'running',
    label: 'Running & Cardio',
    accentColor: '#eab308',
    defaultImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23241b08"/><stop offset="50%" stop-color="%23151004"/><stop offset="100%" stop-color="%23080501"/></linearGradient><radialGradient id="sun" cx="82%" cy="40%" r="50%"><stop offset="0%" stop-color="%23facc15" stop-opacity="0.32"/><stop offset="100%" stop-color="%23151004" stop-opacity="0"/></radialGradient><linearGradient id="road" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ca8a04" stop-opacity="0.5"/><stop offset="100%" stop-color="%23a16207" stop-opacity="0.1"/></linearGradient></defs><rect width="600" height="300" fill="url(%23bg)"/><rect width="600" height="300" fill="url(%23sun)"/><polygon points="340,300 500,120 540,120 600,300" fill="url(%23road)" opacity="0.35"/><line x1="480" y1="180" x2="520" y2="280" stroke="%23fef08a" stroke-width="4" stroke-dasharray="16,16" opacity="0.45"/><circle cx="490" cy="85" r="28" fill="%23facc15" opacity="0.25"/><polygon points="460,95 500,60 520,120 475,140" fill="%23eab308" opacity="0.2"/><path d="M420,190 L460,140 L490,210" stroke="%23fef08a" stroke-width="3" fill="none" opacity="0.4"/></svg>`
  },
  study: {
    id: 'study',
    label: 'Deep Focus & Study',
    accentColor: '#818cf8',
    defaultImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2314142b"/><stop offset="50%" stop-color="%230b0b1a"/><stop offset="100%" stop-color="%2304040a"/></linearGradient><radialGradient id="screen" cx="78%" cy="50%" r="50%"><stop offset="0%" stop-color="%23818cf8" stop-opacity="0.35"/><stop offset="100%" stop-color="%230b0b1a" stop-opacity="0"/></radialGradient></defs><rect width="600" height="300" fill="url(%23bg)"/><rect width="600" height="300" fill="url(%23screen)"/><rect x="440" y="80" width="110" height="75" rx="6" fill="%23312e81" stroke="%23818cf8" stroke-width="2" opacity="0.45"/><line x1="495" y1="155" x2="495" y2="185" stroke="%236366f1" stroke-width="4" opacity="0.5"/><line x1="470" y1="185" x2="520" y2="185" stroke="%236366f1" stroke-width="4" stroke-linecap="round" opacity="0.5"/><polygon points="455,95 490,95 490,110 455,110" fill="%23a5b4fc" opacity="0.35"/><polygon points="455,120 530,120 530,126 455,126" fill="%23a5b4fc" opacity="0.25"/><polygon points="455,133 510,133 510,139 455,139" fill="%23a5b4fc" opacity="0.25"/><circle cx="390" cy="110" r="30" fill="%23c7d2fe" opacity="0.12"/></svg>`
  },
  mindset: {
    id: 'mindset',
    label: 'Mindset & Meditation',
    accentColor: '#10b981',
    defaultImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2306231a"/><stop offset="50%" stop-color="%2303140e"/><stop offset="100%" stop-color="%23010705"/></linearGradient><radialGradient id="zen" cx="80%" cy="45%" r="50%"><stop offset="0%" stop-color="%2310b981" stop-opacity="0.3"/><stop offset="100%" stop-color="%2303140e" stop-opacity="0"/></radialGradient></defs><rect width="600" height="300" fill="url(%23bg)"/><rect width="600" height="300" fill="url(%23zen)"/><circle cx="480" cy="140" r="55" fill="none" stroke="%2334d399" stroke-width="3" opacity="0.3"/><circle cx="480" cy="140" r="40" fill="none" stroke="%236ee7b7" stroke-width="2" opacity="0.2"/><path d="M480,95 C460,130 500,150 480,185" stroke="%23a7f3d0" stroke-width="2" fill="none" opacity="0.4"/><polygon points="430,140 480,110 530,140 480,170" fill="%23059669" opacity="0.15"/></svg>`
  },
  custom: {
    id: 'custom',
    label: 'Custom Artwork',
    accentColor: '#a855f7',
    defaultImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e102d"/><stop offset="50%" stop-color="%2312071d"/><stop offset="100%" stop-color="%2306020b"/></linearGradient><radialGradient id="glow" cx="80%" cy="45%" r="50%"><stop offset="0%" stop-color="%23a855f7" stop-opacity="0.35"/><stop offset="100%" stop-color="%2312071d" stop-opacity="0"/></radialGradient></defs><rect width="600" height="300" fill="url(%23bg)"/><rect width="600" height="300" fill="url(%23glow)"/><circle cx="480" cy="130" r="45" fill="%23c084fc" opacity="0.15"/><polygon points="440,160 480,90 520,160" fill="%239333ea" opacity="0.25"/></svg>`
  }
};
