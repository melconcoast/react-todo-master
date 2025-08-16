// Export utility functions here
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Time remaining calculation utility
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  isOverdue: boolean;
  totalMinutes: number;
}

export const calculateTimeRemaining = (dueDate: Date): TimeRemaining => {
  const now = new Date();
  
  // Set the due date to 23:59:59 of the given date
  const dueDateEndOfDay = new Date(dueDate);
  dueDateEndOfDay.setHours(23, 59, 59, 999);
  
  // Calculate difference in milliseconds
  const diffMs = dueDateEndOfDay.getTime() - now.getTime();
  const isOverdue = diffMs < 0;
  
  // Use absolute value for calculations
  const absDiffMs = Math.abs(diffMs);
  
  // Convert to minutes, hours, days
  const totalMinutes = Math.floor(absDiffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  
  return {
    days,
    hours,
    minutes,
    isOverdue,
    totalMinutes
  };
};

export const formatTimeRemaining = (timeRemaining: TimeRemaining): string => {
  const { days, hours, minutes, isOverdue } = timeRemaining;
  
  if (isOverdue) {
    if (days > 0) {
      return `${days}d overdue`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m overdue`;
    } else {
      return `${minutes}m overdue`;
    }
  } else {
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  }
};