import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  //forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined, // if undefined change to 1, it will increase execution time, because pw will execute all spec files within 1 worker
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['json', {outputFile: 'test-results/jsonReport.json'}],
            ['json', {outputFile: 'test-results/junitReport.xml'}],
          ['html']],//to download json report into file
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:4200',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/',
    baseURL: process.env.DEV === '1' ? 'http://localhost:4201'
      : process.env.STAGING === '1' ? 'http://localhost:4202'
      : 'http://localhost:4200',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry', //series of snapshots of the testrun (logs, steps of executions)
    video: {
      mode: 'off',
      size: { width: 1280, height: 720 } //record video for all tests, also for passed ones. 'on-first-retry' - only for failed tests
    }, //video recording of the testrun. Run using cli, nut clicking on play button
    actionTimeout: 20000,
    navigationTimeout: 25000
  },

  projects: [
    // {
    //   name: 'dev',
    //   use: { 
    //     ...devices['Desktop Safari']/*,
    //     //baseURL: 'http://localhost:4201'*/},
    // },
    {
      name: 'chromium',
      testIgnore: 'testMobile.spec.ts'
      //fullyParallel: false, // this will run all tests in this browser one by one
    },

    // {
    //   name: 'firefox',
    //   use: { browserName: 'firefox' },
    //   testIgnore: 'testMobile.spec.ts'
    // },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro'],
        //viewport:{width: 414, height: 800} - also can be added
      }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ]
});
