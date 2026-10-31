/** @type {CodeceptJS.MainConfig} */
export const config = {
  tests: './tests/**/*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://127.0.0.1:5500',
      show: true
    }
  },
  include: {
    I: './steps_file.js'
  },
  noGlobals: true,
  plugins: {},
  name: 'KCPM-2026'
}