// Import React hooks and icons
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

// Interface for combo box options
interface ComboBoxOption {
  value: string;
  label: string;
}

// Props interface for ComboBox component
interface ComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  options: ComboBoxOption[];
  placeholder?: string;
  style?: React.CSSProperties;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * ComboBox Component
 * 
 * A true combo box that combines a text input with a dropdown list:
 * - Users can type custom values directly in the text input
 * - Users can select from predefined options in the dropdown
 * - Supports filtering options as user types
 * - Maintains glass-morphism styling consistent with the app
 */
export default function ComboBox({ 
  value, 
  onChange, 
  options, 
  placeholder = "Type or select...",
  style = {},
  onFocus,
  onBlur
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on input value
  useEffect(() => {
    if (!value.trim()) {
      // Show all options when input is empty
      setFilteredOptions(options);
    } else {
      // Filter options that match the input
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(value.toLowerCase()) ||
        option.value.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [value, options]);

  // Update dropdown position when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Handle option selection
  const handleOptionClick = (option: ComboBoxOption) => {
    onChange(option.value);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle input focus
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsOpen(true);
    onFocus?.(e);
  };

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay to allow option clicks to register
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 150);
    onBlur?.(e);
  };

  // Handle dropdown toggle
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    inputRef.current?.focus();
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative', 
        width: '100%',
        zIndex: 1 // Ensure the container has a stacking context
      }}>
      {/* Input field with dropdown button */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const isExactMatch = options.some(option => 
                option.value.toLowerCase() === value.trim().toLowerCase() || 
                option.label.toLowerCase() === value.trim().toLowerCase()
              );
              
              if (value.trim() && !isExactMatch) {
                // Add custom category on Enter when typing a new value
                onChange(value.trim());
                setIsOpen(false);
              } else if (filteredOptions.length === 1) {
                // Auto-select the only matching option on Enter
                handleOptionClick(filteredOptions[0]);
              }
            } else if (e.key === 'Escape') {
              // Close dropdown on Escape
              setIsOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          style={{
            ...style,
            paddingRight: '40px', // Make room for dropdown button
            width: '100%'
          }}
        />
        {/* Dropdown toggle button */}
        <button
          type="button"
          onClick={handleDropdownToggle}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            color: '#6b7280',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.color = '#6b7280';
          }}
        >
          <ChevronDown 
            size={16} 
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          />
        </button>
      </div>

      {/* Dropdown list rendered as portal to avoid stacking context issues */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 99999, // Extremely high z-index to ensure it's above everything
            background: 'rgba(255, 255, 255, 0.98)', // More opaque for better visibility
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', // Safari support
            border: '2px solid rgba(255, 255, 255, 0.6)',
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)', // Stronger shadow for better separation
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '4px',
            isolation: 'isolate' // Create new stacking context
          }}
        >
          {/* Show matching options first */}
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                transition: 'all 0.2s ease',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(139, 92, 246, 0.1)';
                (e.target as HTMLElement).style.color = '#8b5cf6';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'transparent';
                (e.target as HTMLElement).style.color = '#374151';
              }}
            >
              {option.label}
            </div>
          ))}
          
          {/* Show "Add custom category" option when typing a value that doesn't exactly match any existing option */}
          {value.trim() && !options.some(option => 
            option.value.toLowerCase() === value.trim().toLowerCase() || 
            option.label.toLowerCase() === value.trim().toLowerCase()
          ) && (
            <>
              {filteredOptions.length > 0 && (
                <div style={{ 
                  borderTop: '1px solid rgba(139, 92, 246, 0.2)', 
                  margin: '4px 8px' 
                }} />
              )}
              <div
                onClick={() => {
                  onChange(value.trim());
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#8b5cf6',
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  background: 'rgba(139, 92, 246, 0.05)',
                  border: '1px dashed rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(139, 92, 246, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(139, 92, 246, 0.05)';
                }}
              >
                🏷️ Add "{value.trim()}" as new category
              </div>
            </>
          )}
          
          {/* Show helpful message when no input */}
          {!value.trim() && filteredOptions.length === 0 && (
            <div
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                color: '#9ca3af',
                textAlign: 'center'
              }}
            >
              Type to search or add custom category
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}