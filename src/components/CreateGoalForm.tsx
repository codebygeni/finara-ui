// src/components/CreateGoalForm.tsx (or directly in Dashboard)
import React, { useState } from 'react';
import { createGoal } from '../services/apiService'; // Import createGoal

const CreateGoalForm: React.FC = () => {
  const [goalName, setGoalName] = useState('');
  const [goalLine, setGoalLine] = useState('');

  const [targetAmount, setTargetAmount] = useState("");
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
    const [timeline, setTimeline] = useState(''); // Assuming you want to add a timeline field

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createGoal({

        goal_amount: targetAmount,
        goal_description: goalName,
        goal_line: goalLine,
        goal_timeline: timeline,
      });
      setSuccess(`Goal "${response.goal.name}" created successfully!`);
      setGoalName('');
      setTargetAmount("");
      setDueDate('');
      // You might want to refresh dashboard data here
    } catch (err: any) {
      setError(err.message || 'Failed to create goal.');
      console.error('Create Goal Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-goal-form">
      <h3>Create New Goal</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="goalName">Goal Name:</label>
          <input
            type="text"
            id="goalName"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount:</label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            disabled={loading}
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Goal line:</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setGoalLine(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeline">Timeline (Optional):</label>
          <input
            type="text"
            id="timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g., 6 months, 1 year"
            disabled={loading}
          />    
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Goal'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default CreateGoalForm;