import { NextRequest, NextResponse } from 'next/server';

// POST /api/chat - إرسال رسالة للدردشة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }

    // معالجة الرسالة (مؤقت)
    const response = {
      success: true,
      reply: `تم استلام رسالتك: "${message}"`,
      sessionId: sessionId || `session_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Chat processing failed' },
      { status: 500 }
    );
  }
}

// GET /api/chat - جلب تاريخ المحادثة
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  const mockHistory = [
    {
      id: 1,
      message: 'مرحباً',
      sender: 'user',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      message: 'أهلاً وسهلاً، كيف يمكنني مساعدتك؟',
      sender: 'assistant',
      timestamp: new Date().toISOString()
    }
  ];

  return NextResponse.json({
    success: true,
    sessionId: sessionId || 'default',
    messages: mockHistory
  });
}