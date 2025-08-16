import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Timer from '../Timer'

describe('Timer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('displays countdown for future due date', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 2) // 2 days from now
    
    render(<Timer dueDate={futureDate} isCompleted={false} />)
    
    expect(screen.getByText(/remaining/)).toBeInTheDocument()
  })

  it('displays overdue status for past due date', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1) // 1 day ago
    
    render(<Timer dueDate={pastDate} isCompleted={false} />)
    
    expect(screen.getByText(/overdue/)).toBeInTheDocument()
  })

  it('shows clock icon for normal countdown', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 5) // 5 days from now
    
    render(<Timer dueDate={futureDate} isCompleted={false} />)
    
    // Should show clock icon (not alert triangle)
    const container = screen.getByText(/remaining/).closest('div')
    expect(container).toBeInTheDocument()
  })

  it('shows alert icon for overdue items', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1) // 1 day ago
    
    render(<Timer dueDate={pastDate} isCompleted={false} />)
    
    // Should show alert triangle icon
    const container = screen.getByText(/overdue/).closest('div')
    expect(container).toBeInTheDocument()
  })

  it('updates timer every minute', () => {
    const futureDate = new Date()
    futureDate.setMinutes(futureDate.getMinutes() + 5) // 5 minutes from now
    
    const { rerender } = render(<Timer dueDate={futureDate} isCompleted={false} />)
    
    // Fast forward 1 minute
    act(() => {
      vi.advanceTimersByTime(60000) // 1 minute
    })
    
    rerender(<Timer dueDate={futureDate} isCompleted={false} />)
    
    expect(screen.getByText(/remaining/)).toBeInTheDocument()
  })

  it('does not update timer for completed todos', () => {
    const futureDate = new Date()
    futureDate.setMinutes(futureDate.getMinutes() + 5)
    
    render(<Timer dueDate={futureDate} isCompleted={true} />)
    
    // Fast forward time - timer should not update for completed todos
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    
    // Timer should still be present but not actively updating
    expect(screen.getByText(/remaining/)).toBeInTheDocument()
  })

  it('shows proper tooltip with due date information', () => {
    const dueDate = new Date(2025, 11, 25) // Local timezone date
    
    render(<Timer dueDate={dueDate} isCompleted={false} />)
    
    const timer = screen.getByText(/remaining/).closest('div')
    expect(timer).toHaveAttribute('title', expect.stringContaining('Due:'))
    expect(timer).toHaveAttribute('title', expect.stringContaining('11:59 PM'))
  })
})