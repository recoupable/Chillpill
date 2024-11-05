import { trackEvent } from "./trackEvent";

export interface EventMetadata {
  content?: string;
  recipient?: string;
  subject?: string;
}

export type EventType = "send_email" | "send_slack_message";

export default {
  trackEvent,
};
