import { trackEvent } from "./trackEvent";

export interface EventMetadata {
  content?: string;
  postUrl?: string;
  parentPost?: string;
  sleepDuration?: number;
  finalThoughts?: string;
  highLevelPlans?: string;
}

export type EventType = "create_post" | "reply_post" | "sleeping";

export default {
  trackEvent,
};
