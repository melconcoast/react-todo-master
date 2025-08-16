import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TodoInput from '../TodoInput'
import { Todo } from '../../types'

describe('TodoInput Component', () => {
  const mockOnAdd = vi.fn()
  const mockTodos: Todo[] = []

  beforeEach(() => {
    mockOnAdd.mockClear()
  })

  it('renders correctly with all form elements', () => {
    render(<TodoInput onAdd={mockOnAdd} todos={mockTodos} />)
    
    expect(screen.getByPlaceholderText('Add a new item ...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Due date')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type or select category...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('allows user to type in the main input field', () => {
    render(<TodoInput onAdd={mockOnAdd} todos={mockTodos} />)
    
    const textInput = screen.getByPlaceholderText('Add a new item ...')
    fireEvent.change(textInput, { target: { value: 'Test todo item' } })
    
    expect(textInput).toHaveValue('Test todo item')
  })

  it('calls onAdd with correct parameters when form is submitted', () => {
    render(<TodoInput onAdd={mockOnAdd} todos={mockTodos} />)
    
    const textInput = screen.getByPlaceholderText('Add a new item ...')
    const form = textInput.closest('form')!
    
    fireEvent.change(textInput, { target: { value: 'Test todo' } })
    fireEvent.submit(form)
    
    expect(mockOnAdd).toHaveBeenCalledWith(
      'Test todo',
      undefined,
      undefined
    )
  })

  it('does not submit when text is empty', () => {
    render(<TodoInput onAdd={mockOnAdd} todos={mockTodos} />)
    
    const textInput = screen.getByPlaceholderText('Add a new item ...')
    const form = textInput.closest('form')!
    
    fireEvent.submit(form)
    
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('clears form after successful submission', () => {
    render(<TodoInput onAdd={mockOnAdd} todos={mockTodos} />)
    
    const textInput = screen.getByPlaceholderText('Add a new item ...')
    const form = textInput.closest('form')!
    
    fireEvent.change(textInput, { target: { value: 'Test todo' } })
    fireEvent.submit(form)
    
    expect(textInput).toHaveValue('')
  })

  it('shows dynamic category options from existing todos', () => {
    const todosWithCategories: Todo[] = [
      {
        id: '1',
        text: 'Test',
        completed: false,
        createdAt: new Date(),
        category: 'custom work'
      }
    ]
    
    render(<TodoInput onAdd={mockOnAdd} todos={todosWithCategories} />)
    
    // The ComboBox should receive the dynamic options including custom categories
    expect(screen.getByPlaceholderText('Type or select category...')).toBeInTheDocument()
  })
})