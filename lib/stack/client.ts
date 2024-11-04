import { StackClient } from "@stackso/js-core";

if (!process.env.STACK_API_KEY || !process.env.STACK_SYSTEM_ID) {
  throw new Error("Stack API key or system ID not configured");
}

export const stack = new StackClient({
  apiKey: process.env.STACK_API_KEY as string,
  pointSystemId: parseInt(process.env.STACK_SYSTEM_ID as string),
});
