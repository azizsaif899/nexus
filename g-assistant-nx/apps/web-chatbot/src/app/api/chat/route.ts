import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const responses = [
      'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      'أفهم سؤالك. دعني أساعدك في ذلك.',
      'هذا سؤال ممتاز! إليك ما أعرفه...',
      'يمكنني مساعدتك في هذا الأمر.',
      'شكراً لك على السؤال. إليك الإجابة...'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      response: `${randomResponse}\n\nسؤالك: "${message}"\n\nهذه استجابة تجريبية من النظام.`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في معالجة الرسالة' },
      { status: 500 }
    );
  }
}