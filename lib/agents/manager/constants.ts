// Manager-specific constants
export const MANAGER_SLACK_ID = process.env.MANAGER_SLACK_ID || "U081600A2PP";
export const MANAGER_USERNAME = "manager";
export const MANAGER_BOT_TOKEN = process.env.MANAGER_SLACK_BOT_TOKEN;

// Validate Manager's required environment variables
if (!MANAGER_SLACK_ID || !MANAGER_BOT_TOKEN) {
  throw new Error("Manager Slack credentials are not properly configured");
}