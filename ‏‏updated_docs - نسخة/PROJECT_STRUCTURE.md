# Project Structure Documentation

**Version**: 3.0.0  
**Last Updated**: ${new Date().toISOString()}

## 📁 Directory Structure

```
azizsys5/
├── src/                          # Source code
│   ├── agents/                   # AI Agents
│   │   ├── AgentCFO.gs          # Financial analysis agent
│   │   ├── AgentDeveloper.gs    # Code review agent
│   │   ├── AgentGeneral.gs      # General purpose agent
│   │   └── helpers.js           # Shared agent utilities
│   │
│   ├── core/                     # Core system modules
│   │   ├── ToolExecutor.gs      # Central tool execution
│   │   ├── IntentAnalyzer.gs    # Intent analysis with Few-shot
│   │   ├── Orchestrator.gs      # Agent orchestration
│   │   └── DataValidator.js     # Data quality validation
│   │
│   ├── services/                 # External service connectors
│   │   ├── documentAI.js        # Document AI integration
│   │   ├── vertexAI.js          # Vertex AI connector
│   │   ├── enhancedVertexAI.js  # Advanced Vertex AI features
│   │   └── intermediateStorage.js # BigQuery storage
│   │
│   ├── system/                   # System infrastructure
│   │   ├── auth.gs              # Authentication
│   │   ├── config.gs            # Configuration management
│   │   ├── hybridPDFProcessor.gs # PDF processing pipeline
│   │   ├── pipelineOrchestrator.gs # Pipeline coordination
│   │   ├── orchestratorMonitor.gs # System monitoring
│   │   └── userSettingsManager.gs # User preferences
│   │
│   ├── ui/                       # User interface
│   │   ├── Sidebar.html         # Main UI structure
│   │   ├── Sidebar.css          # Styling
│   │   ├── Sidebar.js           # Basic interactions
│   │   ├── Sidebar.enhanced.js  # Advanced UI features
│   │   └── uiController.gs      # UI backend controller
│   │
│   └── utils/                    # Utilities and helpers
│       ├── 00_utils.js          # Core utilities and DI system
│       ├── dependencyGrapher.gs # Dependency mapping
│       ├── startupValidator.gs  # System validation
│       ├── errorRouter.gs       # Error handling
│       └── systemLogger.gs      # Logging system
│
├── tests/                        # Test files
│   ├── toolExecutor.test.gs     # Tool executor tests
│   ├── pipeline.test.gs         # Pipeline integration tests
│   └── integrationTests.gs     # System integration tests
│
├── docs/                         # Documentation
│   ├── README_*.md              # Module documentation
│   ├── architecture.md          # System architecture
│   └── api/                     # API documentation
│
├── dist/                         # Built/compiled code
├── models/                       # AI models and configurations
│   ├── adaptive_model.json      # Adaptive AI model settings
│   └── embedding_flags.json     # Embedding processing flags
├── metrics/                      # Performance monitoring
│   ├── alerts.yaml              # System alerts configuration
│   └── performance_logs/        # Performance tracking data
├── config/                       # System configuration
│   ├── kubernetes.yaml          # K8s deployment config
│   └── ssl_config.json          # SSL/TLS settings
├── embedding_processor.js        # Semantic search processor
├── depMap.json                   # Dependency mapping
├── CHANGELOG.md                  # Version history
└── PROJECT_STRUCTURE.md         # This file
```

## 📋 File Naming Conventions

### Modules
- **Core modules**: `PascalCase.gs` (e.g., `ToolExecutor.gs`)
- **Services**: `camelCase.js` (e.g., `documentAI.js`)
- **Utilities**: `camelCase.js` with prefix (e.g., `00_utils.js`)

### Tests
- **Unit tests**: `moduleName.test.gs`
- **Integration tests**: `integrationTests.gs`
- **Pipeline tests**: `pipeline.test.gs`

### Documentation
- **Module docs**: `README_ModuleName.md`
- **Architecture**: `architecture.md`
- **API docs**: `api/ModuleName.md`

## 🏗️ Module Organization

### Core Modules (`src/core/`)
Essential system functionality that other modules depend on.

### Services (`src/services/`)
External service integrations and connectors.

### Agents (`src/agents/`)
AI agents with specialized capabilities.

### System (`src/system/`)
Infrastructure and system-level functionality.

### UI (`src/ui/`)
User interface components and controllers.

### Utils (`src/utils/`)
Shared utilities and helper functions.

## 📦 Dependency Management

Dependencies are managed through:
1. **Dependency Injection**: Central DI container
2. **Dependency Mapping**: Auto-generated `depMap.json`
3. **Module Registration**: `defineModule()` pattern

## 🧪 Testing Strategy

### Test Organization
- **Unit Tests**: Individual module testing
- **Integration Tests**: Cross-module functionality
- **Pipeline Tests**: End-to-end workflows
- **System Tests**: Full system validation

### Test Coverage Goals
- **Core modules**: 90%+ coverage
- **Services**: 80%+ coverage
- **Agents**: 70%+ coverage
- **UI**: 60%+ coverage

## 📚 Documentation Standards

### JSDoc Requirements
All functions must include:
```javascript
/**
 * Function description
 * @param {type} paramName - Parameter description
 * @returns {type} Return value description
 * @throws {Error} Error conditions
 * @example
 * // Usage example
 * @since 3.0.0
 * @version 1.2.0
 */
```

### Module Documentation
Each module requires:
- Purpose and functionality
- Usage examples
- API reference
- Dependencies
- Version history

## 🔄 Build Process

1. **Dependency Analysis**: Generate dependency graph
2. **Code Validation**: JSDoc and syntax checking
3. **Testing**: Run all test suites
4. **Compilation**: Combine modules for deployment
5. **Deployment**: Push to Google Apps Script

## 📈 Maintenance Guidelines

### Code Quality
- Follow JSDoc standards
- Maintain test coverage
- Regular dependency updates
- Performance monitoring

### Version Management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog maintenance
- Module version tracking
- Breaking change documentation

This structure ensures maintainability, scalability, and professional development standards.