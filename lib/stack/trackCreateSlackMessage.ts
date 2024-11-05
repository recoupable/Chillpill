import { FELIZ_VIERNES_ADDRESS } from "../consts";
import { trackEvent } from "./trackEvent";

export async function trackCreateSlackMessage(
  content: string,
  channelId: string,
  timestamp: string
) {
  await trackEvent("create_slack_message", FELIZ_VIERNES_ADDRESS, {
    content,
    channelId,
    timestamp,
  });
}
