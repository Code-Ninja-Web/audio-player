import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.stubEnv('VITE_RESTDB_API_KEY', 'test-key')
vi.stubEnv('VITE_RESTDB_BASE_URL', 'https://example.com/rest')
vi.stubEnv('VITE_RESTDB_COLLECTION', 'air-channels')

global.fetch = vi.fn().mockResolvedValue({
    json: async () => [],
}) as unknown as typeof fetch

window.resizeTo = vi.fn()
