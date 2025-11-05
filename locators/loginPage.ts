import { Page } from '@playwright/test';

export class LoginPageLocators {
  constructor(private readonly page: Page) {}

  get usernameInput() {
    return this.page.getByTestId('username');
  }

  get passwordInput() {
    return this.page.getByTestId('password');
  }

  get loginButton() {
    return this.page.getByTestId('login-button');
  }

  get errorMessage() {
    return this.page.getByTestId('error');
  }

  get dashboardTitle() {
    return this.page.getByTestId('title');
  }
}
