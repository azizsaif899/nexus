# 🚀 دليل تنفيذ المرحلة السادسة: محرك الرؤى الاستباقية
## تحويل G-Assistant من نظام رد فعل إلى مساعد استباقي ذكي

[![Phase 6](https://img.shields.io/badge/Phase%206-Implementation-blue)](./PHASE6_IMPLEMENTATION_GUIDE.md)
[![Duration](https://img.shields.io/badge/Duration-30%20Days-green)](./OCTOBER_ROADMAP.md)
[![Priority](https://img.shields.io/badge/Priority-Critical-red)](./PHASE6_IMPLEMENTATION_GUIDE.md)

---

## 📋 نظرة عامة على المرحلة السادسة

### 🎯 الهدف الرئيسي:
تحويل G-Assistant من أداة سلبية تنتظر الأوامر إلى **شريك مالي ذكي استباقي** يكتشف الأنماط، يحذر من المخاطر، ويقترح التحسينات تلقائياً.

### 🏗️ المكونات الأساسية:
1. **مصنف النوايا المالي** (Financial Intent Classifier)
2. **محرك القواعد الذكية** (Smart Rule Engine)  
3. **نظام الإجراءات القابلة للتوصيل** (Pluggable Actions System)
4. **واجهة الرؤى التفاعلية** (Interactive Insights Dashboard)

---

## 🔧 المكون الأول: مصنف النوايا المالي

### 📊 التحدي الحالي:
النظام يتعامل مع جميع النصوص كـ "تقارير عامة"، بينما النص المالي له أنواع مختلفة تتطلب معالجة متخصصة.

### 💡 الحل المقترح:

#### 1. تعريف فئات النوايا المالية:
```javascript
// src/config/financial-intents.json
{
  "intents": {
    "PERFORMANCE_REPORT": {
      "description": "تقارير الأداء المالي",
      "keywords": ["أرباح", "خسائر", "نمو", "انخفاض", "أداء", "نتائج"],
      "examples": [
        "تقرير الأرباح للربع الثالث يظهر زيادة 15%",
        "انخفضت المبيعات هذا الشهر بنسبة 8%",
        "نمو الإيرادات السنوية وصل إلى 22%"
      ]
    },
    "ASSET_TRANSACTION": {
      "description": "معاملات الأصول",
      "keywords": ["شراء", "بيع", "استثمار", "أصول", "معدات", "عقارات"],
      "examples": [
        "تم شراء معدات جديدة بقيمة 50,000 دولار",
        "بيع المبنى القديم حقق ربحاً قدره 200,000 دولار",
        "استثمار في أسهم الشركة التقنية الناشئة"
      ]
    },
    "EXPENSE_LOG": {
      "description": "تسجيل المصروفات",
      "keywords": ["مصروفات", "تكاليف", "فواتير", "دفع", "سداد"],
      "examples": [
        "فاتورة الكهرباء لهذا الشهر 3,500 دولار",
        "مصروفات السفر للمؤتمر 8,200 دولار",
        "تكلفة الصيانة الشهرية 1,200 دولار"
      ]
    },
    "REVENUE_MILESTONE": {
      "description": "إنجازات الإيرادات",
      "keywords": ["إيرادات", "مبيعات", "دخل", "تحصيل", "عائد"],
      "examples": [
        "وصلت المبيعات الشهرية إلى مليون دولار",
        "تحصيل 95% من المستحقات المتأخرة",
        "عائد الاستثمار وصل إلى 18%"
      ]
    },
    "RISK_WARNING": {
      "description": "تحذيرات المخاطر",
      "keywords": ["خطر", "تحذير", "مشكلة", "انتباه", "قلق", "تهديد"],
      "examples": [
        "تحذير: انخفاض السيولة النقدية",
        "مشكلة في تحصيل المستحقات من العميل الكبير",
        "خطر تجاوز الميزانية المحددة للمشروع"
      ]
    }
  }
}
```

#### 2. تنفيذ مصنف النوايا:
```javascript
// src/services/intentClassifier.js
import { EmbeddingProcessor } from './embeddingProcessor.js';

class FinancialIntentClassifier {
  constructor() {
    this.embeddingProcessor = new EmbeddingProcessor();
    this.intents = require('../config/financial-intents.json');
    this.intentEmbeddings = new Map();
    this.initialize();
  }

  async initialize() {
    // إنشاء embeddings للأمثلة مرة واحدة وتخزينها
    for (const [intentName, intentData] of Object.entries(this.intents.intents)) {
      const examples = intentData.examples;
      const embeddings = await Promise.all(
        examples.map(example => this.embeddingProcessor.generateEmbedding(example))
      );
      
      this.intentEmbeddings.set(intentName, {
        embeddings: embeddings,
        description: intentData.description,
        keywords: intentData.keywords
      });
    }
  }

  async classifyIntent(text) {
    const textEmbedding = await this.embeddingProcessor.generateEmbedding(text);
    let bestMatch = { intent: 'UNKNOWN', confidence: 0 };

    for (const [intentName, intentData] of this.intentEmbeddings) {
      const similarities = intentData.embeddings.map(embedding => 
        this.calculateCosineSimilarity(textEmbedding, embedding)
      );
      
      const avgSimilarity = similarities.reduce((a, b) => a + b) / similarities.length;
      const keywordBonus = this.calculateKeywordBonus(text, intentData.keywords);
      const finalScore = avgSimilarity + keywordBonus;

      if (finalScore > bestMatch.confidence) {
        bestMatch = {
          intent: intentName,
          confidence: finalScore,
          description: intentData.description
        };
      }
    }

    return bestMatch;
  }

  calculateKeywordBonus(text, keywords) {
    const textLower = text.toLowerCase();
    const matchedKeywords = keywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    return matchedKeywords.length * 0.1; // 10% bonus per keyword
  }

  calculateCosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

export default FinancialIntentClassifier;
```

#### 3. اختبارات مصنف النوايا:
```javascript
// tests/intentClassifier.test.js
import FinancialIntentClassifier from '../src/services/intentClassifier.js';

describe('FinancialIntentClassifier', () => {
  let classifier;

  beforeAll(async () => {
    classifier = new FinancialIntentClassifier();
    await classifier.initialize();
  });

  test('should classify revenue text correctly', async () => {
    const result = await classifier.classifyIntent('زادت المبيعات بنسبة 15% هذا الربع');
    expect(result.intent).toBe('REVENUE_MILESTONE');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  test('should classify expense text correctly', async () => {
    const result = await classifier.classifyIntent('فاتورة الكهرباء 2500 دولار');
    expect(result.intent).toBe('EXPENSE_LOG');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  test('should classify risk warning correctly', async () => {
    const result = await classifier.classifyIntent('تحذير: انخفاض السيولة النقدية');
    expect(result.intent).toBe('RISK_WARNING');
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});
```

---

## ⚙️ المكون الثاني: محرك القواعد الذكية

### 📊 التحدي الحالي:
المنطق مثل `if (similarity > 0.8)` مكتوب بشكل ثابت داخل الوكلاء، مما يجعل النظام غير مرن وصعب الصيانة.

### 💡 الحل المقترح:

#### 1. هيكل القواعد المرن:
```json
// src/config/financial-rules.json
{
  "rules": [
    {
      "id": "high_value_asset_purchase",
      "name": "تنبيه المعاملات عالية القيمة",
      "description": "إشعار أصحاب المصلحة عند شراء أصول بقيمة عالية",
      "enabled": true,
      "priority": "HIGH",
      "trigger": {
        "intent": "ASSET_TRANSACTION",
        "conditions": [
          {
            "field": "transaction_type",
            "operator": "equals",
            "value": "purchase"
          },
          {
            "field": "amount",
            "operator": "greater_than",
            "value": 100000
          }
        ]
      },
      "actions": [
        {
          "type": "email_notification",
          "params": {
            "to": ["cfo@company.com", "finance-team@company.com"],
            "subject": "تنبيه: معاملة شراء عالية القيمة",
            "template": "high_value_transaction"
          }
        },
        {
          "type": "slack_notification",
          "params": {
            "channel": "#finance-alerts",
            "message": "🚨 تم رصد معاملة شراء بقيمة {{amount}} دولار"
          }
        }
      ]
    },
    {
      "id": "duplicate_report_detection",
      "name": "كشف التقارير المكررة",
      "description": "تحديد التقارير المتشابهة لتجنب التكرار",
      "enabled": true,
      "priority": "MEDIUM",
      "trigger": {
        "intent": "PERFORMANCE_REPORT",
        "conditions": [
          {
            "field": "semantic_similarity",
            "operator": "greater_than",
            "value": 0.95
          }
        ]
      },
      "actions": [
        {
          "type": "flag_as_duplicate",
          "params": {
            "confidence": "{{semantic_similarity}}"
          }
        },
        {
          "type": "log_event",
          "params": {
            "level": "INFO",
            "message": "تم رصد تقرير مكرر محتمل"
          }
        }
      ]
    },
    {
      "id": "cash_flow_warning",
      "name": "تحذير التدفق النقدي",
      "description": "تنبيه عند انخفاض التدفق النقدي المتوقع",
      "enabled": true,
      "priority": "CRITICAL",
      "trigger": {
        "intent": "RISK_WARNING",
        "conditions": [
          {
            "field": "cash_flow_change",
            "operator": "less_than",
            "value": -0.2
          }
        ]
      },
      "actions": [
        {
          "type": "urgent_notification",
          "params": {
            "to": ["ceo@company.com", "cfo@company.com"],
            "subject": "🚨 تحذير حرج: انخفاض التدفق النقدي",
            "priority": "URGENT"
          }
        },
        {
          "type": "create_task",
          "params": {
            "assignee": "finance-team",
            "title": "مراجعة عاجلة للتدفق النقدي",
            "due_date": "{{today + 1 day}}"
          }
        }
      ]
    }
  ]
}
```

#### 2. تنفيذ محرك القواعد:
```javascript
// src/services/ruleEngine.js
class SmartRuleEngine {
  constructor() {
    this.rules = require('../config/financial-rules.json').rules;
    this.operators = {
      'equals': (a, b) => a === b,
      'not_equals': (a, b) => a !== b,
      'greater_than': (a, b) => parseFloat(a) > parseFloat(b),
      'less_than': (a, b) => parseFloat(a) < parseFloat(b),
      'contains': (a, b) => String(a).toLowerCase().includes(String(b).toLowerCase()),
      'regex': (a, b) => new RegExp(b).test(a)
    };
  }

  async evaluateRules(data) {
    const triggeredRules = [];

    for (const rule of this.rules.filter(r => r.enabled)) {
      if (await this.evaluateRule(rule, data)) {
        triggeredRules.push({
          rule: rule,
          data: data,
          timestamp: new Date().toISOString()
        });
      }
    }

    return triggeredRules.sort((a, b) => 
      this.getPriorityWeight(a.rule.priority) - this.getPriorityWeight(b.rule.priority)
    );
  }

  async evaluateRule(rule, data) {
    // التحقق من النية
    if (rule.trigger.intent && data.intent !== rule.trigger.intent) {
      return false;
    }

    // تقييم الشروط
    if (rule.trigger.conditions) {
      for (const condition of rule.trigger.conditions) {
        if (!this.evaluateCondition(condition, data)) {
          return false;
        }
      }
    }

    return true;
  }

  evaluateCondition(condition, data) {
    const fieldValue = this.getFieldValue(data, condition.field);
    const operator = this.operators[condition.operator];
    
    if (!operator) {
      throw new Error(`Unknown operator: ${condition.operator}`);
    }

    return operator(fieldValue, condition.value);
  }

  getFieldValue(data, fieldPath) {
    return fieldPath.split('.').reduce((obj, key) => obj?.[key], data);
  }

  getPriorityWeight(priority) {
    const weights = { 'CRITICAL': 1, 'HIGH': 2, 'MEDIUM': 3, 'LOW': 4 };
    return weights[priority] || 5;
  }
}

export default SmartRuleEngine;
```

---

## 🔌 المكون الثالث: نظام الإجراءات القابلة للتوصيل

### 📊 التحدي الحالي:
الإجراءات مثل "إرسال بريد إلكتروني" مبعثرة في الكود، مما يجعل إضافة إجراءات جديدة معقدة.

### 💡 الحل المقترح:

#### 1. مدير الإجراءات:
```javascript
// src/services/actionManager.js
import fs from 'fs';
import path from 'path';

class ActionManager {
  constructor() {
    this.actions = new Map();
    this.loadActions();
  }

  loadActions() {
    const actionsDir = path.join(__dirname, '../actions');
    const actionFiles = fs.readdirSync(actionsDir).filter(file => file.endsWith('.js'));

    for (const file of actionFiles) {
      const actionName = path.basename(file, '.js');
      const actionModule = require(path.join(actionsDir, file));
      this.actions.set(actionName, actionModule.default || actionModule);
    }
  }

  async executeAction(actionType, params, context = {}) {
    const action = this.actions.get(actionType);
    
    if (!action) {
      throw new Error(`Action not found: ${actionType}`);
    }

    try {
      const result = await action(params, context);
      this.logActionExecution(actionType, params, result);
      return result;
    } catch (error) {
      this.logActionError(actionType, params, error);
      throw error;
    }
  }

  async executeActions(actions, context = {}) {
    const results = [];
    
    for (const action of actions) {
      try {
        const result = await this.executeAction(action.type, action.params, context);
        results.push({ action: action.type, success: true, result });
      } catch (error) {
        results.push({ action: action.type, success: false, error: error.message });
      }
    }

    return results;
  }

  logActionExecution(actionType, params, result) {
    console.log(`[ActionManager] Executed ${actionType}:`, { params, result });
  }

  logActionError(actionType, params, error) {
    console.error(`[ActionManager] Error in ${actionType}:`, { params, error: error.message });
  }

  getAvailableActions() {
    return Array.from(this.actions.keys());
  }
}

export default ActionManager;
```

#### 2. وحدات الإجراءات:
```javascript
// src/actions/email_notification.js
import nodemailer from 'nodemailer';

export default async function emailNotification(params, context) {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: Array.isArray(params.to) ? params.to.join(',') : params.to,
    subject: params.subject,
    html: await this.renderTemplate(params.template, context)
  };

  const result = await transporter.sendMail(mailOptions);
  return { messageId: result.messageId, status: 'sent' };
}

async function renderTemplate(templateName, data) {
  // تنفيذ نظام القوالب
  const template = await fs.readFile(`templates/${templateName}.html`, 'utf8');
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
}
```

```javascript
// src/actions/slack_notification.js
import { WebClient } from '@slack/web-api';

export default async function slackNotification(params, context) {
  const slack = new WebClient(process.env.SLACK_TOKEN);

  const result = await slack.chat.postMessage({
    channel: params.channel,
    text: params.message.replace(/\{\{(\w+)\}\}/g, (match, key) => context[key] || match),
    blocks: params.blocks || undefined
  });

  return { ts: result.ts, channel: result.channel };
}
```

```javascript
// src/actions/flag_as_duplicate.js
export default async function flagAsDuplicate(params, context) {
  // تسجيل التقرير كمكرر في قاعدة البيانات
  const duplicateRecord = {
    original_id: context.original_id,
    duplicate_id: context.current_id,
    confidence: params.confidence,
    flagged_at: new Date().toISOString(),
    status: 'flagged'
  };

  // حفظ في قاعدة البيانات أو ملف
  await this.saveDuplicateRecord(duplicateRecord);
  
  return { flagged: true, confidence: params.confidence };
}
```

---

## 📊 المكون الرابع: واجهة الرؤى التفاعلية

### 📊 التحدي الحالي:
المستخدم يتفاعل عبر البحث فقط، ولا يوجد مكان مركزي لرؤية الرؤى المكتشفة استباقياً.

### 💡 الحل المقترح:

#### 1. API للرؤى:
```javascript
// src/api/insights.js
import express from 'express';
import SmartRuleEngine from '../services/ruleEngine.js';
import ActionManager from '../services/actionManager.js';

const router = express.Router();
const ruleEngine = new SmartRuleEngine();
const actionManager = new ActionManager();

// الحصول على الرؤى الحديثة
router.get('/insights', async (req, res) => {
  try {
    const { limit = 50, type, priority } = req.query;
    
    const insights = await getRecentInsights({
      limit: parseInt(limit),
      type,
      priority
    });

    res.json({
      success: true,
      data: insights,
      total: insights.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// إضافة رؤية جديدة
router.post('/insights', async (req, res) => {
  try {
    const { text, metadata } = req.body;
    
    // تصنيف النية
    const intent = await intentClassifier.classifyIntent(text);
    
    // تقييم القواعد
    const triggeredRules = await ruleEngine.evaluateRules({
      text,
      intent: intent.intent,
      confidence: intent.confidence,
      ...metadata
    });

    // تنفيذ الإجراءات
    const actionResults = [];
    for (const triggeredRule of triggeredRules) {
      const results = await actionManager.executeActions(
        triggeredRule.rule.actions,
        { ...triggeredRule.data, rule: triggeredRule.rule }
      );
      actionResults.push(...results);
    }

    // حفظ الرؤية
    const insight = await saveInsight({
      text,
      intent,
      triggeredRules,
      actionResults,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      data: insight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
```

#### 2. مكون React للوحة الرؤى:
```jsx
// src/ui/InsightsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Badge, Timeline, Alert, Spin } from 'antd';
import { BellOutlined, TrendingUpOutlined, WarningOutlined } from '@ant-design/icons';

const InsightsDashboard = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadInsights();
    
    // تحديث كل 30 ثانية
    const interval = setInterval(loadInsights, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadInsights = async () => {
    try {
      const response = await fetch(`/api/v1/insights?type=${filter}`);
      const data = await response.json();
      setInsights(data.data);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'CRITICAL': 'red',
      'HIGH': 'orange', 
      'MEDIUM': 'blue',
      'LOW': 'green'
    };
    return colors[priority] || 'default';
  };

  const getIntentIcon = (intent) => {
    const icons = {
      'PERFORMANCE_REPORT': <TrendingUpOutlined />,
      'RISK_WARNING': <WarningOutlined />,
      'ASSET_TRANSACTION': <BellOutlined />
    };
    return icons[intent] || <BellOutlined />;
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div className="insights-dashboard">
      <div className="dashboard-header">
        <h2>🔍 الرؤى الاستباقية</h2>
        <div className="filter-buttons">
          {['all', 'CRITICAL', 'HIGH', 'MEDIUM'].map(filterType => (
            <button
              key={filterType}
              className={filter === filterType ? 'active' : ''}
              onClick={() => setFilter(filterType)}
            >
              {filterType === 'all' ? 'الكل' : filterType}
            </button>
          ))}
        </div>
      </div>

      <Timeline mode="left">
        {insights.map((insight, index) => (
          <Timeline.Item
            key={insight.id}
            dot={getIntentIcon(insight.intent.intent)}
            color={getPriorityColor(insight.priority)}
          >
            <Card className="insight-card">
              <div className="insight-header">
                <Badge 
                  color={getPriorityColor(insight.priority)} 
                  text={insight.priority}
                />
                <span className="timestamp">
                  {new Date(insight.timestamp).toLocaleString('ar-SA')}
                </span>
              </div>
              
              <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
                
                {insight.triggeredRules.length > 0 && (
                  <div className="triggered-rules">
                    <strong>القواعد المُفعلة:</strong>
                    <ul>
                      {insight.triggeredRules.map(rule => (
                        <li key={rule.rule.id}>{rule.rule.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.actionResults.length > 0 && (
                  <div className="actions-taken">
                    <strong>الإجراءات المتخذة:</strong>
                    <div className="action-badges">
                      {insight.actionResults.map((action, idx) => (
                        <Badge
                          key={idx}
                          status={action.success ? 'success' : 'error'}
                          text={action.action}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>

      {insights.length === 0 && (
        <Alert
          message="لا توجد رؤى حالية"
          description="سيتم عرض الرؤى المكتشفة تلقائياً هنا"
          type="info"
          showIcon
        />
      )}
    </div>
  );
};

export default InsightsDashboard;
```

---

## 🧪 خطة الاختبار الشاملة

### 1. اختبارات الوحدة (Unit Tests):
```javascript
// tests/ruleEngine.test.js
describe('SmartRuleEngine', () => {
  let ruleEngine;

  beforeEach(() => {
    ruleEngine = new SmartRuleEngine();
  });

  test('should evaluate high value transaction rule', async () => {
    const data = {
      intent: 'ASSET_TRANSACTION',
      transaction_type: 'purchase',
      amount: 150000
    };

    const triggeredRules = await ruleEngine.evaluateRules(data);
    expect(triggeredRules).toHaveLength(1);
    expect(triggeredRules[0].rule.id).toBe('high_value_asset_purchase');
  });

  test('should not trigger rule when conditions not met', async () => {
    const data = {
      intent: 'ASSET_TRANSACTION',
      transaction_type: 'purchase',
      amount: 50000 // أقل من الحد المطلوب
    };

    const triggeredRules = await ruleEngine.evaluateRules(data);
    expect(triggeredRules).toHaveLength(0);
  });
});
```

### 2. اختبارات التكامل (Integration Tests):
```javascript
// tests/integration/proactiveSystem.test.js
describe('Proactive System Integration', () => {
  test('should process financial text end-to-end', async () => {
    const inputText = "تم شراء معدات جديدة بقيمة 200,000 دولار";
    
    // تصنيف النية
    const intent = await intentClassifier.classifyIntent(inputText);
    expect(intent.intent).toBe('ASSET_TRANSACTION');
    
    // تقييم القواعد
    const triggeredRules = await ruleEngine.evaluateRules({
      text: inputText,
      intent: intent.intent,
      amount: 200000,
      transaction_type: 'purchase'
    });
    
    expect(triggeredRules).toHaveLength(1);
    
    // تنفيذ الإجراءات
    const actionResults = await actionManager.executeActions(
      triggeredRules[0].rule.actions,
      { amount: 200000 }
    );
    
    expect(actionResults.every(result => result.success)).toBe(true);
  });
});
```

---

## 📈 مقاييس النجاح

### 🎯 KPIs للمرحلة السادسة:
| المقياس | الهدف | طريقة القياس |
|---------|-------|-------------|
| دقة تصنيف النوايا | 90%+ | اختبار على 100+ نص مالي |
| وقت استجابة النظام | < 200ms | قياس متوسط وقت المعالجة |
| معدل تفعيل القواعد الصحيحة | 95%+ | مراجعة يدوية للقواعد المُفعلة |
| نجاح تنفيذ الإجراءات | 98%+ | تتبع نجاح/فشل الإجراءات |

---

## 🚀 خطة التنفيذ التفصيلية

### الأسبوع الأول: الأساسيات
- **اليوم 1-2**: إعداد البيئة وإصلاح الأخطاء
- **اليوم 3-4**: تنفيذ مصنف النوايا
- **اليوم 5-7**: اختبار وتحسين المصنف

### الأسبوع الثاني: محرك القواعد
- **اليوم 8-10**: تصميم وتنفيذ محرك القواعد
- **اليوم 11-12**: إنشاء القواعد الأساسية
- **اليوم 13-14**: اختبارات محرك القواعد

### الأسبوع الثالث: نظام الإجراءات
- **اليوم 15-17**: تنفيذ مدير الإجراءات
- **اليوم 18-19**: إنشاء وحدات الإجراءات
- **اليوم 20-21**: اختبارات التكامل

### الأسبوع الرابع: واجهة المستخدم
- **اليوم 22-24**: تطوير API
- **اليوم 25-27**: بناء واجهة React
- **اليوم 28**: اختبارات شاملة ونشر

---

<div align="center">

**🚀 المرحلة السادسة: تحويل G-Assistant إلى مساعد مالي ذكي استباقي**

[![Implementation](https://img.shields.io/badge/Implementation-Ready-green)](./PHASE6_IMPLEMENTATION_GUIDE.md)
[![Duration](https://img.shields.io/badge/Duration-30%20Days-blue)](./OCTOBER_ROADMAP.md)
[![Success Rate](https://img.shields.io/badge/Expected%20Success-95%25-brightgreen)](./PHASE6_IMPLEMENTATION_GUIDE.md)

</div>