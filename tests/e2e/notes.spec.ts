import { test, expect } from '@playwright/test';

test.describe('Matchup Notes', () => {
  test('should navigate to notes page', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on first project
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    
    // Click "Notes" button
    await page.getByRole('link', { name: /📝 notes/i }).click();
    
    // Should be on notes page
    await expect(page).toHaveURL(/\/projects\/[a-z0-9]+\/notes$/);
    await expect(page.locator('h1')).toContainText('Matchup Notes');
  });

  test('should display notes list with search', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to notes page
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /📝 notes/i }).click();
    
    // Check for search input
    await expect(page.getByPlaceholder(/search notes/i)).toBeVisible();
    
    // Check for "New Note" button
    await expect(page.getByRole('link', { name: /new note/i })).toBeVisible();
  });

  test('should navigate to new note form', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to new note form
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /📝 notes/i }).click();
    await page.getByRole('link', { name: /new note/i }).click();
    
    // Should be on new note page
    await expect(page).toHaveURL(/\/projects\/[a-z0-9]+\/notes\/new/);
    await expect(page.locator('h1')).toContainText('New Matchup Note');
  });

  test('should display note form with required fields', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to new note form
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /📝 notes/i }).click();
    await page.getByRole('link', { name: /new note/i }).click();
    
    // Check for required form fields
    await expect(page.getByLabel(/deck a/i)).toBeVisible();
    await expect(page.getByLabel(/deck b/i)).toBeVisible();
    await expect(page.getByLabel(/content/i)).toBeVisible();
    
    // Check for submit button
    await expect(page.getByRole('button', { name: /save note/i })).toBeVisible();
  });
});

