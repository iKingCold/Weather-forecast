const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:8080');
});

test('check that searched city appears', async ({ page }) => {
  let cityInput = page.locator('#city-input');
  await cityInput.fill('Åre');
  await cityInput.press('Enter');
  await expect(page.locator('.history-city', { text: 'Åre' })).toBeVisible();
});

test('Wrong city input alert', async ({ page }) => {
  let dialogEvent = page.waitForEvent('dialog');

  let cityInput = page.locator('#city-input');
  await cityInput.fill('abcde');
  await cityInput.press('Enter');

  let alertMessage = await dialogEvent;

  expect(alertMessage.message()).toContain('Error: 404, city not found \nPlease try again!');
  // expect(alertMessage).toBeTruthy();
});

test('Empty input alert', async ({ page }) => {
  let dialogEvent = page.waitForEvent('dialog');

  let cityInput = page.locator('#city-input');
  await cityInput.fill('');
  await cityInput.press('Enter');

  let alertMessage = await dialogEvent;

  expect(alertMessage.message()).toContain('Error: 400, Nothing to geocode \nPlease try again!');
});
