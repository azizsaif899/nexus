import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth - فحص حالة المصادقة
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'auth',
    message: 'Authentication service is running'
  });
}

// POST /api/auth - تسجيل الدخول
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // التحقق من البيانات الأساسية
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // منطق المصادقة (مؤقت)
    // TODO: ربط مع Firebase Auth
    const mockUser = {
      id: '1',
      email: email,
      name: 'Test User',
      role: 'user'
    };

    return NextResponse.json({
      success: true,
      user: mockUser,
      message: 'Login successful'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}