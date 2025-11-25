import { Page } from 'playwright';

export async function login(page: Page, email: string, password: string): Promise<void> {
  console.log('Navigating to Naukri login page...');
  await page.goto('https://www.naukri.com/');

  console.log('Clicking "Login" button on navbar...');
  await page.click('#login_Layer');

  console.log('Clicking "Login with Google"...');
  const googleLoginButton = page.locator('.social-login-btn.google-login, button:has-text("Google"), .google-icon');
  await googleLoginButton.first().click();

  console.log('Handling Google Login Popup...');
  const popupPromise = page.waitForEvent('popup');
  const popup = await popupPromise;
  
  await popup.waitForLoadState();
  
  console.log('Entering Google Email...');
  await popup.fill('input[type="email"]', email);
  await popup.click('#identifierNext');

  console.log('Entering Google Password...');
  // Target the password field by name "Passwd" which is standard for Google, 
  // or ensure we are getting the visible one.
  const passwordInput = popup.locator('input[name="Passwd"]');
  await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  await passwordInput.fill(password);
  await popup.click('#passwordNext');

  console.log('Waiting for login to complete...');
  await popup.waitForEvent('close');

  await page.waitForURL('**/mnjuser/homepage', { timeout: 60000 });
  console.log('Login successful!');
}
