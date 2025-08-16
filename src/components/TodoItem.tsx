// Import dependencies for todo item functionality
import { Todo } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// Import modern icons from Lucide React
import { Check, Clock, GripVertical, Trash2, Calendar, Tag } from 'lucide-react';
// Import shared category constants
import { getCategoryLabel } from '../constants/categories';
// Import Timer component for due date countdown
import Timer from './Timer';

// Props interface for TodoItem component
interface TodoItemProps {
  todo: Todo;                              // Todo data object
  onToggle: (id: string) => void;          // Function to toggle completion status
  onDelete: (id: string) => void;          // Function to delete the todo
  showDragHandle?: boolean;                // Whether to show drag handle for reordering
}

/**
 * TodoItem Component
 * 
 * Renders an individual todo item with:
 * - Drag and drop functionality for reordering
 * - Interactive checkbox for marking complete/incomplete
 * - Text display with truncation for long content
 * - Due date and category badges
 * - Status indicator badge
 * - Delete button with hover effects
 * 
 * Features strict single-row layout to prevent wrapping
 */
export default function TodoItem({ todo, onToggle, onDelete, showDragHandle = true }: TodoItemProps) {
  // Initialize drag and drop functionality using @dnd-kit
  const {
    attributes,      // Accessibility attributes for screen readers
    listeners,       // Event handlers for drag operations
    setNodeRef,      // Reference to the draggable DOM element
    transform,       // Current transform state during drag
    transition,      // CSS transition for smooth animations
    isDragging,      // Boolean indicating if item is currently being dragged
  } = useSortable({ id: todo.id });

  // Dynamic styles for drag and drop visual feedback
  const style = {
    transform: CSS.Transform.toString(transform),  // Apply drag transform
    transition,                                    // Smooth transitions
    opacity: isDragging ? 0.5 : 1,                // Fade effect while dragging
  };

  return (
    <div 
      ref={setNodeRef}                    // Attach drag and drop reference
      style={style}                       // Apply dynamic drag styles
      id={`todo-item-${todo.id}`}         // Unique identifier for each item
      className={`todo-item glass-card rounded-xl shadow-lg group border border-white/30 w-full ${todo.completed ? 'opacity-80' : ''}`}
      {...attributes}                     // Spread accessibility attributes
    >
      {/* Outer padding container */}
      <div 
        style={{
          padding: '8px',                 // Consistent padding around content
          boxSizing: 'border-box'         // Include padding in size calculations
        }}
      >
        {/* Main content row - strict single-line layout */}
        <div 
          style={{
          display: 'flex',                // Horizontal flexbox layout
          alignItems: 'center',           // Vertically center all elements
          justifyContent: 'space-between', // Distribute space between elements
          gap: '8px',                     // Consistent spacing between elements
          height: '40px',                 // Fixed height to prevent expanding
          width: '100%',                  // Full width utilization
          flexWrap: 'nowrap',             // Prevent wrapping to new lines
          overflow: 'hidden',             // Hide overflow content
          boxSizing: 'border-box',        // Include padding in calculations
          padding: '5px'                  // Inner padding for breathing room
        }}
      >
        {/* Drag Handle - Only shown when reordering is enabled (not during search) */}
        {showDragHandle && (
          <div 
            {...listeners}                     // Attach drag event listeners to handle only
            style={{
              flexShrink: 0,                  // Don't shrink when space is limited
              width: '20px',                  // Fixed width for consistent layout
              height: '20px',                 // Fixed height matching other elements
              display: 'flex',                // Center the drag icon
              alignItems: 'center',           // Vertical centering
              justifyContent: 'center',       // Horizontal centering
              cursor: 'grab',                 // Visual feedback for draggable element
              color: '#9ca3af',               // Subtle gray color
            }}
            title="Drag to reorder"            // Tooltip for user guidance
          >
            <GripVertical size={16} />        {/* Modern grip icon for dragging */}
          </div>
        )}
        
        {/* Custom Checkbox - Interactive completion toggle */}
        <div 
          style={{
            flexShrink: 0,                  // Maintain size when space is limited
            width: '20px',                  // Container width for checkbox
            height: '20px',                 // Container height matching row height
            display: 'flex',                // Center the checkbox element
            alignItems: 'center',           // Vertical alignment
            justifyContent: 'center'        // Horizontal alignment
          }}
        >
          {/* Hidden native checkbox for accessibility and form handling */}
          <input
            type="checkbox"
            checked={todo.completed}                    // Reflects current completion state
            onChange={() => onToggle(todo.id)}         // Triggers state change
            style={{display: 'none'}}                  // Hidden - we use custom styling
            id={`todo-${todo.id}`}                     // Unique ID for label association
          />
          {/* Custom styled checkbox label */}
          <label
            htmlFor={`todo-${todo.id}`}                // Associates with hidden input
            style={{
              width: '18px',                           // Checkbox size
              height: '18px',                          // Square aspect ratio
              borderRadius: '50%',                     // Circular checkbox design
              border: '2px solid #d1d5db',             // Default border color
              cursor: 'pointer',                       // Interactive cursor
              display: 'flex',                         // Center checkmark icon
              alignItems: 'center',                    // Vertical centering
              justifyContent: 'center',                // Horizontal centering
              fontSize: '12px',                        // Checkmark size
              background: todo.completed               // Dynamic background based on state
                ? 'linear-gradient(135deg, #10b981, #3b82f6)'  // Completed: gradient
                : 'rgba(255,255,255,0.6)',                     // Incomplete: semi-transparent
              borderColor: todo.completed ? '#10b981' : '#d1d5db',  // Dynamic border
              color: 'white',                          // Checkmark color
              transition: 'all 0.3s ease',            // Smooth state transitions
              fontWeight: '600'                        // Bold checkmark
            }}
          >
            {todo.completed && <Check size={14} />}    {/* Modern check icon when completed */}
          </label>
        </div>

        {/* Todo Text Container - Flexible text area with inline badges */}
        <div
          style={{
            flex: '1',                      // Take up remaining available space
            minWidth: '0',                  // Allow flexbox to shrink below content width
            overflow: 'hidden',             // Hide overflow to enable ellipsis
            height: '100%',                 // Full height of container
            display: 'flex',                // Horizontal layout for text and badges
            alignItems: 'center',           // Center all content vertically
            gap: '8px'                      // Space between text and badges
          }}
        >
          {/* Main todo text with truncation and completion styling */}
          <span
            title={todo.text}                        // Tooltip shows full text on hover
            style={{
              whiteSpace: 'nowrap',                  // Prevent text wrapping
              overflow: 'hidden',                    // Hide overflowing text
              textOverflow: 'ellipsis',              // Add "..." for truncated text
              fontSize: '15px',                      // Readable text size
              fontWeight: '500',                     // Medium font weight
              color: todo.completed ? '#9ca3af' : '#374151',  // Gray when completed
              textDecoration: todo.completed ? 'line-through' : 'none',  // Strike-through when done
              flex: '1',                             // Take remaining space for text
              minWidth: '0',                         // Allow shrinking
              transition: 'color 0.3s ease'         // Smooth color transitions
            }}
          >
            {todo.text}                              {/* Display the todo text */}
          </span>
          
          {/* Inline badges for due date and category */}
          <div 
            style={{
              display: 'flex',                // Horizontal layout for badges
              alignItems: 'center',           // Vertical alignment
              gap: '6px',                     // Smaller space between badges for inline display
              flexShrink: 0                   // Don't shrink the badges
            }}
          >
            {/* Due Date with Timer - Shows countdown for pending todos, date only for completed */}
            {todo.dueDate && (
              <>
                {/* Real-time countdown timer - only for pending todos */}
                {!todo.completed && (
                  <Timer dueDate={todo.dueDate} isCompleted={todo.completed} />
                )}
                {/* Static date badge for reference */}
                <span 
                  style={{
                    background: 'rgba(156, 163, 175, 0.1)',  // Light gray background
                    color: '#6b7280',                         // Gray text
                    padding: '2px 6px',                       // Compact padding
                    borderRadius: '6px',                      // Smaller rounded corners for inline
                    fontSize: '10px',                         // Small badge text
                    fontWeight: '600',                        // Bold for visibility
                    display: 'flex',                          // Flex for icon alignment
                    alignItems: 'center',                     // Center icon with text
                    gap: '2px',                               // Smaller gap for inline display
                    whiteSpace: 'nowrap'                      // Prevent wrapping
                  }}
                >
                  <Calendar size={10} />                      {/* Clean calendar icon */}
                  {todo.dueDate.toLocaleDateString()}         {/* Formatted date */}
                </span>
              </>
            )}
            {/* Category Badge - Shows when todo has a category */}
            {todo.category && (
              <span 
                style={{
                  background: 'rgba(139, 92, 246, 0.1)', // Light purple background
                  color: '#8b5cf6',                       // Purple text
                  padding: '2px 6px',                     // Compact padding
                  borderRadius: '6px',                    // Smaller rounded corners for inline
                  fontSize: '10px',                       // Small badge text
                  fontWeight: '600',                      // Bold for visibility
                  display: 'flex',                        // Flex for icon alignment
                  alignItems: 'center',                   // Center icon with text
                  gap: '2px',                             // Smaller gap for inline display
                  whiteSpace: 'nowrap'                    // Prevent wrapping
                }}
              >
                <Tag size={10} />                         {/* Tag icon for categories */}
                {getCategoryLabel(todo.category)}         {/* Category name with emoji */}
              </span>
            )}
          </div>
        </div>

        {/* Status Badge - Visual completion indicator */}
        <div 
          style={{
            flexShrink: 0,                    // Don't shrink when space is limited
            padding: '4px 8px',               // Comfortable padding for badge
            borderRadius: '12px',             // Rounded badge appearance
            fontSize: '10px',                 // Small, readable text
            fontWeight: '600',                // Bold for emphasis
            whiteSpace: 'nowrap',             // Prevent text wrapping
            background: todo.completed        // Dynamic background based on completion
              ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)'  // Completed: green gradient
              : 'linear-gradient(135deg, #dbeafe, #e0e7ff)', // Pending: blue gradient
            color: todo.completed ? '#15803d' : '#1e40af',   // Text color matches background
            border: todo.completed ? '1px solid #22c55e' : '1px solid #3b82f6', // Subtle border
            transition: 'all 0.3s ease'      // Smooth transitions when state changes
          }}
        >
          {/* Status icon - modern check for completed, clock for pending */}
          {todo.completed ? <Check size={12} /> : <Clock size={12} />}
        </div>

        {/* Delete Button - Always visible with hover effects */}
        <button
          onClick={() => onDelete(todo.id)}     // Trigger delete action
          style={{
            flexShrink: 0,                      // Maintain size when space is limited
            width: '32px',                      // Fixed button size
            height: '32px',                     // Square button
            border: 'none',                     // Clean appearance
            borderRadius: '6px',                // Slightly rounded corners
            background: '#dc2626',              // Solid red background
            color: 'white',                     // White text/icon
            fontSize: '18px',                   // Large, visible icon
            cursor: 'pointer',                  // Interactive cursor
            opacity: 0.7,                       // Slightly transparent at rest
            display: 'flex',                    // Center the delete icon
            alignItems: 'center',               // Vertical centering
            justifyContent: 'center',           // Horizontal centering
            outline: 'none',                    // Remove focus outline
            transition: 'all 0.3s ease',       // Smooth hover transitions
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Subtle shadow
          }}
          title="Delete todo"                   // Tooltip for user guidance
          // Hover effect - increase opacity and scale
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '1';
            (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          // Return to normal state when hover ends
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '0.7';
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          <Trash2 size={16} />
        </button>
        </div>
      </div>
    </div>
  );
}