// Import React hooks and types
import { useState, useEffect, useRef } from 'react';
import { Todo } from '../types';
import { generateId } from '../utils';

// Local storage key for persisting todos
const STORAGE_KEY = 'react-todo-app-todos';

/**
 * useTodos Hook
 * 
 * Custom hook that provides complete todo management functionality:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Local storage persistence
 * - Drag and drop reordering
 * - Statistics calculation
 * - Type-safe operations with TypeScript
 * 
 * Returns all necessary functions and state for todo management
 */
export function useTodos() {
  // Main todos state - array of Todo objects
  const [todos, setTodos] = useState<Todo[]>([]);
  // Ref to track if initial load has completed
  const isInitialized = useRef(false);
  // Track if this is the first render
  const isFirstRender = useRef(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    console.log('🔄 useTodos: Loading from localStorage...');
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('📦 useTodos: Raw stored data:', stored);
      if (stored) {
        const parsedTodos = JSON.parse(stored).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        }));
        console.log('✅ useTodos: Parsed todos:', parsedTodos);
        setTodos(parsedTodos);
      } else {
        console.log('⚠️ useTodos: No stored data found');
      }
    } catch (error) {
      console.error('❌ useTodos: Failed to load todos from localStorage:', error);
    }
    // Don't set isInitialized here - wait for the state update to complete
  }, []);

  // Save todos to localStorage whenever todos change (but not on initial load)
  useEffect(() => {
    console.log('💾 useTodos: Save effect triggered. isFirstRender:', isFirstRender.current, 'isInitialized:', isInitialized.current, 'todos length:', todos.length);
    
    // Skip saving on the very first render (initial mount)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      isInitialized.current = true;
      console.log('🏁 useTodos: First render complete, initialization done');
      return;
    }
    
    // Now we can safely save on subsequent changes
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      console.log('✅ useTodos: Successfully saved to localStorage:', todos);
    } catch (error) {
      console.error('❌ useTodos: Failed to save todos to localStorage:', error);
    }
  }, [todos]);

  const addTodo = (text: string, dueDate?: Date, category?: string) => {
    console.log('➕ useTodos: Adding new todo:', { text, dueDate, category });
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date(),
      dueDate,
      category,
    };
    console.log('🆕 useTodos: Created todo object:', newTodo);
    setTodos(prev => {
      const newTodos = [newTodo, ...prev];
      console.log('📝 useTodos: Setting new todos array:', newTodos);
      return newTodos;
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const reorderTodos = (startIndex: number, endIndex: number) => {
    setTodos(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    reorderTodos,
    completedCount,
    totalCount,
  };
}