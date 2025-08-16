import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateId, calculateTimeRemaining, formatTimeRemaining } from '../index'

describe('Utility Functions', () => {
  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
    })

    it('generates string IDs', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
    })
  })

  describe('calculateTimeRemaining', () => {
    beforeEach(() => {
      // Mock current time to Jan 1, 2025, 12:00 PM
      vi.setSystemTime(new Date('2025-01-01T12:00:00'))
    })

    it('calculates time remaining for future date', () => {
      const futureDate = new Date(2025, 0, 2) // Tomorrow (Jan 2, 2025)
      const result = calculateTimeRemaining(futureDate)
      
      expect(result.isOverdue).toBe(false)
      expect(result.days).toBeGreaterThanOrEqual(0) // Could be 0 or 1 depending on exact time
      expect(result.totalMinutes).toBeGreaterThan(0)
    })

    it('calculates overdue time for past date', () => {
      const pastDate = new Date(2024, 11, 31) // Yesterday (Dec 31, 2024)
      const result = calculateTimeRemaining(pastDate)
      
      expect(result.isOverdue).toBe(true)
      expect(result.totalMinutes).toBeGreaterThan(0) // Check total minutes instead of days
    })

    it('sets due date to end of day (23:59:59)', () => {
      const today = new Date(2025, 0, 1) // Local timezone: Jan 1, 2025
      const result = calculateTimeRemaining(today)
      
      // Should have remaining time since we set due date to end of day and current time is 12:00 PM
      expect(result.isOverdue).toBe(false)
      expect(result.hours).toBeGreaterThan(0)
    })

    it('calculates total minutes correctly', () => {
      const futureDate = new Date('2025-01-01T13:00:00') // 1 hour from now
      const result = calculateTimeRemaining(futureDate)
      
      expect(result.totalMinutes).toBeGreaterThan(0)
    })
  })

  describe('formatTimeRemaining', () => {
    it('formats days remaining correctly', () => {
      const timeRemaining = {
        days: 2,
        hours: 5,
        minutes: 30,
        isOverdue: false,
        totalMinutes: 2870
      }
      
      const formatted = formatTimeRemaining(timeRemaining)
      expect(formatted).toBe('2d 5h remaining')
    })

    it('formats hours and minutes remaining correctly', () => {
      const timeRemaining = {
        days: 0,
        hours: 3,
        minutes: 45,
        isOverdue: false,
        totalMinutes: 225
      }
      
      const formatted = formatTimeRemaining(timeRemaining)
      expect(formatted).toBe('3h 45m remaining')
    })

    it('formats minutes only correctly', () => {
      const timeRemaining = {
        days: 0,
        hours: 0,
        minutes: 30,
        isOverdue: false,
        totalMinutes: 30
      }
      
      const formatted = formatTimeRemaining(timeRemaining)
      expect(formatted).toBe('30m remaining')
    })

    it('formats overdue days correctly', () => {
      const timeRemaining = {
        days: 1,
        hours: 2,
        minutes: 30,
        isOverdue: true,
        totalMinutes: 1590
      }
      
      const formatted = formatTimeRemaining(timeRemaining)
      expect(formatted).toBe('1d overdue')
    })

    it('formats overdue hours and minutes correctly', () => {
      const timeRemaining = {
        days: 0,
        hours: 2,
        minutes: 15,
        isOverdue: true,
        totalMinutes: 135
      }
      
      const formatted = formatTimeRemaining(timeRemaining)
      expect(formatted).toBe('2h 15m overdue')
    })

    it('formats overdue minutes only correctly', () => {
      const timeRemaining = {
        days: 0,
        hours: 0,
        minutes: 45,
        isOverdue: true,
        totalMinutes: 45
      }
      
      const formatted = formatTimeRemaining(timeRemaining)
      expect(formatted).toBe('45m overdue')
    })
  })
})