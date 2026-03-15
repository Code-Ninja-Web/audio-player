import { describe, expect, it } from 'vitest'
import { buildHomeLink } from '../routes'

describe('buildHomeLink', () => {
  it('returns root path without channel', () => {
    expect(buildHomeLink()).toBe('/')
  })

  it('builds channel deep link', () => {
    expect(buildHomeLink('abc123')).toBe('/?channelId=abc123')
  })
})
