/**
 * Test data management for Sauce Demo tests
 */

import { CustomerInfo } from '../pages/checkout-page';

// User credentials
export const Users = {
  STANDARD: {
    username: process.env.DEFAULT_USERNAME || 'standard_user',
    password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
  },
  ERROR: {
    username: 'error_user',
    password: 'secret_sauce',
  },
  VISUAL: {
    username: 'visual_user',
    password: 'secret_sauce',
  },
  INVALID: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
};

// Product data
export const Products = {
  BACKPACK: {
    name: 'Sauce Labs Backpack',
    selector: 'sauce-labs-backpack',
    price: 29.99,
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
  },
  BIKE_LIGHT: {
    name: 'Sauce Labs Bike Light',
    selector: 'sauce-labs-bike-light',
    price: 9.99,
    description: 'A red light isn\'t the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.',
  },
  BOLT_SHIRT: {
    name: 'Sauce Labs Bolt T-Shirt',
    selector: 'sauce-labs-bolt-t-shirt',
    price: 15.99,
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
  },
  FLEECE_JACKET: {
    name: 'Sauce Labs Fleece Jacket',
    selector: 'sauce-labs-fleece-jacket',
    price: 49.99,
    description: 'It\'s not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.',
  },
  ONESIE: {
    name: 'Sauce Labs Onesie',
    selector: 'sauce-labs-onesie',
    price: 7.99,
    description: 'Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won\'t unravel.',
  },
  TEST_ALL: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    selector: 'test-allthethings-t-shirt-red',
    price: 15.99,
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
  },
};

// Sort options
export const SortOptions = {
  NAME_AZ: 'az',
  NAME_ZA: 'za',
  PRICE_LOW_HIGH: 'lohi',
  PRICE_HIGH_LOW: 'hilo',
};

// Customer information for checkout
export const CustomerData: CustomerInfo = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
};

// URLs
export const URLs = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
};

/**
 * Generate random customer data for testing
 */
export function generateRandomCustomer(): CustomerInfo {
  return {
    firstName: `Test${Math.floor(Math.random() * 1000)}`,
    lastName: `User${Math.floor(Math.random() * 1000)}`,
    postalCode: `${Math.floor(Math.random() * 100000)}`,
  };
} 