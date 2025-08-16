import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../useTodos'

describe('useTodos Hook - localStorage Persistence', () => {
  const STORAGE_KEY = 'react-todo-app-todos'
  
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })
    
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Loading from localStorage', () => {
    it('loads existing todos from localStorage on mount', () => {
      const mockTodos = [
        {
          id: '1',
          text: 'Test todo',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z',
          dueDate: '2025-12-25T00:00:00.000Z',
          category: 'work'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos))

      const { result } = renderHook(() => useTodos())

      expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEY)
      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].text).toBe('Test todo')
      expect(result.current.todos[0].createdAt).toBeInstanceOf(Date)
      expect(result.current.todos[0].dueDate).toBeInstanceOf(Date)
    })

    it('handles empty localStorage gracefully', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useTodos())

      expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEY)
      expect(result.current.todos).toHaveLength(0)
    })

    it('handles corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')

      const { result } = renderHook(() => useTodos())

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load todos from localStorage:',
        expect.any(Error)
      )
      expect(result.current.todos).toHaveLength(0)
    })

    it('handles todos without due dates correctly', () => {
      const mockTodos = [
        {
          id: '1',
          text: 'Todo without due date',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z',
          category: 'personal'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos))

      const { result } = renderHook(() => useTodos())

      expect(result.current.todos[0].dueDate).toBeUndefined()
    })
  })

  describe('Saving to localStorage', () => {
    it('saves todos to localStorage when adding a new todo', () => {
      localStorageMock.getItem.mockReturnValue('[]') // Start with empty

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('New todo', new Date('2025-12-25'), 'work')
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.stringContaining('"text":"New todo"')
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.stringContaining('"category":"work"')
      )
    })

    it('saves todos to localStorage when toggling completion', () => {
      const mockTodos = [
        {
          id: 'test-id',
          text: 'Test todo',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos))

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.toggleTodo('test-id')
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.stringContaining('"completed":true')
      )
    })

    it('saves todos to localStorage when deleting a todo', () => {
      const mockTodos = [
        {
          id: 'test-id-1',
          text: 'Todo 1',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z'
        },
        {
          id: 'test-id-2',
          text: 'Todo 2',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos))

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.deleteTodo('test-id-1')
      })

      // Should save the remaining todo
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.stringContaining('"text":"Todo 2"')
      )
      // Should not contain the deleted todo
      const savedData = localStorageMock.setItem.mock.calls[
        localStorageMock.setItem.mock.calls.length - 1
      ][1]
      expect(savedData).not.toContain('Todo 1')
    })

    it('saves todos to localStorage when reordering', () => {
      const mockTodos = [
        {
          id: 'test-id-1',
          text: 'Todo 1',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z'
        },
        {
          id: 'test-id-2',
          text: 'Todo 2',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos))

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.reorderTodos(0, 1) // Move first item to second position
      })

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('handles localStorage save errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('[]')
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('New todo')
      })

      expect(console.error).toHaveBeenCalledWith(
        'Failed to save todos to localStorage:',
        expect.any(Error)
      )
    })
  })

  describe('Data integrity', () => {
    it('preserves all todo properties during save/load cycle', () => {
      const originalTodo = {
        id: 'test-id',
        text: 'Complete todo with all properties',
        completed: true,
        createdAt: '2025-01-01T12:00:00.000Z',
        dueDate: '2025-12-25T23:59:59.999Z',
        category: 'work'
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify([originalTodo]))

      const { result } = renderHook(() => useTodos())

      const loadedTodo = result.current.todos[0]
      
      expect(loadedTodo.id).toBe(originalTodo.id)
      expect(loadedTodo.text).toBe(originalTodo.text)
      expect(loadedTodo.completed).toBe(originalTodo.completed)
      expect(loadedTodo.category).toBe(originalTodo.category)
      expect(loadedTodo.createdAt).toBeInstanceOf(Date)
      expect(loadedTodo.dueDate).toBeInstanceOf(Date)
      expect(loadedTodo.createdAt.toISOString()).toBe(originalTodo.createdAt)
      expect(loadedTodo.dueDate?.toISOString()).toBe(originalTodo.dueDate)
    })

    it('maintains correct todo order after reload', () => {
      const mockTodos = [
        {
          id: 'first',
          text: 'First todo',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z'
        },
        {
          id: 'second',
          text: 'Second todo',
          completed: false,
          createdAt: '2025-01-01T11:00:00.000Z'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos))

      const { result } = renderHook(() => useTodos())

      expect(result.current.todos[0].id).toBe('first')
      expect(result.current.todos[1].id).toBe('second')
    })
  })

  describe('Statistics persistence', () => {
    it('correctly calculates statistics from loaded todos', () => {
      const mockTodos = [
        {
          id: '1',
          text: 'Completed todo',
          completed: true,
          createdAt: '2025-01-01T12:00:00.000Z'
        },
        {
          id: '2',
          text: 'Pending todo 1',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z'
        },
        {
          id: '3',
          text: 'Pending todo 2',
          completed: false,
          createdAt: '2025-01-01T12:00:00.000Z'
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTodos))

      const { result } = renderHook(() => useTodos())

      expect(result.current.totalCount).toBe(3)
      expect(result.current.completedCount).toBe(1)
    })
  })
})