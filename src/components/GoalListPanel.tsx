// src/components/GoalListPanel.tsx
import React from 'react';
import { Goal } from '../services/apiService'; // Import the Goal interface
import './GoalListPanel.css'; // Create this CSS file for styling

interface GoalListPanelProps {
  goals: Goal[];
  loading: boolean;
  error: string | null;
}

const GoalListPanel: React.FC<GoalListPanelProps> = ({ goals, loading, error }) => {
  if (loading) {
    return <div className="goal-list-message">Loading your goals...</div>;
  }

  if (error) {
    return <div className="goal-list-message error-message">Error: {error}</div>;
  }

  if (goals.length === 0) {
    return <div className="goal-list-message">No goals set yet. Start by creating one!</div>;
  }

  return (
    <div className="goal-list-container">
      <h3>Your Current Financial Goals</h3>
      <ul className="goal-items-list">
        {goals.map((goal) => {
          const progress = goal.targetAmount > 0
            ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
            : 0;
          return (
            <li key={goal.id} className="goal-item-card">
              <h4>{goal.name}</h4>
              <p>Target: ${goal.targetAmount.toLocaleString()}</p>
              <p>Current: ${goal.currentAmount.toLocaleString()}</p>
              {goal.dueDate && <p>Due Date: {new Date(goal.dueDate).toLocaleDateString()}</p>}
              <div className="goal-progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="progress-text">{progress}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GoalListPanel;