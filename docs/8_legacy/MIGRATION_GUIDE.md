# 🔄 AzizSys Migration Guide

## Overview
Complete guide for migrating from the legacy Google Apps Script system to the new TypeScript NestJS architecture.

**Migration Status**: Phase 1 Complete ✅  
**Current Phase**: Phase 2 - Service Integration  
**Target Architecture**: NestJS + TypeScript + Nx Monorepo

---

## 🏗️ Architecture Comparison

### Legacy System (Before)
```
Google Apps Script (JavaScript)
├── src/AI/Core.js (Business Logic)
├── src/Config.js (Sheet-based Config)
├── src/Tools/Sheets.js (Direct Sheet Access)
└── src/Utils.js (Utility Functions)
```

### New System (After)
```
NestJS + TypeScript Monorepo
├── apps/api/ (NestJS Backend)
├── apps/web-chatbot/ (React Frontend)
├── apps/admin-dashboard/ (React Admin)
├── apps/sheets-addon/ (Apps Script Proxy)
└── packages/core-logic/ (Shared Services)
```

---

## 📋 Migration Phases

### ✅ Phase 1: Foundation (Completed)
- [x] NestJS API Gateway setup
- [x] TypeScript configuration
- [x] Authentication system (JWT)
- [x] Frontend-Backend integration
- [x] Shared API client library

### ✅ Phase 2: Core Services (Completed)
- [x] AI.Core → AiCoreService migration
- [x] Config → NestJS ConfigModule
- [x] Testing infrastructure setup
- [x] CI/CD pipeline integration

### 🔄 Phase 3: Data Layer (In Progress)
- [x] BigQuery client enhancement
- [x] Apps Script proxy refactor
- [ ] Real Google APIs integration
- [ ] Database schema migration

### 📅 Phase 4: Advanced Features (Planned)
- [ ] WebSocket real-time features
- [ ] Advanced AI orchestration
- [ ] Performance optimization
- [ ] Production deployment

---

## 🔧 Migration Patterns

### 1. Service Migration Pattern

**Before (Legacy)**:
```javascript
// src/AI/Core.js
function processQuery(prompt, context) {
  // Direct implementation
  return result;
}
```

**After (New)**:
```typescript
// packages/core-logic/src/services/ai-core.service.ts
@Injectable()
export class AiCoreService {
  constructor(private geminiClient: GeminiClient) {}
  
  async processQuery(request: AiRequest): Promise<AiResponse> {
    // Clean, testable implementation
  }
}
```

### 2. Configuration Migration Pattern

**Before (Legacy)**:
```javascript
// src/Config.js
const config = Config.get('API_KEY');
```

**After (New)**:
```typescript
// Using NestJS ConfigService
constructor(private configService: ConfigService) {}

const apiKey = this.configService.get<string>('API_KEY');
```

### 3. Testing Pattern

**Before**: No systematic testing

**After**:
```typescript
describe('AiCoreService', () => {
  let service: AiCoreService;
  let mockGeminiClient: jest.Mocked<GeminiClient>;
  
  beforeEach(async () => {
    // Proper DI testing setup
  });
  
  it('should process query successfully', async () => {
    // 100% test coverage
  });
});
```

---

## 📦 Package Structure

### Core Logic Package
```
packages/core-logic/
├── src/
│   ├── services/
│   │   ├── ai-core.service.ts
│   │   └── ai-core.service.test.ts
│   ├── clients/
│   │   ├── gemini-client.ts
│   │   └── bigquery-client.ts
│   └── utils/
│       ├── date-helper.ts
│       └── date-helper.test.ts
└── package.json
```

### API Application
```
apps/api/
├── src/
│   ├── auth/ (Authentication Module)
│   ├── query/ (AI Query Module)
│   ├── config/ (Configuration)
│   └── common/ (Shared Components)
└── package.json
```

---

## 🔄 Step-by-Step Migration Process

