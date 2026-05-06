import puppeteer from 'puppeteer';

const BASE = 'http://localhost:3001';

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function captureView(browser, filename, viewName, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport || { width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(300);

  // Switch view programmatically
  await page.evaluate((v) => {
    if (typeof switchView === 'function') switchView(v);
  }, viewName);
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
  await captureView(browser, 'screenshot_cranes_desktop.png', 'cranes');

  // Jib Crane
  await captureView(browser, 'screenshot_jib_crane_desktop.png', 'jib-crane');

  // Overhead Travelling Crane
  await captureView(browser, 'screenshot_overhead_crane_desktop.png', 'overhead-travelling-crane');

  // Services
  await captureView(browser, 'screenshot_services_desktop.png', 'services');

  // Hoists
  await captureView(browser, 'screenshot_hoists_desktop.png', 'hoists');

  // Contact
  await captureView(browser, 'screenshot_contact_desktop.png', 'contact');

  // About
  await captureView(browser, 'screenshot_about_desktop.png', 'about');

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
  await cranesMobile.click('#hamburgerBtn');
  await delay(400);
  await cranesMobile.click('[data-mobile-nav="cranes"]');
  await delay(600);
  await cranesMobile.screenshot({ path: 'screenshot_cranes_mobile.png', fullPage: true });
  await cranesMobile.close();
  console.log('Screenshot: screenshot_cranes_mobile.png');

  // Jib Crane mobile
  await captureView(browser, 'screenshot_jib_crane_mobile.png', 'jib-crane', { width: 375, height: 812 });

  // Overhead Travelling Crane mobile
  await captureView(browser, 'screenshot_overhead_crane_mobile.png', 'overhead-travelling-crane', { width: 375, height: 812 });

  await browser.close();
  console.log('All screenshots done');
})();
