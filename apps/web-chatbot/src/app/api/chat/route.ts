// Chat API endpoint for Next.js

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
  timestamp: string;
}

async function handleChatRequest(request: ChatRequest): Promise<ChatResponse> {
  try {
    const { message } = request;

    const responses = [
      'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      'أفهم سؤالك. دعني أساعدك في ذلك.',
      'هذا سؤال ممتاز! إليك ما أعرفه...',
      'يمكنني مساعدتك في هذا الأمر.',
      'شكراً لك على السؤال. إليك الإجابة...'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      response: `${randomResponse}\n\nسؤالك: "${message}"\n\nهذه استجابة تجريبية من النظام.`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Chat API error:', error);
    return {
      success: false,
      error: 'حدث خطأ في معالجة الرسالة',
      timestamp: new Date().toISOString()
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await handleChatRequest(body);
    return Response.json(result);
  } catch (error) {
    console.error('API route error:', error);
    return Response.json({
      success: false,
      error: 'خطأ في الخادم',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}