### Step 1: Analyze Legacy Code
```bash
# Use our analysis documents
docs/migration/sheets-client-analysis.md
docs/migration/config-module-analysis.md
```

### Step 2: Create TypeScript Service
```typescript
// 1. Create service class
@Injectable()
export class NewService {
  constructor(private dependencies: Dependency) {}
}

// 2. Write comprehensive tests
describe('NewService', () => {
  // Test all methods
});

// 3. Integrate with NestJS module
@Module({
  providers: [NewService],
  exports: [NewService]
})
```

### Step 3: Update Dependencies
```typescript
// Replace legacy calls
// OLD: Utils.executeSafely(...)
// NEW: try/catch with proper logging

// OLD: Config.get('key')
// NEW: this.configService.get<string>('key')
```

### Step 4: Test Integration
```bash
npm run test
npm run test:e2e
npm run lint
```

---

## 🧪 Testing Strategy

### Unit Tests
- **Coverage Target**: 100% for core services
- **Framework**: Jest + @nestjs/testing
- **Pattern**: Mock all dependencies

### Integration Tests
- **Scope**: API endpoints with real services
- **Database**: Test database or mocks
- **Authentication**: Mock JWT tokens

### E2E Tests
- **Framework**: Supertest
- **Scope**: Complete user flows
- **Environment**: Isolated test environment

---

## 🚀 Deployment Strategy

### Development Environment
```bash
# Start all services
npm run dev

# Individual services
npm run api:dev
npm run web:dev
npm run admin:dev
```

### Production Environment
```bash
# Build all applications
npm run build

# Deploy API
npm run deploy:api

# Deploy frontends
npm run deploy:web
npm run deploy:admin
```

---

## 📊 Migration Checklist

### Pre-Migration
- [ ] Analyze legacy code structure
- [ ] Identify dependencies and data flows
- [ ] Create migration plan document
- [ ] Set up new project structure

### During Migration
- [ ] Create TypeScript interfaces
- [ ] Implement service classes
- [ ] Write comprehensive tests
- [ ] Update configuration system
- [ ] Integrate with NestJS modules

### Post-Migration
- [ ] Run legacy code checker
- [ ] Verify all tests pass
- [ ] Update documentation
- [ ] Deploy to staging environment
- [ ] Performance testing

---

## ⚠️ Common Pitfalls

### 1. Incomplete Dependency Injection
**Problem**: Direct instantiation instead of DI
**Solution**: Use NestJS providers and constructors

### 2. Missing Error Handling
**Problem**: Legacy code had Utils.executeSafely wrapper
**Solution**: Implement proper try/catch with logging

### 3. Configuration Hardcoding
**Problem**: Hardcoded values from legacy system
**Solution**: Use ConfigService with environment variables

### 4. Insufficient Testing
**Problem**: No tests for migrated code
**Solution**: Write tests first, then migrate

---

## 🔍 Quality Gates

### Code Quality
- TypeScript strict mode enabled
- ESLint rules enforced
- Prettier formatting applied
- No legacy code patterns detected

### Testing Quality
- Unit test coverage > 80%
- Integration tests for all endpoints
- E2E tests for critical flows
- Performance benchmarks met

### Documentation Quality
- All public APIs documented
- Migration steps recorded
- Deployment guides updated
- Troubleshooting guides created

---

## 📞 Support & Resources

### Documentation
- [Developer Guide](../2_developer_guide/AzizSys_Developer_Guide.md)
- [API Documentation](http://localhost:3333/api/docs)
- [Testing Strategy](../testing/TESTING_STRATEGY.md)

### Tools
- **Legacy Code Checker**: `npm run check:legacy`
- **Test Coverage**: `npm run test:coverage`
- **API Health**: `npm run health:check`

### Migration Status
- **Completed**: 70% of core functionality
- **In Progress**: Data layer and advanced features
- **Remaining**: Production optimization and deployment

---

*Migration Guide maintained by the AzizSys Development Team*  
*Last Updated: 2025-01-09*