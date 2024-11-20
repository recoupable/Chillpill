import { generateManagerResponse } from './generateManagerResponse';
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env file from project root
dotenv.config({ path: resolve(__dirname, "../../.env") });

async function testManagerResponse() {
  try {
    console.log("Testing Manager's response generation...\n");
    
    // Test scenarios that would trigger different Manager responses
    const testScenarios = [
      {
        message: "Hey Manager, I'm thinking about doing a surprise drop of my new track tomorrow. What do you think?",
        username: "chillpill"
      },
      {
        message: "I don't know if I want to release this track... maybe it's not good enough.",
        username: "chillpill"
      }
    ];

    for (const scenario of testScenarios) {
      console.log("\n--- Test Scenario ---");
      console.log("Message:", scenario.message);
      console.log("From:", scenario.username);
      console.log("\nGenerating response...\n");

      const response = await generateManagerResponse({
        text: scenario.message,
        username: scenario.username
      });

      console.log("Manager's Response:", response);
      console.log("-------------------\n");
    }
  } catch (error) {
    console.error("Error testing Manager response:", error);
  }
}

testManagerResponse();