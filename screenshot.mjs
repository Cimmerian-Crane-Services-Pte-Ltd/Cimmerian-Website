import puppeteer from 'puppeteer';

const BASE = 'http://localhost:3001';

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function capturePage(browser, filename, path) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(500);

  // Scroll through the page to trigger AOS animations
  await page.evaluate(async () => {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const scrollDistance = 400;
    const totalHeight = document.body.scrollHeight;
    let currentScroll = 0;

    while (currentScroll < totalHeight) {
      window.scrollTo(0, currentScroll);
      await delay(100);
      currentScroll += scrollDistance;
    }

    // Scroll back to top
    window.scrollTo(0, 0);
    await delay(500);
  });

  await page.screenshot({ path: filename, fullPage: true });
  await page.close();
  console.log(`Desktop Screenshot: ${filename}`);
}

async function captureMobilePage(browser, filename, path) {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(500);

  // Scroll through the page to trigger AOS animations
  await page.evaluate(async () => {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const scrollDistance = 300;
    const totalHeight = document.body.scrollHeight;
    let currentScroll = 0;

    while (currentScroll < totalHeight) {
      window.scrollTo(0, currentScroll);
      await delay(100);
      currentScroll += scrollDistance;
    }

    // Scroll back to top
    window.scrollTo(0, 0);
    await delay(500);
  });

  await page.screenshot({ path: filename, fullPage: true });
  await page.close();
  console.log(`Mobile Screenshot: ${filename}`);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  console.log('--- Desktop Screenshots ---');
  await capturePage(browser, 'screenshot_home_desktop.png', '/');
  await capturePage(browser, 'screenshot_cranes_desktop.png', '/cranes.html');
  await capturePage(browser, 'screenshot_hoists_desktop.png', '/hoists.html');
  await capturePage(browser, 'screenshot_projects_desktop.png', '/projects.html');
  await capturePage(browser, 'screenshot_about_desktop.png', '/about.html');
  await capturePage(browser, 'screenshot_contact_desktop.png', '/contact.html');

  console.log('--- Mobile Screenshots ---');
  await captureMobilePage(browser, 'screenshot_home_mobile.png', '/');
  await captureMobilePage(browser, 'screenshot_cranes_mobile.png', '/cranes.html');
  await captureMobilePage(browser, 'screenshot_hoists_mobile.png', '/hoists.html');
  await captureMobilePage(browser, 'screenshot_projects_mobile.png', '/projects.html');
  await captureMobilePage(browser, 'screenshot_about_mobile.png', '/about.html');
  await captureMobilePage(browser, 'screenshot_contact_mobile.png', '/contact.html');

  await browser.close();
  console.log('All screenshots done');
})();
