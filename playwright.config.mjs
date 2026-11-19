import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
  testDir:'./tests/e2e',timeout:30000,retries:1,
  use:{...devices['Desktop Chrome'],headless:true,trace:'retain-on-failure'},
  reporter:'list'
});
