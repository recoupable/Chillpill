import generateEmailContent from "@/lib/openai/generateEmailContent";
import { trackCreateEmail } from "@/lib/stack/trackCreateEmail";
import type { TaskGeneration } from "../actionLoop/generateTask";
import { resend } from "@/lib/resend/client";

export async function sendEmail(task: TaskGeneration) {
  try {
    const emailContent = await generateEmailContent(task);

    const emailConfig = {
      from: "Chillpill <chillpill@recoupable.com>",
      to: ["sweetmantech@gmail.com", "sidney@recoupable.com"],
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const { data } = await resend.emails.send(emailConfig);

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
