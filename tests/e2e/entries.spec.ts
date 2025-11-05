import { test, expect } from '@playwright/test';

test.describe('Entries', () => {
  test('should navigate to new entry form', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on first project
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    
    // Click "New Entry" button
    await page.getByRole('link', { name: /new entry/i }).click();
    
    // Should be on new entry page
    await expect(page).toHaveURL(/\/projects\/[a-z0-9]+\/entries\/new/);
    await expect(page.locator('h1')).toContainText('New Entry');
  });

  test('should display entry form with required fields', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to new entry form
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /new entry/i }).click();
    
    // Check for required form fields
    await expect(page.getByLabel(/my deck/i)).toBeVisible();
    await expect(page.getByLabel(/opponent deck/i)).toBeVisible();
    await expect(page.getByLabel(/category/i)).toBeVisible();
    await expect(page.getByLabel(/initiative/i)).toBeVisible();
    await expect(page.getByLabel(/result/i)).toBeVisible();
    
    // Check for submit button
    await expect(page.getByRole('button', { name: /save entry/i })).toBeVisible();
  });

  test('should create a new entry', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to new entry form
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    const projectUrl = page.url();
    await page.getByRole('link', { name: /new entry/i }).click();
    
    // Fill out the form
    await page.selectOption('select[name="myDeckId"]', { index: 1 });
    await page.selectOption('select[name="oppDeckId"]', { index: 2 });
    await page.selectOption('select[name="categoryId"]', { index: 1 });
    await page.selectOption('select[name="initiative"]', 'FIRST');
    await page.selectOption('select[name="result"]', 'WIN');
    
    // Submit the form
    await page.getByRole('button', { name: /save entry/i }).click();
    
    // Should redirect back to project page
    await expect(page).toHaveURL(projectUrl);
  });
});

