import { CustomerInfo } from '../pages/sauce-demo.page';

export const USERS = {
  STANDARD: { username: 'standard_user', password: 'secret_sauce' },
  LOCKED_OUT: { username: 'locked_out_user', password: 'secret_sauce' },
  INVALID: { username: 'invalid_user', password: 'wrong_password' },
};

export const PRODUCT = {
  name: 'Sauce Labs Backpack',
  price: 29.99,
};

export const CUSTOMER_INFO: CustomerInfo = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
};

export const SORT_OPTION = 'lohi'; // Price low to high 