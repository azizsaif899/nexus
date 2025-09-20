# 📚 AzizSys API Documentation

## Overview
Complete API documentation for AzizSys AI Assistant

## Authentication
```
Authorization: Bearer <token>
```

## Endpoints

### Users API
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Analytics API
- `GET /api/analytics/reports` - Get reports
- `POST /api/analytics/generate` - Generate report

### AI API
- `POST /api/ai/chat` - Chat with AI
- `GET /api/ai/models` - Get AI models