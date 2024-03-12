const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:8080');
});

test('check that searched city appears on Enter', async ({ page }) => {
  let cityInput = page.locator('#city-input');
  await cityInput.fill('Åre');
  await cityInput.press('Enter');

  let historyBox = await page.locator('.history-box');
  
  await expect(historyBox).toContainText('Åre');
});

test('check that searched city appears on button click', async ({ page }) => {
  let cityInput = page.locator('#city-input');
  await cityInput.fill('New York');
  await page.click('#search-button');

  let expectedCity = 'New York';
  let actualCity = await cityInput.inputValue();

  await expect(actualCity).toBe(expectedCity);
});

test('Wrong city input alert', async ({ page }) => {
  let dialogEvent = page.waitForEvent('dialog');

  let cityInput = page.locator('#city-input');
  await cityInput.fill('abcde');
  await cityInput.press('Enter');

  let alertMessage = await dialogEvent;

  expect(alertMessage.message()).toContain('Error: 404, city not found \nPlease try again!');
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

test('Displaying forecast at click on city in history box, and if a specific element is showing Max temp text', async ({ page }) => {
  let cityInput = page.locator('#city-input');
  await cityInput.fill('Kalmar');
  await cityInput.press('Enter');

  let historyBox = await page.locator('.history-box');
  await historyBox.click();

  let forecast = await page.locator('.forecast-list');
  let maxTempIndicator = await page.locator('.forecast-maxtemp').filter((element) => element.innerText().includes('Max:')).nth(5);

  await expect(forecast).toBeVisible();
  await expect(maxTempIndicator).toBeVisible();
  await expect(await maxTempIndicator.innerText()).toContain('Max');
});