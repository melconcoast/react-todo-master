import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { calculateTimeRemaining, formatTimeRemaining, TimeRemaining } from '../utils';

interface TimerProps {
  dueDate: Date;
  isCompleted?: boolean;
}

/**
 * Timer Component
 * 
 * Shows a real-time countdown timer for todo items with due dates:
 * - Updates every minute to show accurate time remaining
 * - Shows days, hours, and minutes remaining
 * - Changes appearance when overdue
 * - Uses 23:59:59 as end of day for calculations
 * - Pauses updates for completed todos
 */
export default function Timer({ dueDate, isCompleted = false }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(dueDate)
  );

  // Update timer every minute
  useEffect(() => {
    if (isCompleted) {
      // Don't update timer for completed todos
      return;
    }

    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining(dueDate));
    };

    // Update immediately
    updateTimer();

    // Set up interval to update every minute
    const interval = setInterval(updateTimer, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [dueDate, isCompleted]);

  const formattedTime = formatTimeRemaining(timeRemaining);
  const isOverdue = timeRemaining.isOverdue && !isCompleted;
  const isUrgent = !isCompleted && !isOverdue && timeRemaining.totalMinutes < 1440; // Less than 24 hours

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 6px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        background: isOverdue 
          ? 'rgba(239, 68, 68, 0.15)' // Red background for overdue
          : isUrgent 
          ? 'rgba(245, 158, 11, 0.15)' // Orange background for urgent (< 24h)
          : 'rgba(59, 130, 246, 0.1)', // Blue background for normal
        color: isOverdue 
          ? '#dc2626' // Red text for overdue
          : isUrgent 
          ? '#d97706' // Orange text for urgent
          : '#2563eb', // Blue text for normal
        border: `1px solid ${
          isOverdue 
          ? 'rgba(239, 68, 68, 0.3)' 
          : isUrgent 
          ? 'rgba(245, 158, 11, 0.3)' 
          : 'rgba(59, 130, 246, 0.2)'
        }`,
        transition: 'all 0.3s ease'
      }}
      title={`Due: ${dueDate.toLocaleDateString()} at 11:59 PM`}
    >
      {isOverdue ? (
        <AlertTriangle size={10} />
      ) : (
        <Clock size={10} />
      )}
      {formattedTime}
    </div>
  );
}