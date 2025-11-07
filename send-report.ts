import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const SUMMARY_JSON_PATH = path.join(process.cwd(), 'test-summary.json');
const DEPLOY_OUTPUT_PATH = path.join(process.cwd(), 'deploy-output.json');

// --- Email Configuration ---
const GMAIL_ADDRESS = 'faizkhancodeautomation@gmail.com';
const RECIPIENT_ADDRESSES = [
    'faizrehman561@gmail.com',
    'saad@codeautomation.ai',
    'farhan.ghffar@gmail.com'
];
const PROJECT_NAME = 'Swag Labs Test Automation';
// -------------------------

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  try {
    const token = fs.readFileSync(TOKEN_PATH, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    console.error('Error loading token file:', err);
    throw new Error('Could not load token.json. Ensure you have authorized the script locally.');
  }
}

function createHtmlReport(): string {
  let deployUrl = '';
  try {
    if (fs.existsSync(DEPLOY_OUTPUT_PATH)) {
      deployUrl = JSON.parse(fs.readFileSync(DEPLOY_OUTPUT_PATH, 'utf8')).deploy_url;
    }
  } catch (error) { console.log('Could not read deploy URL.'); }

  if (!fs.existsSync(SUMMARY_JSON_PATH)) {
    return `<h1>Test Summary Not Available</h1>`;
  }
  const summary = JSON.parse(fs.readFileSync(SUMMARY_JSON_PATH, 'utf8'));

  let totalTests = 0, passedTests = 0, failedTests = 0, skippedTests = 0;
  let suitesHtml = '';
  const timestamp = new Date().toUTCString();

  for (const suiteName in summary) {
    const tests = summary[suiteName];
    if (tests.length === 0) continue;
    let testsHtml = '';
    for (const test of tests) {
      totalTests++;
      let statusIcon = '';
      switch (test.status) {
        case 'passed': passedTests++; statusIcon = '✅'; break;
        case 'failed': failedTests++; statusIcon = '❌'; break;
        case 'skipped': skippedTests++; statusIcon = '➖'; break;
      }
      testsHtml += `<tr>
                      <td style="padding: 10px 5px; text-align: left; border-bottom: 1px solid #eeeeee; font-weight: 500;">${test.name}</td>
                      <td style="padding: 10px 5px; text-align: right; font-size: 18px; border-bottom: 1px solid #eeeeee;">${statusIcon}</td>
                    </tr>`;
    }
    suitesHtml += `<div style="background-color: #ffffff; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 0 25px 15px 25px;">
                     <h2 style="margin: 0; padding: 25px 0; border-bottom: 1px solid #eeeeee; font-size: 20px; font-weight: 600; text-align: left;">${suiteName}</h2>
                     <table border="0" cellpadding="0" cellspacing="0" width="100%">${testsHtml}</table>
                   </div>`;
  }
  const overallStatusColor = failedTests > 0 ? '#dc3545' : '#28a745';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"><title>Test Execution Report</title>
      <style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');</style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Poppins', sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding: 20px 0;"><center>
          <table border="0" cellpadding="20" cellspacing="0" width="800" style="max-width: 800px; background-color: transparent;">

            <!-- Header -->
            <tr><td style="padding: 20px 0 25px 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="top">
                    <h1 style="font-size: 32px; font-weight: 700; color: #333333; margin: 0;">${PROJECT_NAME}</h1>
                    <p style="font-size: 18px; font-weight: 500; color: ${overallStatusColor}; margin: 5px 0 0 0;">${failedTests > 0 ? 'Failures Detected' : 'All Tests Passed'}</p>
                  </td>
                  <td align="right" valign="top" style="font-size: 14px; color: #6c757d;">
                    ${timestamp}
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Summary Cards Table -->
            <tr><td style="padding: 20px 0 30px 0;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
              <td width="25%" align="center" style="padding: 0 10px;"><div style="background-color: #ffffff; border: 1px solid #dee2e6; padding: 20px 10px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);"><p style="font-size: 28px; font-weight: 700; color: #495057; margin: 0;">${totalTests}</p><p style="font-size: 14px; color: #6c757d; margin: 5px 0 0;">Total</p></div></td>
              <td width="25%" align="center" style="padding: 0 10px;"><div style="background-color: #ffffff; border: 1px solid #dee2e6; padding: 20px 10px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);"><p style="font-size: 28px; font-weight: 700; color: #28a745; margin: 0;">${passedTests}</p><p style="font-size: 14px; color: #155724; margin: 5px 0 0;">Passed</p></div></td>
              <td width="25%" align="center" style="padding: 0 10px;"><div style="background-color: #ffffff; border: 1px solid #dee2e6; padding: 20px 10px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);"><p style="font-size: 28px; font-weight: 700; color: #dc3545; margin: 0;">${failedTests}</p><p style="font-size: 14px; color: #721c24; margin: 5px 0 0;">Failed</p></div></td>
              <td width="25%" align="center" style="padding: 0 10px;"><div style="background-color: #ffffff; border: 1px solid #dee2e6; padding: 20px 10px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);"><p style="font-size: 28px; font-weight: 700; color: #6c757d; margin: 0;">${skippedTests}</p><p style="font-size: 14px; color: #383d41; margin: 5px 0 0;">Skipped</p></div></td>
            </tr></table></td></tr>
            
            <!-- Test Suites Details -->
            <tr><td style="padding: 10px 0;">${suitesHtml}</td></tr>
            
            <!-- Footer with Button -->
            <tr><td style="padding: 30px 0 10px 0; border-top: 1px solid #eeeeee;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
                <td align="left" valign="middle">${deployUrl ? `<a href="${deployUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">View Full Report</a>` : ''}</td>
                <td align="right" valign="middle" style="font-size: 12px; color: #6c757d;">
                   Automated Report
                </td>
              </tr></table>
            </td></tr>

          </table>
        </center></td></tr>
      </table>
    </body>
    </html>
  `;
}

// ... the rest of the file (authorize and sendEmail functions) remains the same
async function sendEmail(auth: any) {
  const gmail = google.gmail({ version: 'v1', auth });
  const EMAIL_TITLE = `${PROJECT_NAME} - Test Summary`;
  const htmlBody = createHtmlReport();
  const emailContent = [
    `From: "${PROJECT_NAME}" <${GMAIL_ADDRESS}>`, // Optional: Add a sender name
    `To: ${RECIPIENT_ADDRESSES.join(',')}`,
    `Subject: ${EMAIL_TITLE}`,
    'Content-Type: text/html; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    htmlBody
  ].join('\n');
  console.log('Sending final professional HTML email summary...');
  await gmail.users.messages.send({ userId: 'me', requestBody: { raw: Buffer.from(emailContent).toString('base64') } });
  console.log('HTML summary email sent successfully!');
}

authorize().then(sendEmail).catch(console.error);