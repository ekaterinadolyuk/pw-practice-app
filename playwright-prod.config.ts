import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options'

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/',
    baseURL: 'http://localhost:4200'
  },

  projects: [
    {
      name: 'chromium'
    }
  ]
});
