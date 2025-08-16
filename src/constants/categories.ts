// Shared category options for the todo application
export const CATEGORY_OPTIONS = [
  { value: '', label: 'No Category' },
  { value: 'work', label: '💼 Work' },
  { value: 'personal', label: '👤 Personal' },
  { value: 'shopping', label: '🛒 Shopping' },
  { value: 'health', label: '🏥 Health' },
  { value: 'finance', label: '💰 Finance' },
  { value: 'home', label: '🏠 Home' },
  { value: 'education', label: '📚 Education' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'hobby', label: '🎨 Hobby' },
  { value: 'urgent', label: '🔥 Urgent' },
];

// Helper function to get category label by value
export const getCategoryLabel = (value: string): string => {
  if (!value) return '';
  
  const option = CATEGORY_OPTIONS.find(opt => opt.value === value);
  if (option) {
    return option.label;
  }
  
  // For custom categories, add a generic tag emoji if it doesn't have one
  const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(value);
  return hasEmoji ? value : `🏷️ ${value}`;
};