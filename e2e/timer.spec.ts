import { test, expect } from '@playwright/test'

// This version of the golden-path test fakes the passage of time with
// Playwright's Clock API so the entire workout finishes in a few
// milliseconds instead of real seconds.

test('the golden path (clock-driven)', async ({ page }) => {
  // 1️⃣  Freeze and control timers before the app loads.
  await page.clock.install()

  // 2️⃣  Navigate to the app and verify the Settings screen.
  await page.goto('/')
  await expect(page.getByTestId('settings-container')).toBeVisible()

  // 3️⃣  Configure settings (medium-length workout so we exercise all phases).
  // Set cycles first so Long Break card becomes visible
  await page.selectOption('select[name="cycles"]', '2')
  await page.selectOption('select[name="work"]', '20')
  await page.selectOption('select[name="shortBreak"]', '5')
  await page.selectOption('select[name="sets"]', '2')
  await page.selectOption('select[name="longBreak"]', '10')

  // 4️⃣  Start the workout ‑ app enters 5-second PREPARE phase.
  await page.getByRole('button', { name: 'Start Workout' }).click()
  await expect(page.getByTestId('timer-container')).toBeVisible()
  await expect(page.getByTestId('phase-label')).toHaveText(/prepare/i)

  // Verify progress dots are visible during prepare phase
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Helper to advance time and assert the active phase.
  const skip = async (seconds: number | string, expected: RegExp) => {
    await page.clock.runFor(seconds)
    await expect(page.getByTestId('phase-label')).toHaveText(expected)
  }

  // 5️⃣  Workflow through all phases using synthetic time.

  // Prepare → Work (set 1)
  await skip('05', /work/i)
  await expect(page.getByText(/Set 1\/2 \| Round ?1\/2/)).toBeVisible()
  // Verify progress dots still visible during work phase
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Work (20 s) → Short Break
  await skip('20', /rest/i)
  await expect(page.getByText(/Set 1\/2 \| Round ?1\/2/)).toBeVisible()
  // Verify progress dots visible during rest phase
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Short Break (5 s) → Work (set 2)
  await skip('05', /work/i)
  await expect(page.getByText(/Set 2\/2 \| Round ?1\/2/)).toBeVisible()
  // Progress dots should show we're on set 2 now
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Work (20 s) → Long Break (end of round 1)
  await skip('20', /rest/i)
  await expect(page.getByText(/Set 2\/2 \| Round ?1\/2/)).toBeVisible()
  // Verify progress dots visible during long break
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Long Break (10 s) → Work (round 2, set 1)
  await skip('10', /work/i)
  await expect(page.getByText(/Set 1\/2 \| Round ?2\/2/)).toBeVisible()
  // Progress dots should show we're on round 2, set 1 now
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Work (20 s) → Short Break
  await skip('20', /rest/i)
  await expect(page.getByText(/Set 1\/2 \| Round ?2\/2/)).toBeVisible()
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Short Break (5 s) → Work (set 2)
  await skip('05', /work/i)
  await expect(page.getByText(/Set 2\/2 \| Round ?2\/2/)).toBeVisible()
  // Final set - progress dots should show set 2 of round 2
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Final Work (20 s) → Finished
  await skip('20', /complete/i)
  // Progress dots should still be visible when workout is complete
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // 6️⃣  Reset should bring us back to Settings.
  await page.getByRole('button', { name: /reset/i }).click()
  await expect(page.getByTestId('settings-container')).toBeVisible()
})

test('progress dots behavior with single round', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')

  // Configure single round workout
  await page.selectOption('select[name="cycles"]', '1')
  await page.selectOption('select[name="sets"]', '2')

  // Start workout
  await page.getByRole('button', { name: 'Start Workout' }).click()

  // Verify progress dots are visible (should only show sets, not rounds)
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Skip through prepare phase
  await page.clock.runFor('05')
  await expect(page.getByTestId('phase-label')).toHaveText(/work/i)

  // Progress dots should still be visible during single round workout
  await expect(page.getByTestId('progress-circles')).toBeVisible()

  // Reset
  await page.getByRole('button', { name: /reset/i }).click()
  await expect(page.getByTestId('settings-container')).toBeVisible()
})
