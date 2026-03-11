import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  // Try some ports
  const ports = [5178, 5176, 5175, 5173, 5174, 5177];
  let loaded = false;
  
  for (const port of ports) {
    try {
      console.log(`Trying port ${port}...`);
      await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0', timeout: 5000 });
      console.log(`Successfully loaded port ${port}`);
      loaded = true;
      break;
    } catch (e) {
      console.log(`Port ${port} failed.`);
    }
  }

  if (!loaded) {
    console.log('Could not connect to any port.');
  }

  await browser.close();
})();
