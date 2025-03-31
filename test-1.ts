import StagehandConfig from "./stagehand.config.js";
import { Page, BrowserContext, Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import chalk from "chalk";
import boxen from "boxen";
import dotenv from "dotenv";

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
  
    const headlines = await stagehand.page.extract({
      instruction: "Extract the names of the new online slots.",
      schema: z.object({
        story: z.object({
          title: z.string(),
          points: z.number(),
        }),
      }),
      useTextExtract: true,
    })};