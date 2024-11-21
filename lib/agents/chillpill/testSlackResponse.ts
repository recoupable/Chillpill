import { generateSlackResponse } from '../../openai/generateSlackResponse';
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../../.env") });

async function testChillpillResponse() {
  try {
    const response = await generateSlackResponse({
      text: "what's on your mind?",
      username: "manager",
      task: {
        taskId: "natural-chat",
        task: "chat",
        taskReasoning: "natural conversation",
        action: "send_slack_message"
      }
    });

    console.log("\nChillpill's Response:", response);

  } catch (error) {
    console.error("Error:", error);
  }
}

testChillpillResponse();