# Playwright Automation Framework for Sauce Demo

A comprehensive end-to-end testing automation framework for [Sauce Demo](https://www.saucedemo.com/) using Playwright and TypeScript.

## Features

- **Page Object Model** architecture for better maintainability
- **Data-driven testing** approach with centralized test data
- **Multi-browser testing** across Chromium, Firefox, and WebKit
- **Mobile testing** capability with device emulation
- **Parallel test execution** for faster feedback
- **HTML and JSON reporting** for better visualization
- **Centralized configuration** via environment variables
- **Cross-platform support** for Windows, macOS, and Linux

## Project Structure

```
playwright-automation/
├── src/
│   ├── fixtures/      # Custom test fixtures
│   ├── pages/         # Page object models
│   ├── utils/         # Utility functions and test data
│   └── global-setup.ts # Global authentication setup
├── tests/             # Test files
├── playwright.config.ts # Playwright configuration
├── package.json       # Project dependencies and scripts
└── README.md         # Project documentation
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/rbhorvath/playwright-automation.git
cd playwright-automation
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

Run all tests:

```bash
npm test
```

Run tests with headed browsers:

```bash
npm run test:headed
```

Run tests in a specific browser:

```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

Run tests on mobile devices:

```bash
npm run test:mobile
```

Run tests in debug mode:

```bash
npm run test:debug
```

View test report:

```bash
npm run report
```

## Configuration

You can configure the tests through environment variables or by creating a `.env` file in the project root:

```
BASE_URL=https://www.saucedemo.com
DEFAULT_USERNAME=standard_user
DEFAULT_PASSWORD=secret_sauce
HEADLESS=true
WORKERS=4
```

## Implemented Scenarios

1. **Login Tests**
   - Login with valid credentials
   - Login with locked out user
   - Login with invalid credentials

2. **Product Catalog Tests**
   - Sort products by price (low to high)
   - Add products to cart

3. **Checkout Process Tests**
   - Complete checkout process 