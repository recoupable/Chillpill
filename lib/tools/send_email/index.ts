import { OpenAI } from "openai";
import stack from "@/lib/stack";
import { trackCreateEmail } from "@/lib/stack/trackCreateEmail";
import { Resend } from "resend";
import type { TaskGeneration } from "../actionLoop/generateTask";
import { whoIsReneeCoupable } from "@/lib/openai/instructions";
import { OPEN_AI_MODEL } from "@/lib/consts";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmailContent(task: TaskGeneration) {
  const prompt = `
    Generate a professional email based on the following task:
    Task ID: ${task.taskId}
    Task Type: ${task.task}
    Task Reasoning: ${task.taskReasoning}
    
    Please provide the response in JSON format with 'subject' and 'html' fields.
    The HTML should be well-formatted and include proper styling.
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: whoIsReneeCoupable },
      { role: "user", content: prompt },
    ],
    model: OPEN_AI_MODEL,
    response_format: { type: "json_object" },
  });

  console.log("completion:", completion);

  const response = JSON.parse(completion.choices[0].message.content);
  return {
    subject: response.subject,
    html: response.html,
  };
}

export async function sendEmail(task: TaskGeneration) {
  try {
    // Generate email content using OpenAI
    const emailContent = await generateEmailContent(task);

    const emailConfig = {
      from: "Recoup <agent@recoupable.com>",
      to: ["sweetmantech@gmail.com", "sidney@recoupable.com"],
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const { data } = await resend.emails.send(emailConfig);

    // Track the email event using Stack L3
    await trackCreateEmail(
      emailConfig.html,
      emailConfig.subject,
      emailConfig.to[0]
    );

    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

// Email template types
export type EmailTemplate =
  | "activity_report"
  | "alert"
  | "engagement_update"
  | "weekly_summary";

// Template generator function
export function generateEmailTemplate(type: EmailTemplate, data: any): string {
  switch (type) {
    case "activity_report":
      return `
        <h1>Activity Report</h1>
        <p>Posts created: ${data.postsCreated}</p>
        <p>Interactions: ${data.interactions}</p>
      `;
    case "alert":
      return `
        <h1>System Alert</h1>
        <p>Alert type: ${data.alertType}</p>
        <p>Message: ${data.message}</p>
      `;
    case "engagement_update":
      return `
        <h1>Engagement Update</h1>
        <p>Total engagements: ${data.totalEngagements}</p>
        <p>Trending topics: ${data.trendingTopics.join(", ")}</p>
      `;
    case "weekly_summary":
      return `
        <h1>Weekly Performance Summary</h1>
        <p>Total posts: ${data.totalPosts}</p>
        <p>Total interactions: ${data.totalInteractions}</p>
        <p>Top performing content: ${data.topContent}</p>
      `;
    default:
      throw new Error(`Unknown email template type: ${type}`);
  }
}
