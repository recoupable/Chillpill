interface ConversationMemory {
  lastTopic: string;
  messageHistory: {
    timestamp: number;
    from: string;
    message: string;
    topic: string;
  }[];
  insights: {
    topics: Record<string, number>;
  };
}

export class ConversationStore {
  private memory: ConversationMemory = {
    lastTopic: '',
    messageHistory: [],
    insights: {
      topics: {}
    }
  };

  async addMessage(message: {
    from: string;
    text: string;
    topic: string;
  }) {
    // Add message to history
    this.memory.messageHistory.push({
      timestamp: Date.now(),
      from: message.from,
      message: message.text,
      topic: message.topic
    });
    
    // Update topic tracking
    this.memory.insights.topics[message.topic] = 
      (this.memory.insights.topics[message.topic] || 0) + 1;
    
    // Update last topic
    this.memory.lastTopic = message.topic;

    console.log('Added message:', {
      from: message.from,
      topic: message.topic,
      totalMessages: this.memory.messageHistory.length
    });
  }

  getMemory(): ConversationMemory {
    return this.memory;
  }

  getRecentMessages(count: number = 5) {
    return this.memory.messageHistory.slice(-count);
  }
}

export const conversationStore = new ConversationStore();