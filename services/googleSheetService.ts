import { WishSubmission } from '../types';

/**
 * GOOGLE SHEETS INTEGRATION INSTRUCTIONS:
 * 
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste the following code into the script editor (Code.gs):
 * 
 *    function doPost(e) {
 *      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *      var data = JSON.parse(e.postData.contents);
 *      if (sheet.getLastRow() === 0) {
 *         sheet.appendRow(["Timestamp", "Name", "Contact Number", "Message"]);
 *      }
 *      sheet.appendRow([new Date(), data.name, data.contactNumber, data.message]);
 *      return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' })).setMimeType(ContentService.MimeType.JSON);
 *    }
 * 
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set "Execute as": "Me".
 * 7. Set "Who has access": "Anyone".
 * 8. Click "Deploy" and copy the "Web App URL".
 * 9. Paste the URL below into the SCRIPT_URL constant.
 */

// REPLACE THIS URL WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxRK3RxjCek-cxj2LmB2EwHZK9nWP3_XcOGdb5T9NKmlXaFu7ndn-EZuERE4RXzQeqmqg/exec'; 

export const submitToGoogleSheet = async (data: WishSubmission): Promise<boolean> => {
  // Check if the user hasn't set up the sheet yet
  if (SCRIPT_URL.includes('PLACEHOLDER')) {
    console.group('🚧 Google Sheets Setup Required 🚧');
    console.log('Data collection is currently in DEMO MODE.');
    console.log('To save data to a real sheet, follow the instructions in services/googleSheetService.ts');
    console.log('Captured Data:', data);
    console.groupEnd();
    
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true; 
  }

  try {
    // We use 'no-cors' because Google Apps Script redirects don't support CORS preflight perfectly in all browsers
    // without complex setup. 'no-cors' allows the request to go through (fire and forget style) 
    // even if we can't read the response directly in strict browser environments.
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return true;
  } catch (error) {
    console.error("Error submitting to Google Sheet:", error);
    // Even if it fails, we typically want the user flow to continue in a kiosk setting,
    // but logging the error is important.
    return false;
  }
};