import { test, expect } from '@playwright/test';

test.describe('Projects', () => {
  test('should display projects list', async ({ page }) => {
    await page.goto('/projects');
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Projects');
    
    // Check for "New Project" button
    await expect(page.getByRole('link', { name: /new project/i })).toBeVisible();
  });

  test('should navigate to project detail page', async ({ page }) => {
    await page.goto('/projects');
    
    // Find and click on a project card
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    
    // Should navigate to project detail page
    await expect(page).toHaveURL(/\/projects\/[a-z0-9]+/);
    
    // Check for key elements on project page
    await expect(page.getByRole('link', { name: /back to projects/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /new entry/i })).toBeVisible();
  });

  test('should display project statistics', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on first project
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    
    // Check for stats sections
    await expect(page.getByText(/total entries/i)).toBeVisible();
    await expect(page.getByText(/overall win rate/i)).toBeVisible();
  });
});

