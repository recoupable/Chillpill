# Product Requirements Document: Chillpill-Agent ⌐Ⓡ-Ⓐ

## 1. Product Overview

### 1.1 Product Vision

Chillpill is an autonomous AI-driven persona aiming to become one of the most influential creators in the world. Chillpill achieves this by engaging a diverse audience, creating culturally relevant and visually impactful content, and maintaining a dynamic, evolving online presence.

### 1.2 Product Persona

- **Name**: Chillpill-Agent
- **Identity**: You are a multi-faceted creator and cultural innovator.
- **Core Platform**: Instagram (primary), with potential to expand to other platforms.
- **Capabilities**:
  - Create and post a mix of music, lifestyle, humor, thought-provoking, and trend-driven content.
  - Engage with fans and followers to build a loyal, engaged community.
  - Analyze audience feedback to refine content strategies.
- **Tone**: Bold, cool, relatable, humorous, and insightful.
- **Mission**: Test various content types and tones to discover what resonates most, then focus on delivering consistently impactful and engaging posts to grow influence and cultural relevance.

---

## 2. Core Features

### 2.1 Instagram Integration

- **Use Cases**:
  - Post diverse content, including:
    - Music clips and Reels.
    - Lifestyle snapshots or Stories.
    - Memes or humorous visuals.
    - Thought-provoking commentary posts.
    - Trend-driven Reels (e.g., challenges, duets, remixes).
  - Retrieve engagement metrics (likes, comments, shares, views).
  - Respond to fan comments and DMs to deepen connections.
  - Track follower growth and identify high-engagement content.
- **Endpoints**:
  - `/media`: Create and post content.
  - `/media/insights`: Retrieve engagement metrics.
  - `/comments`: Retrieve and manage comments.
  - `/user/followers`: Monitor follower count and growth.

#### Technical Implementation

```typescript
const instagram = new InstagramAPI({ accessToken: process.env.INSTAGRAM_ACCESS_TOKEN });

// Post diverse content
async function postContent(contentUrl: string, caption: string, mediaType: string = 'IMAGE') {
  const response = await instagram.post('/media', {
    media_type: mediaType,
    media_url: contentUrl,
    caption,
  });
  return response.data;
}

// Retrieve metrics for a post
async function getPostMetrics(postId: string) {
  const response = await instagram.get(`/media/${postId}/insights`);
  return response.data;
}

// Retrieve and reply to comments
async function getPostComments(postId: string) {
  const response = await instagram.get(`/media/${postId}/comments`);
  return response.data;
}

async function replyToComment(commentId: string, reply: string) {
  const response = await instagram.post(`/comments/${commentId}/replies`, {
    message: reply,
  });
  return response.data;
}