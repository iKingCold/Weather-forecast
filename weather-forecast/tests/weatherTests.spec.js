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

test('Check local storage', async ({ page }) => {
  let cityInput = page.locator('#city-input');
  cityInput.fill('Göteborg');
  cityInput.press('Enter');

  await page.waitForSelector('.history-box');

  cityInput.fill('Mellerud');
  cityInput.press('Enter');

  await page.waitForSelector('.history-box');

  cityInput.fill('Kungälv');
  cityInput.press('Enter');

  await page.waitForSelector('.history-box');

  await page.waitForTimeout(500);

  let storedCities = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('searchHistory'));
  });

  expect(storedCities[0].city).toBe('Kungälv');
  expect(storedCities[1].city).toBe('Mellerud');
  expect(storedCities[2].city).toBe('Gothenburg');
});
