// Import components and hooks
import { TodoInput, TodoList } from './components';
import { useTodos } from './hooks';
import { useState } from 'react';
// Import modern icons from Lucide React
import { Search, X, CheckSquare2 } from 'lucide-react';

/**
 * Main App Component
 * 
 * Root component that orchestrates the entire todo application:
 * - Manages global state through useTodos hook
 * - Provides search functionality across todos
 * - Renders all major UI sections with glass-morphism design
 * - Handles responsive layout and animations
 * - Integrates drag-and-drop, filtering, and statistics
 */
function App() {
  // Initialize todo management hook with full CRUD operations
  const { todos, addTodo, toggleTodo, deleteTodo, reorderTodos, totalCount } = useTodos();
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter todos based on search query (searches both text and category)
  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.category && todo.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Calculate statistics based on current view (filtered results or all todos)
  const displayTodos = searchQuery ? filteredTodos : todos;
  const displayCompletedCount = displayTodos.filter(todo => todo.completed).length;
  const displayTotalCount = displayTodos.length;

  return (
    <div 
      className="w-screen h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 w-full max-w-5xl p-4">
        <header className="text-center mb-6 fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckSquare2 
              size={48} 
              className="text-purple-600" 
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
              }}
            />
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Todo Master
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-cyan-600 mx-auto rounded-full mb-2"></div>
          <p className="text-base lg:text-lg text-gray-600 font-medium">Transform your productivity with style</p>
        </header>

        <div className="w-full max-w-5xl mx-auto space-y-4">
          <TodoInput onAdd={addTodo} todos={todos} />

          {/* Search Input */}
          {totalCount > 0 && (
            <div className="glass-card rounded-2xl p-3 fade-in border border-white/30 w-full">
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  height: '40px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Search size={18} style={{ flexShrink: 0, color: '#6b7280' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search todos by text or category..."
                  style={{
                    flex: 1,
                    height: '36px',
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
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      flexShrink: 0,
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      borderRadius: '50%',
                      background: 'rgba(156, 163, 175, 0.2)',
                      color: '#6b7280',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'rgba(156, 163, 175, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'rgba(156, 163, 175, 0.2)';
                    }}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {totalCount > 0 && (
            <div id="stats-bar-section" className="glass-card rounded-2xl p-4 slide-in border border-white/30 w-full">
              <div 
                id="stats-bar-container"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '40px',
                  width: '100%',
                  flexWrap: 'nowrap',
                  gap: '16px',
                  boxSizing: 'border-box'
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexShrink: 1,
                    minWidth: '0'
                  }}
                >
                  <span 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}
                  >
                    <span 
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }}
                    ></span>
                    Total: {displayTotalCount}
                  </span>
                  <span 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}
                  >
                    <span 
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#10b981',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }}
                    ></span>
                    Done: {displayCompletedCount}
                  </span>
                </div>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0
                  }}
                >
                  <div 
                    style={{
                      width: '80px',
                      height: '8px',
                      background: 'rgba(209, 213, 219, 0.8)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div 
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #34d399, #3b82f6, #8b5cf6)',
                        borderRadius: '20px',
                        transition: 'width 0.7s ease-out',
                        width: `${displayTotalCount > 0 ? (displayCompletedCount / displayTotalCount) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span 
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#4b5563',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {displayTotalCount > 0 ? Math.round((displayCompletedCount / displayTotalCount) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <TodoList 
            todos={searchQuery ? filteredTodos : todos} 
            onToggle={toggleTodo} 
            onDelete={deleteTodo} 
            onReorder={searchQuery ? undefined : reorderTodos} 
            searchQuery={searchQuery}
          />

          {/* Footer */}
          <footer className="mt-8 text-center fade-in">
            <div className="glass-card rounded-2xl p-4 border border-white/30">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Created by <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Krishnakant Vyas</span>
                </p>
                <p className="text-xs text-gray-500">
                  © {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App