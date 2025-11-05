import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { allure } from 'allure-playwright';
import dotenv from 'dotenv'

dotenv.config()

const validUsername = process.env.VALID_USERNAME as string;
const validPassword = process.env.VALID_PASSWORD as string;
const emptyUsername = process.env.EMPTY_USERNAME as string;
const invalidUsername = process.env.INVALID_USERNAME as string;
const invalidPassword = process.env.INVALID_PASSWORD as string;
const shortPassword = process.env.SHORT_PASSWORD as string;
const lockedoutUsername = process.env.LOCKED_OUT_USERNAME as string;
const lockedoutPassword = process.env.LOCKED_OUT_PASSWORD as string;

test.describe('Login Page Functional Tests', () => {

    test('Login successfully with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await allure.step('Open Login Page', async () => {
            await loginPage.open();
            await allure.attachment('Login Page', await page.screenshot(), 'image/png');
        });

        await allure.step('Login with valid credentials', async () => {
            await loginPage.login(validUsername as string, validPassword as string);
        });

        await allure.step('Verify successful login', async () => {
            await loginPage.verifyDashboard();
            await allure.attachment('Dashboard Screenshot', await page.screenshot(), 'image/png');
        });
    });

    test('Show error for empty username', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await allure.step('Open Login Page', async () => {
            await loginPage.open();
        });

        await allure.step('Try login with empty username', async () => {
            await loginPage.login(emptyUsername, validPassword);
        });

        await allure.step('Verify empty username error message', async () => {
            await loginPage.verifyEmptyUsernameError();
            await allure.attachment('Empty Username Error', await page.screenshot(), 'image/png');
        });
    });

    test('Show error for invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();

        await allure.step('Attempt login with invalid credentials', async () => {
            await loginPage.login(invalidUsername, invalidPassword);
        });

        await allure.step('Verify invalid credentials error message', async () => {
            await loginPage.verifyInvalidCredentialsError();
            await allure.attachment('Invalid Login Error', await page.screenshot(), 'image/png');
        });
    });

    test('Show error for too short password', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();

        await allure.step('Attempt login with too short password', async () => {
            await loginPage.login(validUsername, shortPassword);
        });

        await allure.step('Verify short password validation message', async () => {
            await loginPage.verifyShortPasswordError();
            await allure.attachment('Short Password Error', await page.screenshot(), 'image/png');
        });
    });

    test('Show error for locked out user', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();

        await allure.step('Attempt login with locked out user', async () => {
            await loginPage.login(lockedoutUsername, lockedoutPassword);
        });

        await allure.step('Verify locked out user message', async () => {
            await loginPage.verifyLockedOutUserError();
            await allure.attachment('Locked User Error', await page.screenshot(), 'image/png');
        });
    });

    test('Show error for whitespace-only credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login('   ', '   ');
        await loginPage.verifyInvalidCredentialsError();
    });

    test('Username is case-sensitive error', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login('STANDARD_USER', 'secret_sauce')
        await loginPage.verifyInvalidCredentialsError()
    })

    test('Error message disappears after clicking close icon', async({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login('', '');
        await expect(loginPage.locators.errorMessage).toBeVisible();
    })

});
