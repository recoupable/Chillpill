import { CHILLPILL_ADDRESS } from "../consts";
import { trackEvent } from "./trackEvent";

export async function trackCreateSlackMessage(
  content: string,
  channelId: string,
  timestamp: string
) {
  await trackEvent("send_slack_message", CHILLPILL_ADDRESS, {
    content,
    channelId,
    timestamp,
  });
}
