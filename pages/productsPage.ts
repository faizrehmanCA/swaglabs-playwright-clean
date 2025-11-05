import { Page, expect } from '@playwright/test';
import { ProductsPageLocators } from '../locators/products-page-locators';
import data from '../fixtures/data.json'

export class ProductsPage {
  readonly page: Page;
  readonly locators: ProductsPageLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = new ProductsPageLocators(page);
  }

  async open() {
    await this.page.goto(data.productsPage);
  }

  // Using dynamic locators
  async productHasCompleteData() {
    const { products } = this.locators;
    const count = await products.count();

    console.log(`\nTotal products found: ${count}\n`);

    for (let i = 0; i < count; i++) {
      const product = this.locators.getProductElements(i);

      await expect(product.title).not.toBeEmpty();
      await expect(product.description).not.toBeEmpty();
      await expect(product.price).not.toBeEmpty();
      await expect(product.addToCartButton).toHaveText(data.addToCartText);
      await expect(product.image).toBeVisible();

      console.log(`Product ${i + 1}: OK`);
    }
  }

  async verifyAddToCartUpdatesBadge() {
    const { addToCartBackpack, cartBadge } = this.locators;

    await expect(cartBadge).toHaveCount(0);
    await addToCartBackpack.click();
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
    console.log('Cart badge updated to 1');
  }

  async verifyRemoveButton() {
    const { removeButton, cartBadge } = this.locators;

    await expect(cartBadge).toHaveText('1');
    await removeButton.click();
    await expect(cartBadge).toHaveCount(0);
    console.log('Remove button works correctly');
  }

  async verifyCartIsNotEmpty() {
    const { cartBadge, cartProduct } = this.locators;

    await expect(cartBadge).toHaveText('1');
    await cartBadge.click();
    await expect(cartProduct).toBeVisible();
    console.log('Cart contains product');
  }

  async verifyCheckoutPage() {
    const { checkoutButton, checkoutTitle } = this.locators;

    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();
    await expect(checkoutTitle).toBeVisible();
    console.log('Checkout page opened successfully');
  }
}
