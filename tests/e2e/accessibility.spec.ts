import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home page should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('projects page should not have accessibility violations', async ({ page }) => {
    await page.goto('/projects');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('project detail page should not have accessibility violations', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on first project
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('new entry form should not have accessibility violations', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to new entry form
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /new entry/i }).click();
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('notes page should not have accessibility violations', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to notes page
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /📝 notes/i }).click();
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('import page should not have accessibility violations', async ({ page }) => {
    await page.goto('/projects');
    
    // Navigate to import page
    const projectCard = page.locator('.bg-white').first();
    await projectCard.click();
    await page.getByRole('link', { name: /📤 import csv/i }).click();
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/');
    
    // Focus on the page
    await page.keyboard.press('Tab');
    
    // Check if skip link is focused
    const skipLink = page.getByText(/skip to main content/i);
    await expect(skipLink).toBeFocused();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/projects');
    
    // Tab through the page
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First focusable element
    
    // Check that focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});

