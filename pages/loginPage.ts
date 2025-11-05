import { Page, expect } from '@playwright/test';
import { LoginPageLocators } from '../locators/loginPage';

import data from '../fixtures/data.json'
import dotenv from 'dotenv'


dotenv.config();

export class LoginPage {
  readonly page: Page;
  readonly locators: LoginPageLocators;
  private baseUrl: string;
  // private validUsername: string;
  // private validPassword: string;

  constructor(page: Page) {
    this.page = page;
    this.locators = new LoginPageLocators(page);
    this.baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com/';

    // if(!process.env.VALID_USERNAME || !process.env.VALID_PASSWORD) {
    //   throw new Error("Missing VALID_USERNAME or VALID_PASSWORD in .env file");
    // } else {
    //     this.validUsername = process.env.VALID_USERNAME;
    //     this.validPassword = process.env.VALID_PASSWORD;
    // }
  }

  async open() {
    await this.page.goto(this.baseUrl);
  }

  async login(username: string, password: string) {
    const { usernameInput, passwordInput, loginButton } = this.locators;
    
    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await loginButton.click();
  }

  async verifyDashboard() {
    await expect(this.locators.dashboardTitle).toBeVisible();
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async verifyErrorMessage(expectedText: string) {
    const { errorMessage } = this.locators;
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(expectedText);
  }

  async verifyEmptyUsernameError() {
    await this.verifyErrorMessage(data.errorMessages.emptyUsernameError);
  }

  async verifyInvalidCredentialsError() {
    await this.verifyErrorMessage(data.errorMessages.invalidCredentialsError);
  }

  async verifyLockedOutUserError() {
    await this.verifyErrorMessage(data.errorMessages.lockedOutUserError);
  }

  async verifyShortPasswordError() {
    await this.verifyErrorMessage(data.errorMessages.shortPasswordError);
  }
}
