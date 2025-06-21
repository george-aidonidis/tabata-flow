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
  await page.selectOption('select[name="work"]', '20')
  await page.selectOption('select[name="shortBreak"]', '5')
  await page.selectOption('select[name="sets"]', '2')
  await page.selectOption('select[name="longBreak"]', '10')
  await page.selectOption('select[name="cycles"]', '2')

  // 4️⃣  Start the workout ‑ app enters 5-second PREPARE phase.
  await page.getByRole('button', { name: 'Start Workout' }).click()
  await expect(page.getByTestId('timer-container')).toBeVisible()
  await expect(page.getByTestId('phase-label')).toHaveText(/prepare/i)

  // Helper to advance time and assert the active phase.
  const skip = async (seconds: number | string, expected: RegExp) => {
    await page.clock.runFor(seconds)
    await expect(page.getByTestId('phase-label')).toHaveText(expected)
  }

  // 5️⃣  Workflow through all phases using synthetic time.

  // Prepare → Work (set 1)
  await skip('05', /work/i)
  await expect(page.getByText(/Set 1\/2 \| Round ?1\/2/)).toBeVisible()

  // Work (20 s) → Short Break
  await skip('20', /rest/i)
  await expect(page.getByText(/Set 1\/2 \| Round ?1\/2/)).toBeVisible()

  // Short Break (5 s) → Work (set 2)
  await skip('05', /work/i)
  await expect(page.getByText(/Set 2\/2 \| Round ?1\/2/)).toBeVisible()

  // Work (20 s) → Long Break (end of cycle 1)
  await skip('20', /rest/i)
  await expect(page.getByText(/Set 2\/2 \| Round ?1\/2/)).toBeVisible()

  // Long Break (10 s) → Work (cycle 2, set 1)
  await skip('10', /work/i)
  await expect(page.getByText(/Set 1\/2 \| Round ?2\/2/)).toBeVisible()

  // Work (20 s) → Short Break
  await skip('20', /rest/i)
  await expect(page.getByText(/Set 1\/2 \| Round ?2\/2/)).toBeVisible()

  // Short Break (5 s) → Work (set 2)
  await skip('05', /work/i)
  await expect(page.getByText(/Set 2\/2 \| Round ?2\/2/)).toBeVisible()

  // Final Work (20 s) → Finished
  await skip('20', /complete/i)

  // 6️⃣  Reset should bring us back to Settings.
  await page.getByRole('button', { name: /reset/i }).click()
  await expect(page.getByTestId('settings-container')).toBeVisible()
})
