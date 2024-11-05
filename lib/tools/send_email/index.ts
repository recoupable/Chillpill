import stack from "@/lib/stack";
import { trackCreateEmail } from "@/lib/stack/trackCreateEmail";
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(config: EmailConfig) {
  try {
    const emailConfig = {
      from: config.from || "recoup@onchainmagic.xyz",
      to: config.to,
      subject: config.subject,
      html: config.html,
    };
    console.log("Sending email:", emailConfig);
    // const response = await resend.emails.send(emailConfig);

    const { data, error } = await resend.emails.send({
      from: "Recoup <agent@myco.wtf>",
      to: ["sweetmantech@gmail.com", "sidney@recoupable.com"],
      subject: "Hello World",
      html: "<strong>It works!</strong>",
    });
    console.log(" email data:", data);
    console.log("error:", error);

    // Track the email event using Stack L3
    await trackCreateEmail(config.html, config.subject, config.to);

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
