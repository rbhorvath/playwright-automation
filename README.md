# Ultra-Minimal Playwright Automation for CI

An ultra-minimalist GitHub Actions CI automation solution for [Sauce Demo](https://www.saucedemo.com/) using Playwright and TypeScript.

## Features

- **Single-file architecture** with page object and tests combined
- **Zero dependencies** beyond Playwright itself
- **Extreme simplification** for GitHub Actions
- **Maintenance-friendly** with all test logic in one place
- **Fast execution** optimized for CI environment

## Project Structure

```
playwright-automation/
├── .github/workflows/  # GitHub Actions workflow
├── tests/              # Single test file with everything
├── playwright.config.ts # Minimal configuration
└── package.json        # Stripped-down dependencies
```

## GitHub Actions Configuration

This project runs exclusively in GitHub Actions:

- Runs on push to main branch
- Runs on manual trigger
- Runs daily at 9:00 UTC

## Implemented Scenarios

1. **Login Tests**
   - Login with valid credentials
   - Login with invalid credentials
   - Login with locked out user

2. **Checkout Flow**
   - Complete end-to-end purchase flow

## Why This Approach?

This ultra-minimal structure is designed specifically for CI environments where:

- Maintenance needs to be simple
- All test code should be in one place
- Startup time should be minimal
- Dependencies should be minimized 