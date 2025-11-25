import { Page } from 'playwright';

export async function updateProfile(page: Page): Promise<void> {
  console.log('Navigating to profile...');
  await page.goto('https://www.naukri.com/mnjuser/profile');

  // Wait for the DOM to be ready (networkidle can be too strict)
  await page.waitForLoadState('domcontentloaded');

  // Scroll down the page incrementally to trigger lazy loading
  console.log('Scrolling down to trigger lazy loading...');
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < 6; i++) {
      window.scrollBy(0, 500);
      await delay(500);
    }
  });
  await page.waitForTimeout(1000); // Wait for content to render

  console.log('Locating Profile Summary section...');
  // Use a filtered locator strategy which is often more robust
  // We look for a widget header that contains the text "Profile summary"
  const editButton = page.locator('.widgetHead')
    .filter({ hasText: 'Profile summary' })
    .locator('.edit.icon')
    .first();
  
  // We can try to scroll to the element itself, or just scroll down a bit
  await editButton.scrollIntoViewIfNeeded();
  
  await editButton.waitFor({ state: 'visible', timeout: 10000 });
  await editButton.click();

  console.log('Waiting for Profile Summary modal...');
  // Wait for the textarea to be visible. We use multiple selectors to be safe.
  const textarea = page.locator('textarea#profileSummaryTxt')
    .or(page.locator('textarea[placeholder*="summary"]'))
    .or(page.locator('.modal textarea'))
    .or(page.locator('.lightbox textarea'))
    .first();
    
  await textarea.waitFor({ state: 'visible', timeout: 10000 });
  let currentSummary = await textarea.inputValue();
  
  // Trim whitespace to ensure accurate check
  currentSummary = currentSummary.trim();
  console.log(`Current summary length (trimmed): ${currentSummary.length}`);

  let newSummary = '';
  if (currentSummary.endsWith('.')) {
    console.log('Action: Removing trailing dot from Profile Summary...');
    newSummary = currentSummary.slice(0, -1);
  } else {
    console.log('Action: Adding trailing dot to Profile Summary...');
    newSummary = currentSummary + '.';
  }

  await textarea.fill(newSummary);

  console.log('Saving changes...');
  // Give a short delay for the UI to register the change and enable the Save button
  await page.waitForTimeout(1000);

  // The previous selector found a hidden "Save photo" button. 
  // We need to be very specific: visible button with exact text "Save" inside the lightbox/modal
  const saveButton = page.locator('.lightbox button, .modal button')
    .filter({ hasText: /^Save$/ }) // Exact match to avoid "Save photo"
    .first();
  
  // Ensure it's visible and enabled
  await saveButton.waitFor({ state: 'visible', timeout: 5000 });
  await saveButton.click();

  // Wait for save to complete
  await textarea.waitFor({ state: 'hidden' });
  
  console.log('Profile updated successfully!');
}
