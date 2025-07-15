import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    watchForFileChanges: false,
    setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        switch (browser.family) {
          case "chromium":
            if (browser.name === "chrome") launchOptions.args.push("--guest");
            break;
        }
        return launchOptions;
      });
    },
  },
});
