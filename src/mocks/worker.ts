import { vi } from 'vitest'

class MockWorker {
  onmessage: (e: { data: unknown }) => void = () => {}
  postMessage(data: unknown) {
    // For simplicity, we can just echo back the message
    // or simulate a 'tick' for the timer test.
    if (data === 'start') {
      // we can simulate a tick
      // but for this test, it is not needed
    }
  }
  terminate() {
    // no-op
  }
}

Object.defineProperty(self, 'Worker', {
  writable: true,
  value: vi.fn().mockImplementation(() => new MockWorker()),
})
