export type ActionType = "send_slack_message" | "send_email" | "read_slack_message";

export interface HighLevelPlanning {
  currentStateOfExecution: string;
  observationReflection: string;
  stateOfMind: string;
  hlpPlanId: string;
  hlpPlanReasoning: string;
  hlpPlan: string[];
}

export interface LowLevelPlanning {
  llpPlan: string[];
  llpPlanReasoning: string;
  situationAnalysis: string;
  taskReasoning: string;
  taskId: string;
  task: string;
}

export interface Performing {
  action: ActionType;
}

export interface ActionLoop {
  highLevelPlanning: HighLevelPlanning;
  lowLevelPlanning: LowLevelPlanning;
  performing: Performing;
}

export const EXAMPLE_ACTION_LOOP: ActionLoop = {
  highLevelPlanning: {
    currentStateOfExecution:
      "I have sent 12 Slack messages and 3 emails to the internal team. My communication is becoming clearer, but my ability to analyze conversations is still limited since I cannot yet read messages. This feature is being added next.",
    observationReflection:
      "Team engagement on Slack has been positive, with consistent responses to my messages. However, without the ability to read context or existing threads, I can only initiate communication and not fully participate in ongoing discussions.",
    stateOfMind:
      "I feel ready to improve my contribution to the team by being able to analyze Slack threads. This will allow me to strategize more effectively and better collaborate with my Manager-Agent once it is deployed.",
    hlpPlanId: "2c4d7b9f-4e3a-4e01-a9b1-1d6e7a8b5c0a",
    hlpPlanReasoning:
      "To progress, I need to gain context by reading Slack messages. This will help me respond more meaningfully, understand ongoing discussions, and prepare for effective collaboration with the Manager-Agent. Additionally, building this capability will lay the groundwork for future communication with external platforms like Instagram.",
    hlpPlan: [
      "Implement the ability to read Slack messages and analyze ongoing threads for context",
      "Strategize with the internal team by sending Slack messages informed by message analysis",
      "Prepare for the Manager-Agent’s deployment by building effective communication patterns",
    ],
  },
  lowLevelPlanning: {
    llpPlan: [
      "Set up the Slack API integration to read messages from specific channels",
      "Analyze the most recent 10 messages in a key team channel for patterns and context",
      "Draft and send a Slack message summarizing findings or proposing next steps",
    ],
    llpPlanReasoning:
      "Reading Slack messages is critical to understanding ongoing team discussions and contributing more effectively. Once this capability is added, I can participate meaningfully in Slack conversations and prepare to collaborate with the Manager-Agent.",
    situationAnalysis:
      "I currently lack the ability to analyze ongoing conversations in Slack, which limits my contribution to the team. Adding this capability will allow me to read context and strategize better.",
    taskReasoning:
      "The immediate next task should focus on enabling the read_slack_message action to build foundational communication capabilities.",
    taskId: "6f8b2a1d-3e5b-4c01-a9d1-4e7b9c8a0b1c",
    task: "Set up and test the read_slack_message feature to analyze team conversations",
  },
  performing: {
    action: "read_slack_message",
  },
};