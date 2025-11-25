import { chromium } from 'playwright';
import { config, validateConfig } from './config';
import { login } from './auth';
import { updateProfile } from './profile';

(async () => {
  try {
    validateConfig();

    const browser = await chromium.launch({ 
      headless: false,
      channel: 'chrome',
      args: ['--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      if (config.email && config.password) {
          await login(page, config.email, config.password);
          await updateProfile(page);
      }
    } catch (error) {
      console.error('An error occurred during execution:', error);
      await page.screenshot({ path: 'error.png' });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Configuration error:', error);
    process.exit(1);
  }
})();
