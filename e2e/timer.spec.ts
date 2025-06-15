import { test, expect } from '@playwright/test'

test('timer page', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Tabata Timer/)

  // Expect the page to contain the timer component
  await expect(page.getByTestId('timer-container')).toBeVisible()
  await expect(page.getByText('prepare', { exact: false })).toBeVisible()

  // Expect the control buttons to be visible
  await expect(page.getByRole('button', { name: /start/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /pause/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /reset/i })).toBeVisible()
})
