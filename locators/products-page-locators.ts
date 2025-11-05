import { Page, Locator } from '@playwright/test';

export class ProductsPageLocators {
    constructor(private readonly page: Page) {}

    // All products container
    get products() {
      return this.page.locator('.inventory_item');
    }

    // Dynamic product getter (index-based)
    getProductElements(index: number): {
      root: Locator;
      title: Locator;
      description: Locator;
      price: Locator;
      addToCartButton: Locator;
      image: Locator;
    } {
      const product = this.products.nth(index);
      return {
        root: product,
        title: product.getByTestId('inventory-item-name'),
        description: product.getByTestId('inventory-item-desc'),
        price: product.getByTestId('inventory-item-price'),
        addToCartButton: product.locator('button'),
        image: product.locator('img'),
      };
    }

    // Global locators
    get cartBadge() {
      return this.page.getByTestId('shopping-cart-badge');
    }

    get addToCartBackpack() {
      return this.page.getByTestId('add-to-cart-sauce-labs-backpack');
    }

    get removeButton() {
      return this.page.locator("button:has-text('Remove')");
    }

    get checkoutButton() {
      return this.page.getByTestId('checkout');
    }

    get checkoutTitle() {
      return this.page.getByTestId('title');
    }

    get cartProduct() {
      return this.page.getByTestId('inventory-item');
    }

    get productName() {
      return this.page.getByTestId('inventory-item-name');
    }

    get productDesc() {
      return this.page.getByTestId('inventory-item-desc');
    }

    get productPrice() {
      return this.page.getByTestId('inventory-item-price');
    }

    get productImage() {
      return this.page.locator('.inventory_item img');
    }
}
