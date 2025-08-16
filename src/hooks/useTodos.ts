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
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedTodos = JSON.parse(stored).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        }));
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
    }
  }, []);

  // Save todos to localStorage whenever todos change (but not on initial load)
  useEffect(() => {
    // Skip saving on the very first render (initial mount)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      isInitialized.current = true;
      return;
    }
    
    // Now we can safely save on subsequent changes
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }, [todos]);

  const addTodo = (text: string, dueDate?: Date, category?: string) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date(),
      dueDate,
      category,
    };
    setTodos(prev => [newTodo, ...prev]);
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