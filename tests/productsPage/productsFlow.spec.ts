import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { ProductsPage } from '../../pages/productsPage';
import { allure } from 'allure-playwright';

test.describe('Products Page Functional Tests', () => {

    test('Verify all products have complete data', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);

        await allure.step('Login as standard user', async () => {
            await loginPage.open();
            await loginPage.login('standard_user', 'secret_sauce');
            await loginPage.verifyDashboard();
        });

        await allure.step('Open Products Page', async () => {
            await productsPage.open();
            await allure.attachment('Products Page', await page.screenshot(), 'image/png');
        });

        await allure.step('Check each product for complete data', async () => {
          await productsPage.productHasCompleteData();
        });
    });

    test('Verify Add to Cart updates cart badge', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);

        await allure.step('Login as standard user', async () => {
            await loginPage.open();
            await loginPage.login('standard_user', 'secret_sauce');
            await loginPage.verifyDashboard();
        });

        await allure.step('Open Products Page', async () => {
            await productsPage.open();
        });

        await allure.step('Add product to cart and verify cart badge', async () => {
            await productsPage.verifyAddToCartUpdatesBadge();
            await allure.attachment('Cart Badge Updated', await page.screenshot(), 'image/png');
        });
    });

    test('Verify cart contains the added product', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);

        await allure.step('Login and open Products Page', async () => {
            await loginPage.open();
            await loginPage.login('standard_user', 'secret_sauce');
            await loginPage.verifyDashboard();
            await productsPage.open();
        });

        await allure.step('Add product to cart', async () => {
            await productsPage.verifyAddToCartUpdatesBadge();
        });

        await allure.step('Verify cart content', async () => {
            await productsPage.verifyCartIsNotEmpty();
            await allure.attachment('Cart Has Product', await page.screenshot(), 'image/png');
        });
    });

    test('Verify checkout page opens correctly', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);

        await allure.step('Login and open Products Page', async () => {
            await loginPage.open();
            await loginPage.login('standard_user', 'secret_sauce');
            await loginPage.verifyDashboard();
            await productsPage.open();
        });

        await allure.step('Add product and go to checkout page', async () => {
            await productsPage.verifyAddToCartUpdatesBadge();
            await productsPage.verifyCartIsNotEmpty();
            await productsPage.verifyCheckoutPage();
            await allure.attachment('Checkout Page Screenshot', await page.screenshot(), 'image/png');
        });
    });

    test('Verify product can be removed from cart', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);

        await allure.step('Login and open Products Page', async () => {
            await loginPage.open();
            await loginPage.login('standard_user', 'secret_sauce');
            await loginPage.verifyDashboard();
            await productsPage.open();
        });

        await allure.step('Add product to cart', async () => {
            await productsPage.verifyAddToCartUpdatesBadge();
        });

        await allure.step('Remove product from cart and verify', async () => {
            await productsPage.verifyRemoveButton();
            await allure.attachment('After Removal Screenshot', await page.screenshot(), 'image/png');
        });
    });

    test('Clicking product name or image opens correct detail page', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);

        await allure.step('Login and open Products Page', async () => {
            await loginPage.open();
            await loginPage.login('standard_user', 'secret_sauce');
            await loginPage.verifyDashboard();
            await productsPage.open();
        });

        await allure.step('Click product name and verify correct detail page', async () => {
            const firstProductName = await page.locator('[data-test="inventory-item-name"]').first().textContent();
            await page.locator('[data-test="inventory-item-name"]').first().click();
            await expect(page.locator('.inventory_details_name')).toHaveText(firstProductName ?? '');
            await allure.attachment('Product Detail Page', await page.screenshot(), 'image/png');
        });
    });

});
