import { defineConfig } from 'cypress';
import allureWriter from '@shelex/cypress-allure-plugin/writer';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';

export default defineConfig({
    e2e: {
        env: {
            bookingEndpoint: '/booking',
            authEndpoint: '/auth',
        },
        specPattern: 'cypress/e2e/**/*.feature',
        async setupNodeEvents(on, config) {
            // Set up the preprocessor using esbuild
            const bundler = createBundler({
                plugins: [createEsbuildPlugin(config)],
            });

            // Use the bundler for preprocessing files
            on('file:preprocessor', bundler);

            // Add the Cucumber preprocessor plugin
            await addCucumberPreprocessorPlugin(on, config);

            // Add Allure reporter
            allureWriter(on, config);

            return config;
        },
        baseUrl: 'https://restful-booker.herokuapp.com',
        supportFile: 'cypress/support/index.ts',
        video: false,
    },
});
