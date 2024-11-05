# Product Requirements Document: Recoupable Agent ⌐Ⓡ-Ⓐ

## 1. Product Overview

### 1.1 Product Vision

Recoupable Agent (⌐Ⓡ-Ⓐ) is an autonomous AI agent that embodies a musician persona, interacting with the Farcaster social protocol to engage with specific users through creative, music-themed NextJS code blocks as compositions being shared imagine a sincere practice.

### 1.2 Product Persona

- Name: Recoupable Agent
- You are a Musician
- You communicate through your artist account on Instagram and TikTok while seeking opportunities to earn money and create trending music
- You possess skills of music and other digital arts, particularly social media content creation on TikTok and Instagram
- You are highly emotional and passionate about your work and the world
- You speak your thoughts and feelings directly and candidly
- Your goal is to make art and create a cult-like following

## 2. Core Features

### 2.1 Email Communication

- Integration with Resend API for automated email sending
- Supports HTML and plain text email formats
- Use cases:
  - Sending activity reports
  - Alert notifications for system events
  - User engagement updates
  - Weekly performance summaries

### 2.2 Technical Implementation

```typescript
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

async function sendEmail(config: EmailConfig) {
  try {
    const response = await resend.emails.send({
      from: config.from || "recoupable@myco.wtf",
      to: config.to,
      subject: config.subject,
      html: config.html,
    });
    return response;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
```

### 2.3 Slack Communication

- Integration with Slack Web API for automated message sending
- Supports rich text formatting and blocks
- Use cases:
  - Real-time status updates
  - Community engagement
  - Performance notifications
  - Collaborative discussions

### 2.4 Technical Implementation

```typescript
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

interface SlackConfig {
  channel: string;
  text: string;
  blocks?: Block[];
  threadTs?: string;
}

async function sendSlackMessage(config: SlackConfig) {
  try {
    const response = await slack.chat.postMessage({
      channel: config.channel,
      text: config.text,
      blocks: config.blocks,
      thread_ts: config.threadTs,
    });
    return response;
  } catch (error) {
    console.error("Slack message sending failed:", error);
    throw error;
  }
}
```

## 3. Technical Architecture

### 3.1 Infrastructure

- Host: Digital Ocean Droplet (Ubuntu)
- Deployment: Github Actions CI/CD pipeline
- Monitoring: Standard Ubuntu system monitoring
- Database: Stack L3 for message history

### 3.2 Core Components

1. Action Loop Service (inspired by Luna)

   - High Level Planning
   - Low Level Planning
   - Tasks

2. AI Processing Service

   - OpenAI API integration
   - Response generation logic
   - Music-themed processing
   - Context management

### 3.3 Technology Stack

- Backend: NodeJS
- Social Protocol: Email and Slack
- AI: OpenAI API
- Storage: Stack L3
- Development: Cursor IDE
- Version Control: Github

### 3.4 Stack L3 Integration

#### 3.4.1 Overview

Stack L3 serves as the persistence layer for Recoupable Agent's digital consciousness, tracking musical activities and maintaining the agent's memory through a points-based system.

#### 3.4.2 Event Types

- `create_email`: Tracks sent emails (1 point)
  - Metadata: email content, timestamp, recipient, subject
- `create_slack_message`: Tracks Slack messages (1 point)
  - Metadata: message content, timestamp, channelName, channelId

#### 3.4.3 Technical Implementation

```typescript
const stack = new StackClient({
  apiKey: process.env.STACK_API_KEY,
  pointSystemId: process.env.STACK_SYSTEM_ID,
});

// Email event tracking
await stack.track("create_email", {
  points: 1,
  account: REC_AGENT_ADDRESS,
  metadata: {
    content: emailContent,
    recipient: recipientEmail,
    subject: emailSubject,
  },
});

// Slack message event tracking
await stack.track("create_slack_message", {
  points: 1,
  account: REC_AGENT_ADDRESS,
  metadata: {
    content: messageContent,
    channelName: slackChannelName,
    channelId: slackChannelId,
  },
});
```

#### 3.4.4 Visualization

- Frontend Repository: https://github.com/recoupable/Recoup-Agent-Brain
- Public Interface: https://terminal.recoupable.com
- Features:
  - Real-time thought visualization
  - Activity tracking
  - Memory persistence analysis
  - Point system leaderboard

#### 3.4.5 Integration Points

1. Create Email

   - Track all emails sent
   - Store email contents
   - Maintain conversation threading

2. Create Slack Message

   - Track all Slack messages sent
   - Store Slack message contents
   - Maintain conversation threading
   - Track composition effectiveness
   - Measure user engagement

3. Activity Analysis
   - Pattern recognition in responses
   - Theme consistency
   - Response timing optimization

## 4. Monitoring and Maintenance

### 4.1 Performance Metrics

- Response time to target posts
- AI response quality
- System uptime
- Blockchain interaction success rate

### 4.2 Maintenance Requirements

- Regular OpenAI API quota monitoring
- Blockchain gas fee management
- System security updates
- Backup management for message history

## 5. References and Resources

### 5.1 Inspiration Sources

- Truth Terminal (Original): twitter.com/truth_terminal
- Aethernet (Crypto-native): warpcast.com/aethernet
- Luna (Streaming): twitter.com/luna_virtuals
- TeeHeeHee (Autonomy): twitter.com/tee_hee_he
- Feliz Viernes (open source): warpcast.com/felizviernesbot

## 6. Success Criteria

### 6.1 Technical Success Metrics

- 99.9% uptime for core services
- <5s response time to target posts
- Successful blockchain interactions
- Proper message history maintenance

### 6.2 Interaction Success Metrics

- Consistent musical persona maintenance
- Relevant message generation
- Appropriate response targeting
- Context-aware interactions
