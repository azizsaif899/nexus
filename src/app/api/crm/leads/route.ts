import { NextResponse } from 'next/server';

// GET /api/crm/leads - جلب العملاء المحتملين
export async function GET() {
  try {
    // بيانات تجريبية مأخوذة من المشروع الأصلي
    const leads = [
      {
        id: 1,
        name: 'Lead from Meta',
        partner_name: 'أحمد علي',
        email: 'ahmed@example.com',
        source: 'Meta',
        stage: 'جديد',
        expected_revenue: 50000
      },
      {
        id: 2,
        name: 'WhatsApp Lead',
        partner_name: 'فاطمة محمد',
        email: 'fatima@example.com',
        source: 'WhatsApp',
        stage: 'متابعة',
        expected_revenue: 75000
      }
    ];

    return NextResponse.json({
      success: true,
      leads: leads,
      total: leads.length
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/crm/leads - إنشاء عميل محتمل جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, source } = body;

    // التحقق من البيانات المطلوبة
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // إنشاء lead جديد (مؤقت)
    const newLead = {
      id: Date.now(),
      name: name,
      partner_name: name,
      email: email,
      phone: phone || '',
      source: source || 'API',
      stage: 'جديد',
      expected_revenue: 0,
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      lead: newLead,
      message: 'Lead created successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create lead' },
      { status: 500 }
    );
  }
}