import { test, expect } from '@playwright/test';

test('homepage renders editorial hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /your beauty/i })).toBeVisible();
});
