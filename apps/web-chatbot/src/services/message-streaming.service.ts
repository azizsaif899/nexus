import { chatService, StreamingMessage, ChatMessage } from "./chat.service";

export interface StreamChunk {
  text: string;
  isComplete: boolean;
  timestamp: Date;
}

export interface StreamHandler {
  onChunk: (chunk: StreamChunk) => void;
  onComplete: (fullMessage: string) => void;
  onError: (error: string) => void;
}

export class MessageStreamingHandler {
  private activeStreams: Map<
    string,
    {
      chunks: string[];
      handler: StreamHandler;
      sessionId: string;
      startTime: Date;
    }
  > = new Map();

  // بدء streaming لرسالة
  startStreaming(sessionId: string, handler: StreamHandler): string {
    const streamId = `stream-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.activeStreams.set(streamId, {
      chunks: [],
      handler,
      sessionId,
      startTime: new Date(),
    });

    console.log(
      `Started streaming session: ${streamId} for session: ${sessionId}`
    );
    return streamId;
  }

  // إضافة chunk جديد للـ stream
  addChunk(streamId: string, chunk: StreamChunk): void {
    const stream = this.activeStreams.get(streamId);
    if (!stream) {
      console.warn(`Stream ${streamId} not found`);
      return;
    }

    // إضافة الـ chunk للقائمة
    stream.chunks.push(chunk.text);

    // استدعاء معالج الـ chunk
    stream.handler.onChunk(chunk);

    // إذا كان الـ chunk الأخير، أنهِ الـ streaming
    if (chunk.isComplete) {
      this.completeStream(streamId);
    }
  }

  // إنهاء الـ streaming
  completeStream(streamId: string): void {
    const stream = this.activeStreams.get(streamId);
    if (!stream) {
      console.warn(`Stream ${streamId} not found for completion`);
      return;
    }

    const fullMessage = stream.chunks.join("");
    const duration = Date.now() - stream.startTime.getTime();

    console.log(`Completed streaming ${streamId} in ${duration}ms`);

    // استدعاء معالج الإكمال
    stream.handler.onComplete(fullMessage);

    // إزالة الـ stream من النشطة
    this.activeStreams.delete(streamId);
  }

  // إلغاء الـ streaming
  cancelStream(streamId: string): void {
    const stream = this.activeStreams.get(streamId);
    if (!stream) {
      return;
    }

    console.log(`Cancelled streaming: ${streamId}`);

    // استدعاء معالج الخطأ
    stream.handler.onError("Streaming cancelled by user");

    // إزالة الـ stream
    this.activeStreams.delete(streamId);
  }

  // معالجة خطأ في الـ streaming
  handleStreamError(streamId: string, error: string): void {
    const stream = this.activeStreams.get(streamId);
    if (!stream) {
      return;
    }

    console.error(`Streaming error ${streamId}:`, error);

    // استدعاء معالج الخطأ
    stream.handler.onError(error);

    // إزالة الـ stream
    this.activeStreams.delete(streamId);
  }

  // الحصول على حالة الـ stream
  getStreamStatus(streamId: string): {
    isActive: boolean;
    chunksCount: number;
    sessionId: string;
    duration: number;
  } | null {
    const stream = this.activeStreams.get(streamId);
    if (!stream) {
      return null;
    }

    return {
      isActive: true,
      chunksCount: stream.chunks.length,
      sessionId: stream.sessionId,
      duration: Date.now() - stream.startTime.getTime(),
    };
  }

  // الحصول على جميع الـ streams النشطة
  getActiveStreams(): string[] {
    return Array.from(this.activeStreams.keys());
  }

  // إلغاء جميع الـ streams النشطة
  cancelAllStreams(): void {
    const streamIds = Array.from(this.activeStreams.keys());
    streamIds.forEach((id) => this.cancelStream(id));
  }

  // إنشاء StreamingMessage من ChatMessage
  createStreamingMessage(chatMessage: ChatMessage): StreamingMessage {
    return {
      id: chatMessage.id,
      text: chatMessage.text,
      isComplete: true, // افتراضياً مكتمل
      sessionId: chatMessage.sessionId,
    };
  }

  // تحويل StreamingMessage إلى ChatMessage
  streamingToChatMessage(
    streamingMessage: StreamingMessage,
    sender: "user" | "ai" = "ai"
  ): ChatMessage {
    return chatService.createChatMessage(
      streamingMessage.text,
      sender,
      streamingMessage.sessionId,
      {
        messageType: streamingMessage.isComplete ? "text" : "streaming",
        isComplete: streamingMessage.isComplete,
      }
    );
  }

  // إعداد streaming مع WebSocket (للمستقبل)
  setupWebSocketStreaming(sessionId: string): StreamHandler {
    // TODO: تكامل مع WebSocket Client
    console.log(`Setting up WebSocket streaming for session: ${sessionId}`);

    return {
      onChunk: (chunk) => {
        console.log("Received streaming chunk:", chunk);
      },
      onComplete: (fullMessage) => {
        console.log("Streaming completed:", fullMessage);
      },
      onError: (error) => {
        console.error("Streaming error:", error);
      },
    };
  }

  // محاكاة streaming للاختبار (بدون WebSocket)
  simulateStreaming(
    fullMessage: string,
    streamId: string,
    chunkSize: number = 10,
    delay: number = 100
  ): void {
    const chunks = this.splitIntoChunks(fullMessage, chunkSize);
    let currentIndex = 0;

    const sendNextChunk = () => {
      if (currentIndex >= chunks.length) {
        // إرسال chunk الأخير مع isComplete = true
        this.addChunk(streamId, {
          text: "",
          isComplete: true,
          timestamp: new Date(),
        });
        return;
      }

      const chunk = chunks[currentIndex];
      const isLast = currentIndex === chunks.length - 1;

      this.addChunk(streamId, {
        text: chunk,
        isComplete: false,
        timestamp: new Date(),
      });

      currentIndex++;

      if (!isLast) {
        setTimeout(sendNextChunk, delay);
      } else {
        // إرسال chunk فارغ للإكمال
        setTimeout(() => {
          this.addChunk(streamId, {
            text: "",
            isComplete: true,
            timestamp: new Date(),
          });
        }, delay);
      }
    };

    sendNextChunk();
  }

  // تقسيم النص إلى chunks
  private splitIntoChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // تنظيف الموارد
  destroy(): void {
    this.cancelAllStreams();
  }
}

export const messageStreamingHandler = new MessageStreamingHandler();
