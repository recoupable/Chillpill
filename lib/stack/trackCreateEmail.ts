import { CHILLPILL_ADDRESS } from "../consts";
import { trackEvent } from "./trackEvent";

export async function trackCreateEmail(
  content: string,
  subject: string,
  recipient: string
) {
  await trackEvent("send_email", CHILLPILL_ADDRESS, {
    content,
    recipient,
    subject,
  });
}
