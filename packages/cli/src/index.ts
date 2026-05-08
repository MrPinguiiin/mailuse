#!/usr/bin/env bun
import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { setupCloudflare } from "./commands/setup-cloudflare";
import { setupDocker } from "./commands/setup-docker";

console.log(chalk.bold("\n  mailuse - Disposable Email Service\n"));

const mode = await select({
  message: "Select deployment mode:",
  choices: [
    { name: "Cloudflare (D1 + R2 + Email Routing)", value: "cloudflare" },
    { name: "Docker (Postgres + MinIO + SMTP)", value: "docker" },
  ],
});

if (mode === "cloudflare") {
  await setupCloudflare();
} else {
  await setupDocker();
}
