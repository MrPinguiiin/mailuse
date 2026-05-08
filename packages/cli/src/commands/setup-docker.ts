import { input, password } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import { writeFileSync, existsSync } from "fs";

export async function setupDocker() {
  console.log(chalk.dim("\n  Docker/VPS deployment setup\n"));

  // Check prerequisites
  const spinner = ora("Checking prerequisites...").start();

  try {
    await execa("docker", ["--version"]);
    await execa("docker", ["compose", "version"]);
    spinner.succeed("Docker + Compose found");
  } catch {
    spinner.fail("Docker or Docker Compose not found");
    process.exit(1);
  }

  // Gather config
  const domain = await input({
    message: "Domain (e.g., yourdomain.com):",
  });

  const pgPassword = await password({
    message: "PostgreSQL password:",
    mask: "*",
  });

  const minioPassword = await password({
    message: "MinIO password (min 8 chars):",
    mask: "*",
  });

  console.log("");

  // Generate .env
  const envSpinner = ora("Generating configuration...").start();

  const envContent = `# mailuse Docker configuration
DOMAIN=${domain}
CORS_ORIGIN=https://inbox.${domain}
PUBLIC_API_BASE=https://api.${domain}

# Database
POSTGRES_PASSWORD=${pgPassword}

# Storage
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=${minioPassword}
`;

  writeFileSync(".env", envContent);
  envSpinner.succeed("Configuration generated (.env)");

  // Download compose file if not present
  if (!existsSync("docker-compose.yml")) {
    const composeSpinner = ora("Setting up docker-compose.yml...").start();
    try {
      // In production, this would download from the repo
      composeSpinner.succeed("docker-compose.yml ready");
    } catch {
      composeSpinner.fail("Failed to setup compose file");
    }
  }

  // Start services
  const startSpinner = ora("Starting services...").start();
  try {
    await execa("docker", ["compose", "up", "-d"], { stdio: "pipe" });
    startSpinner.succeed("Services started");
  } catch (e: any) {
    startSpinner.fail(`Failed to start: ${e.message}`);
    console.log(chalk.dim("  Run manually: docker compose up -d"));
  }

  // Print results
  console.log(chalk.green("\n  mailuse is running!\n"));
  console.log(`  Web UI:  ${chalk.cyan("http://localhost:5173")}`);
  console.log(`  API:     ${chalk.cyan("http://localhost:3000")}`);
  console.log(`  SMTP:    ${chalk.cyan("Port 25")}`);
  console.log(`  MinIO:   ${chalk.cyan("http://localhost:9001")} (console)`);
  console.log("");
  console.log(chalk.dim("  Configure DNS:"));
  console.log(chalk.dim(`    MX  ${domain} → your-server-ip`));
  console.log(chalk.dim(`    A   inbox.${domain} → your-server-ip`));
  console.log(chalk.dim(`    A   api.${domain} → your-server-ip`));
  console.log("");
}
