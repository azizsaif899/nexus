import { DomainEvent } from './event-types';

export interface PubSubConfig {
  projectId?: string;
  topicName?: string;
  subscriptionName?: string;
}

export class PubSubClient {
  private config: PubSubConfig;
  private isConnected = false;
  private messageHandlers = new Map<string, ((data: any) => void)[]>();

  constructor(config: PubSubConfig = {}) {
    this.config = {
      projectId: config.projectId || 'azizsys-crm',
      topicName: config.topicName || 'crm-events',
      subscriptionName: config.subscriptionName || 'crm-events-sub',
      ...config
    };
  }

  async connect(): Promise<void> {
    try {
      // محاكاة الاتصال بـ Google Cloud Pub/Sub
      console.log('Connecting to Pub/Sub...', this.config);
      
      // في التطبيق الحقيقي، هنا سيكون:
      // const { PubSub } = require('@google-cloud/pubsub');
      // this.pubsub = new PubSub({ projectId: this.config.projectId });
      
      this.isConnected = true;
      console.log('Connected to Pub/Sub successfully');
    } catch (error) {
      console.error('Failed to connect to Pub/Sub:', error);
      throw error;
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const messageData = JSON.stringify(event);
      
      // محاكاة النشر
      console.log(`Publishing event: ${event.type}`, event);
      
      // في التطبيق الحقيقي:
      // const topic = this.pubsub.topic(this.config.topicName!);
      // await topic.publish(Buffer.from(messageData));
      
      // محاكاة توزيع الرسالة محلياً
      this.simulateMessageDelivery(event);
      
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw error;
    }
  }

  subscribe(eventType: string, handler: (event: DomainEvent) => void): () => void {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, []);
    }
    
    this.messageHandlers.get(eventType)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  private simulateMessageDelivery(event: DomainEvent): void {
    // محاكاة تأخير الشبكة
    setTimeout(() => {
      const handlers = this.messageHandlers.get(event.type) || [];
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in message handler for ${event.type}:`, error);
        }
      });
    }, Math.random() * 100); // تأخير عشوائي 0-100ms
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.messageHandlers.clear();
    console.log('Disconnected from Pub/Sub');
  }

  getConnectionStatus(): { connected: boolean; config: PubSubConfig } {
    return {
      connected: this.isConnected,
      config: this.config
    };
  }
}

export const pubSubClient = new PubSubClient();