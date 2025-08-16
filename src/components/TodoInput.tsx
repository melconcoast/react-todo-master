// Import React hooks for component state management
import { useState } from 'react';
// Import modern icons from Lucide React
import { Plus } from 'lucide-react';
// Import shared category constants
import { CATEGORY_OPTIONS } from '../constants/categories';
// Import custom ComboBox component
import ComboBox from './ComboBox';
// Import Todo type
import { Todo } from '../types';

// Props interface for TodoInput component
interface TodoInputProps {
  onAdd: (text: string, dueDate?: Date, category?: string) => void;  // Callback to add new todos
  todos: Todo[];  // Existing todos to extract custom categories from
}

/**
 * TodoInput Component
 * 
 * Provides a comprehensive form for creating new todos with:
 * - Main text input for todo description
 * - Optional due date picker
 * - Optional category field
 * - Form validation and submission
 * - Clean, modern glass-morphism design
 * 
 * Features multi-row layout with consistent styling
 */
export default function TodoInput({ onAdd, todos }: TodoInputProps) {
  // State management for form inputs
  const [text, setText] = useState('');           // Main todo text
  const [dueDate, setDueDate] = useState('');     // Due date as string (HTML date input)
  const [category, setCategory] = useState('');   // Optional category/tag

  // Generate dynamic category options by combining static options with custom categories from todos
  const getDynamicCategoryOptions = () => {
    // Extract unique custom categories from existing todos
    const customCategories = todos
      .filter(todo => todo.category && todo.category.trim())
      .map(todo => todo.category!)
      .filter((category, index, array) => array.indexOf(category) === index) // Remove duplicates
      .filter(category => !CATEGORY_OPTIONS.some(option => option.value === category)) // Exclude already existing options
      .map(category => ({
        value: category,
        label: category.includes('🏷️') ? category : `🏷️ ${category}` // Add emoji if not present
      }));

    // Combine static options with custom categories
    return [...CATEGORY_OPTIONS, ...customCategories];
  };

  const dynamicCategoryOptions = getDynamicCategoryOptions();

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();                           // Prevent default form submission
    const trimmedText = text.trim();              // Remove whitespace
    
    if (trimmedText) {                            // Only submit if text is not empty
      // Convert date string to Date object if provided (fix timezone issues)
      let parsedDueDate: Date | undefined = undefined;
      if (dueDate) {
        // Parse the date string manually to avoid timezone issues
        const [year, month, day] = dueDate.split('-').map(num => parseInt(num, 10));
        parsedDueDate = new Date(year, month - 1, day); // month is 0-indexed
      }
      // Clean category or set to undefined if empty
      const trimmedCategory = category.trim() || undefined;
      
      // Call parent callback with processed data
      onAdd(trimmedText, parsedDueDate, trimmedCategory);
      
      // Reset form fields after successful submission
      setText('');
      setDueDate('');
      setCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in w-full" id="todo-input-section">
      <div className="glass-card rounded-2xl p-4 shadow-2xl border border-white/30 w-full" id="todo-input-container">
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Main input row */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              height: '56px',
              width: '100%',
              flexWrap: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
          <div 
            style={{
              flex: '1',
              minWidth: '0',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a new item ..."
              style={{
                width: '100%',
                height: '40px',
                padding: '0 16px',
                fontSize: '16px',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(8px)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                fontWeight: '500',
                color: '#374151'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                e.target.style.borderColor = '#8b5cf6';
                e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            style={{
              flexShrink: 0,
              height: '40px',
              padding: '0 16px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #3b82f6)',
              backgroundSize: '200% 200%',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              outline: 'none',
              opacity: text.trim() ? 1 : 0.5
            }}
            onMouseEnter={(e) => {
              if (text.trim()) {
                (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
          </div>
          
          {/* Additional fields row */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              height: '40px',
              width: '100%',
              flexWrap: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ flex: '1', minWidth: '0' }}>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Due date"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontWeight: '500',
                  color: '#374151'
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={{ flex: '1', minWidth: '0' }}>
              <ComboBox
                value={category}
                onChange={setCategory}
                options={dynamicCategoryOptions}
                placeholder="Type or select category..."
                style={{
                  height: '40px',
                  padding: '0 12px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontWeight: '500',
                  color: '#374151'
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}