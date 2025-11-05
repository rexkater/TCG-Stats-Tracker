import { test, expect } from '@playwright/test';

test.describe('Export and Import', () => {
  test('should have export button on project page', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on first project
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    
    // Check for export button
    await expect(page.getByRole('link', { name: /📥 export csv/i })).toBeVisible();
  });

  test('should have import button on project page', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on first project
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    
    // Check for import button
    await expect(page.getByRole('link', { name: /📤 import csv/i })).toBeVisible();
  });

  test('should navigate to import page', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to import page
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /📤 import csv/i }).click();
    
    // Should be on import page
    await expect(page).toHaveURL(/\/projects\/[a-z0-9]+\/import/);
    await expect(page.locator('h1')).toContainText('Import Entries from CSV');
  });

  test('should display import form with file input', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to import page
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /📤 import csv/i }).click();
    
    // Check for file input
    await expect(page.locator('input[type="file"]')).toBeVisible();
    
    // Check for format requirements
    await expect(page.getByText(/csv format requirements/i)).toBeVisible();
    
    // Check for submit button
    await expect(page.getByRole('button', { name: /import entries/i })).toBeVisible();
  });

  test('should display CSV format requirements', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to import page
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /📤 import csv/i }).click();
    
    // Check for required columns documentation
    await expect(page.getByText(/my deck/i)).toBeVisible();
    await expect(page.getByText(/opponent deck/i)).toBeVisible();
    await expect(page.getByText(/category/i)).toBeVisible();
    await expect(page.getByText(/initiative/i)).toBeVisible();
    await expect(page.getByText(/result/i)).toBeVisible();
  });
});

