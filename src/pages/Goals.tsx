import React from 'react';
import { GoalsView } from '../components/goals/GoalsView';

interface GoalsPageProps {
  onOpenSettings: () => void;
}

export const Goals: React.FC<GoalsPageProps> = ({ onOpenSettings }) => {
  return (
    <div style={{ width: '100%' }}>
      <GoalsView onOpenSettings={onOpenSettings} />
    </div>
  );
};
