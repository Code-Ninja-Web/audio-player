import { describe, expect, it } from 'vitest'
import { areEqual } from '../are-equal'

describe('areEqual', () => {
  it('returns true for equal ids with different primitive types', () => {
    expect(areEqual('42', 42)).toBe(true)
  })

  it('returns false for nullish ids', () => {
    expect(areEqual(null, '1')).toBe(false)
    expect(areEqual('1', undefined)).toBe(false)
  })

  it('returns false for different values', () => {
    expect(areEqual('a', 'b')).toBe(false)
  })
})
