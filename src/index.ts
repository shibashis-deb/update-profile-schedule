import { chromium } from 'playwright';
import { config, validateConfig } from './config';
import { login } from './auth';
import { updateProfile } from './profile';

(async () => {
  try {
    validateConfig();

    const isProduction = process.env.NODE_ENV === 'production';
    
    const browser = await chromium.launch({ 
      headless: isProduction ? true : false,
      channel: isProduction ? undefined : 'chrome', // Use bundled chromium in prod, local chrome in dev
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox', 
        '--disable-setuid-sandbox'
      ]
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
