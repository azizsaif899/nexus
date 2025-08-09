# مرجع API

## Google Apps Script Functions

### `processMessage(message: string): string`
معالجة رسالة المستخدم وإرجاع الرد

**المعاملات:**
- `message`: نص الرسالة من المستخدم

**الإرجاع:**
- `string`: رد المساعد الذكي

### `analyzeSheetData(): object`
تحليل بيانات الجدول الحالي

**الإرجاع:**
- `object`: نتائج التحليل

## REST API Endpoints

### `POST /api/chat`
إرسال رسالة للمساعد الذكي

**Body:**
```json
{
  "message": "نص الرسالة",
  "userId": "معرف المستخدم"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "رد المساعد",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### `GET /api/analytics`
الحصول على إحصائيات الاستخدام

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMessages": 1000,
    "activeUsers": 50,
    "averageResponseTime": 1.2
  }
}
```

## Core Logic Classes

### `GeminiClient`
عميل للتواصل مع Gemini API

### `BigQueryClient`
عميل للتواصل مع BigQuery