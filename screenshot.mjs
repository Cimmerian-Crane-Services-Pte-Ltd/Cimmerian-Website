import puppeteer from 'puppeteer';

const BASE = 'http://localhost:3000';

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function switchViewAndScreenshot(browser, filename, clickSelector, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport || { width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(300);

  // Click the nav link to switch view
  await page.click(clickSelector);
  await delay(600);

  await page.screenshot({ path: filename, fullPage: true });
  await page.close();
  console.log(`Screenshot: ${filename}`);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  console.log('--- Desktop Screenshots ---');

  // Home (default)
  const homePage = await browser.newPage();
  await homePage.setViewport({ width: 1440, height: 900 });
  await homePage.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(500);
  await homePage.screenshot({ path: 'screenshot_home_desktop.png', fullPage: true });
  await homePage.close();
  console.log('Screenshot: screenshot_home_desktop.png');

  // Cranes
  await switchViewAndScreenshot(browser, 'screenshot_cranes_desktop.png', '[data-nav="cranes"]');

  // Services
  await switchViewAndScreenshot(browser, 'screenshot_services_desktop.png', '[data-nav="services"]');

  // Hoists
  await switchViewAndScreenshot(browser, 'screenshot_hoists_desktop.png', '[data-nav="hoists"]');

  // Contact
  await switchViewAndScreenshot(browser, 'screenshot_contact_desktop.png', '[data-nav="contact"]');

  // About
  await switchViewAndScreenshot(browser, 'screenshot_about_desktop.png', '[data-nav="about"]');

  console.log('--- Mobile Screenshots ---');

  // Home mobile
  const homeMobile = await browser.newPage();
  await homeMobile.setViewport({ width: 375, height: 812 });
  await homeMobile.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(500);
  await homeMobile.screenshot({ path: 'screenshot_home_mobile.png', fullPage: true });
  await homeMobile.close();
  console.log('Screenshot: screenshot_home_mobile.png');

  // Cranes mobile
  const cranesMobile = await browser.newPage();
  await cranesMobile.setViewport({ width: 375, height: 812 });
  await cranesMobile.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(300);
  // Open hamburger menu on mobile
  await cranesMobile.click('#hamburgerBtn');
  await delay(400);
  // Click mobile nav link
  await cranesMobile.click('[data-mobile-nav="cranes"]');
  await delay(600);
  await cranesMobile.screenshot({ path: 'screenshot_cranes_mobile.png', fullPage: true });
  await cranesMobile.close();
  console.log('Screenshot: screenshot_cranes_mobile.png');

  await browser.close();
  console.log('All screenshots done');
})();
