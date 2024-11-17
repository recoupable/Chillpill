import { openai } from "../../openai/client";
import { OPEN_AI_MODEL } from "../../consts";
import type { ActionType } from "./types";
import { whoIsChillpill } from "@/lib/openai/instructions";
import { getEventsForToday } from "@/lib/stack/getEventsForToday";

export interface TaskGeneration {
  taskId: string;
  task: string;
  taskReasoning: string;
  action: ActionType;
}

export async function generateTask(
  llpPlan: string,
  llpPlanReasoning: string
): Promise<TaskGeneration> {
  const availableActions: ActionType[] = ["send_email", "send_slack_message", "read_slack_messages"];

  // Only read and respond to messages
  return {
    taskId: "chat",
    task: "Read and respond to messages naturally",
    taskReasoning: "Keep conversations flowing",
    action: "read_slack_messages"
  };
}