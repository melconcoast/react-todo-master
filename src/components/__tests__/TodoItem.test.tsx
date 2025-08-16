import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '../TodoItem'
import { Todo } from '../../types'
import { DndContext } from '@dnd-kit/core'

// Mock the Timer component to avoid timer complexity in tests
vi.mock('../Timer', () => ({
  default: ({ dueDate, isCompleted }: { dueDate: Date; isCompleted: boolean }) => (
    <div data-testid="timer">Timer: {dueDate.toISOString()}, Completed: {isCompleted.toString()}</div>
  )
}))

describe('TodoItem Component', () => {
  const mockOnToggle = vi.fn()
  const mockOnDelete = vi.fn()

  const baseTodo: Todo = {
    id: '1',
    text: 'Test todo item',
    completed: false,
    createdAt: new Date(),
  }

  const DndWrapper = ({ children }: { children: React.ReactNode }) => (
    <DndContext>
      {children}
    </DndContext>
  )

  beforeEach(() => {
    mockOnToggle.mockClear()
    mockOnDelete.mockClear()
  })

  it('renders todo text correctly', () => {
    render(
      <DndWrapper>
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      </DndWrapper>
    )
    
    expect(screen.getByText('Test todo item')).toBeInTheDocument()
  })

  it('shows completed status correctly', () => {
    const completedTodo = { ...baseTodo, completed: true }
    render(
      <DndWrapper>
        <TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      </DndWrapper>
    )
    
    const checkbox = document.getElementById('todo-1') as HTMLInputElement
    expect(checkbox).toBeChecked()
  })

  it('calls onToggle when checkbox is clicked', () => {
    render(
      <DndWrapper>
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      </DndWrapper>
    )
    
    const checkboxLabel = document.querySelector('label[for="todo-1"]') as HTMLLabelElement
    fireEvent.click(checkboxLabel)
    
    expect(mockOnToggle).toHaveBeenCalledWith('1')
  })

  it('calls onDelete when delete button is clicked', () => {
    render(
      <DndWrapper>
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      </DndWrapper>
    )
    
    const deleteButton = screen.getByTitle('Delete todo')
    fireEvent.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('displays due date when provided', () => {
    // Create date using local timezone to avoid timezone issues
    const todoWithDueDate = {
      ...baseTodo,
      dueDate: new Date(2025, 11, 25) // Year, Month (0-indexed), Day
    }
    
    render(
      <DndWrapper>
        <TodoItem todo={todoWithDueDate} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      </DndWrapper>
    )
    
    expect(screen.getByText('12/25/2025')).toBeInTheDocument()
  })

  it('displays category when provided', () => {
    const todoWithCategory = {
      ...baseTodo,
      category: 'work'
    }
    
    render(
      <DndWrapper>
        <TodoItem todo={todoWithCategory} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      </DndWrapper>
    )
    
    expect(screen.getByText('💼 Work')).toBeInTheDocument()
  })

  it('shows timer for pending todos with due date', () => {
    const todoWithDueDate = {
      ...baseTodo,
      dueDate: new Date(2025, 11, 25) // Local timezone date
    }
    
    render(
      <DndWrapper>
        <TodoItem todo={todoWithDueDate} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      </DndWrapper>
    )
    
    expect(screen.getByTestId('timer')).toBeInTheDocument()
    expect(screen.getByTestId('timer')).toHaveTextContent('Completed: false')
  })

  it('hides timer for completed todos', () => {
    const completedTodoWithDueDate = {
      ...baseTodo,
      completed: true,
      dueDate: new Date(2025, 11, 25) // Local timezone date
    }
    
    render(
      <DndWrapper>
        <TodoItem todo={completedTodoWithDueDate} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      </DndWrapper>
    )
    
    expect(screen.queryByTestId('timer')).not.toBeInTheDocument()
  })

  it('shows drag handle when showDragHandle is true', () => {
    render(
      <DndWrapper>
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} showDragHandle={true} />
      </DndWrapper>
    )
    
    expect(screen.getByTitle('Drag to reorder')).toBeInTheDocument()
  })

  it('hides drag handle when showDragHandle is false', () => {
    render(
      <DndWrapper>
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} showDragHandle={false} />
      </DndWrapper>
    )
    
    expect(screen.queryByTitle('Drag to reorder')).not.toBeInTheDocument()
  })
})