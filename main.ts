/**
 * 🤘 Welcome to Stagehand!
 *
 * TO RUN THIS PROJECT:
 * ```
 * npm install
 * npm run start
 * ```
 *
 * To edit config, see `stagehand.config.ts`
 *
 * In this example, we'll be using a custom LLM client to use Ollama instead of the default OpenAI client.
 *
 * 1. Go to https://mrq-test.com
 * 2. Use `extract` to get the IDs of all clickable elements
 * 3. Save the clickable elements to a JSON file
 */

import StagehandConfig from "./stagehand.config.js";
import { Page, BrowserContext, Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import chalk from "chalk";
import boxen from "boxen";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

export async function main({
  page,
  context,
  stagehand,
}: {
  page: Page; // Playwright Page with act, extract, and observe methods
  context: BrowserContext; // Playwright BrowserContext
  stagehand: Stagehand; // Stagehand instance
}) {
  await stagehand.page.goto("https://mrq-test.com");

  const clickableElements = await stagehand.page.evaluate(() => {
    // Query all clickable elements
    const elements = Array.from(
      document.querySelectorAll("a, button, input[type='button'], input[type='submit'], [role='button']")
    );

    // Map elements to extract relevant attributes
    return elements.map((el) => ({
      tagName: el.tagName.toLowerCase(),
      id: el.id || null,
      className: el.className || null,
      text: el.textContent?.trim() || null,
      type: (el as HTMLInputElement).type || null,
      href: (el as HTMLAnchorElement).href || null,
    }));
  });

  console.log("Extracted clickable elements:", clickableElements);

  // Save the clickable elements to a JSON file
  await fs.writeFile(
    "clickable-elements.json",
    JSON.stringify(clickableElements, null, 2),
    "utf-8"
  );
  console.log("Clickable elements saved to clickable-elements.json");

  //   Close the browser
  await stagehand.close();

  if (StagehandConfig.env === "BROWSERBASE" && stagehand.browserbaseSessionID) {
    console.log(
      "Session completed. Waiting for 10 seconds to see the logs and recording..."
    );
    //   Wait for 10 seconds to see the logs
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log(
      boxen(
        `View this session recording in your browser: \n${chalk.blue(
          `https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`
        )}`,
        {
          title: "Browserbase",
          padding: 1,
          margin: 3,
        }
      )
    );
  } else {
    console.log(
      "We hope you enjoyed using Stagehand locally! On Browserbase, you can bypass captchas, replay sessions, and access unparalleled debugging tools!\n10 free sessions: https://www.browserbase.com/sign-up\n\n"
    );
  }

  console.log(
    `\n🤘 Thanks for using Stagehand! Create an issue if you have any feedback: ${chalk.blue(
      "https://github.com/browserbase/stagehand/issues/new"
    )}\n`
  );
  process.exit(0);
}
