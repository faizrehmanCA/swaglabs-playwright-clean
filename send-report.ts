import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const SUMMARY_JSON_PATH = path.join(process.cwd(), 'test-summary.json');
const DEPLOY_OUTPUT_PATH = path.join(process.cwd(), 'deploy-output.json'); // New file to read

// --- Email Configuration ---
const GMAIL_ADDRESS = 'faizkhancodeautomation@gmail.com';
const RECIPIENT_ADDRESS = 'faizrehman561@gmail.com';
const EMAIL_SUBJECT = 'Playwright Test Execution Summary';
// -------------------------

async function authorize() {
    // This function remains the same...
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

/**
 * Reads test summary and deploy output to generate an HTML report.
 */
function createHtmlReport(): string {
    // 1. Get the Unique Deploy URL from deploy-output.json
    let deployUrl = '';
    try {
        if (fs.existsSync(DEPLOY_OUTPUT_PATH)) {
            const deployOutput = JSON.parse(fs.readFileSync(DEPLOY_OUTPUT_PATH, 'utf8'));
            deployUrl = deployOutput.deploy_url; // This is the unique URL
        }
    } catch (error) {
        console.log('Could not read deploy URL from deploy-output.json');
    }

    // 2. Build the main test summary table
    if (!fs.existsSync(SUMMARY_JSON_PATH)) {
        // Fallback if summary is missing
        return `<h1>Test Summary Not Available</h1>`;
    }
    const summary = JSON.parse(fs.readFileSync(SUMMARY_JSON_PATH, 'utf8'));
    let totalTests = 0, passedTests = 0, suitesHtml = '';

    for (const suiteName in summary) {
        // ... (This loop for building the table remains the same)
        const tests = summary[suiteName];
        suitesHtml += `<h2>${suiteName}</h2>
                   <table class="test-table">
                     <tr><th>Test Case</th><th>Status</th></tr>`;
        for (const test of tests) {
            totalTests++;
            if (test.status === 'passed') passedTests++;
            suitesHtml += `<tr><td>${test.name}</td><td class="status-${test.status}">${test.status.toUpperCase()}</td></tr>`;
        }
        suitesHtml += `</table>`;
    }

    // 3. Assemble the final HTML, now including the link and button
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { background-color: #f2f2f2; padding: 20px; text-align: center; }
        .summary { font-size: 24px; font-weight: bold; }
        .status-all-passed { color: #28a745; }
        .status-failures { color: #dc3545; }
        .test-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .test-table th, .test-table td { border: 1px solid #ddd; padding: 8px; }
        .test-table th { background-color: #f8f9fa; text-align: left; }
        .status-passed { color: #28a745; font-weight: bold; }
        .status-failed { color: #dc3545; font-weight: bold; }
        .button-container { text-align: center; margin: 30px 0; }
        .report-button { background-color: #007bff; color: #ffffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Playwright Test Execution Report</h1>
        <p class="summary ${totalTests === passedTests ? 'status-all-passed' : 'status-failures'}">
          ${passedTests} / ${totalTests} Tests Passed
        </p>
      </div>
      
      ${deployUrl ? `
        <div class="button-container">
          <a href="${deployUrl}" class="report-button">View Full Interactive Report</a>
        </div>
      ` : ''}

      ${suitesHtml}
    </body>
    </html>
  `;
}

async function sendEmail(auth: any) {
    // This function remains the same...
    const gmail = google.gmail({ version: 'v1', auth });
    const htmlBody = createHtmlReport();
    const emailContent = [
        `From: ${GMAIL_ADDRESS}`, `To: ${RECIPIENT_ADDRESS}`, `Subject: ${EMAIL_SUBJECT}`,
        'Content-Type: text/html; charset="UTF-8"', 'MIME-Version: 1.0', '', htmlBody
    ].join('\n');
    console.log('Sending formatted HTML email summary...');
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw: Buffer.from(emailContent).toString('base64') } });
    console.log('HTML summary email sent successfully!');
}

authorize().then(sendEmail).catch(console.error);