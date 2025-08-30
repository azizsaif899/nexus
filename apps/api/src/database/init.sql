-- إنشاء قاعدة بيانات workflows
CREATE DATABASE workflows_db;

-- الاتصال بقاعدة البيانات
\c workflows_db;

-- إنشاء جدول workflows
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    nodes JSONB DEFAULT '[]',
    connections JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    is_active BOOLEAN DEFAULT true
);

-- إنشاء جدول workflow_executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id),
    status VARCHAR(20) DEFAULT 'pending',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    execution_data JSONB DEFAULT '{}'
);

-- إنشاء فهارس للأداء
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_created_at ON workflows(created_at);
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);

-- إدراج بيانات تجريبية
INSERT INTO workflows (name, description, nodes, connections, status) VALUES 
(
    'Meta Lead to WhatsApp',
    'إرسال رسالة ترحيب تلقائية للعملاء الجدد من Meta',
    '[
        {"id": "trigger-1", "type": "meta-lead", "position": {"x": 100, "y": 100}},
        {"id": "action-1", "type": "send-whatsapp", "position": {"x": 300, "y": 100}}
    ]',
    '[
        {"source": "trigger-1", "target": "action-1"}
    ]',
    'active'
),
(
    'Email to Google Sheets',
    'حفظ رسائل البريد الواردة في جدول بيانات',
    '[
        {"id": "trigger-2", "type": "email-received", "position": {"x": 100, "y": 200}},
        {"id": "action-2", "type": "create-sheet-row", "position": {"x": 300, "y": 200}}
    ]',
    '[
        {"source": "trigger-2", "target": "action-2"}
    ]',
    'active'
);