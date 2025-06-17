import { test, expect } from '@playwright/test'

test('the golden path', async ({ page }) => {
  await page.goto('/')

  // 1. Assert the Settings screen is visible.
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

  // 2. Configure new values for all settings.
  await page.getByLabel('Prepare (s)').fill('5')
  await page.getByLabel('Work (s)').fill('10')
  await page.getByLabel('Rest (s)').fill('5')
  await page.getByLabel('Rounds').fill('2')

  // 3. Click "Start Workout" and assert the Timer screen appears in the "Prepare" phase.
  await page.getByRole('button', { name: 'Start Workout' }).click()
  await expect(page.getByTestId('timer-container')).toBeVisible()
  await expect(page.getByText(/prepare/i)).toBeVisible()

  // Wait for the prepare phase to end and the work phase to begin.
  // We'll also check for the color change here (FR-8)
  const progressRing = page.locator('circle').nth(1)
  await expect(progressRing).toHaveAttribute('stroke', '#F5A623') // Orange for prepare
  await expect(page.getByText(/work/i)).toBeVisible({ timeout: 7000 })
  await expect(progressRing).toHaveAttribute('stroke', '#E53E3E') // Red for work

  // 5. Click "Pause" and assert the timer stops.
  await page.getByRole('button', { name: /pause/i }).click()
  const timeWhenPaused = await page.getByTestId('time-display').textContent()
  await page.waitForTimeout(2000) // wait 2 seconds
  const timeAfterPaused = await page.getByTestId('time-display').textContent()
  expect(timeWhenPaused).toBe(timeAfterPaused)

  // 6. Click "Resume" and assert the timer continues.
  await page.getByRole('button', { name: /resume/i }).click()
  await page.waitForTimeout(2000)
  const timeAfterResumed = await page.getByTestId('time-display').textContent()
  expect(timeAfterPaused).not.toBe(timeAfterResumed)

  // 7. Click "Reset" and assert the application returns to the Settings screen.
  await page.getByRole('button', { name: /reset/i }).click()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
})
