import { NextRequest, NextResponse } from 'next/server';

// POST /api/webhook - معالجة Webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, data, event } = body;

    // معالجة حسب المصدر
    switch (source) {
      case 'whatsapp':
        return handleWhatsAppWebhook(data);
      case 'meta':
        return handleMetaWebhook(data);
      case 'odoo':
        return handleOdooWebhook(data);
      default:
        return NextResponse.json({
          success: true,
          message: 'Webhook received',
          source: source || 'unknown',
          timestamp: new Date().toISOString()
        });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// GET /api/webhook - فحص حالة Webhook
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoints: [
      '/api/webhook?source=whatsapp',
      '/api/webhook?source=meta',
      '/api/webhook?source=odoo'
    ],
    timestamp: new Date().toISOString()
  });
}

function handleWhatsAppWebhook(data: any) {
  return NextResponse.json({
    success: true,
    source: 'whatsapp',
    processed: true,
    data: data
  });
}

function handleMetaWebhook(data: any) {
  return NextResponse.json({
    success: true,
    source: 'meta',
    processed: true,
    data: data
  });
}

function handleOdooWebhook(data: any) {
  return NextResponse.json({
    success: true,
    source: 'odoo',
    processed: true,
    data: data
  });
}