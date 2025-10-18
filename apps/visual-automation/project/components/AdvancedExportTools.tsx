import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, Code, FileText, Image, Share2, 
  Copy, Check, Settings, Palette, Upload,
  ExternalLink, FileDown, Eye, Braces,
  Layers, Zap, GitBranch, Database,
  Camera, Film, Printer, Mail
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface ExportSettings {
  format: 'svg' | 'png' | 'pdf' | 'json' | 'yaml' | 'typescript' | 'python';
  quality: number;
  scale: number;
  includeBackground: boolean;
  includeComments: boolean;
  includeMetadata: boolean;
  theme: 'light' | 'dark' | 'auto';
  customBranding: boolean;
  logoUrl?: string;
  watermark?: string;
}

interface AdvancedExportToolsProps {
  nodes: Node[];
  connections: Connection[];
  canvasRef?: React.RefObject<HTMLDivElement>;
  onExport: (format: string, settings: ExportSettings) => Promise<void>;
}

// Code Generation Templates
const codeTemplates = {
  typescript: (nodes: Node[], connections: Connection[]) => `
// Auto-generated Workflow Code - TypeScript
interface WorkflowNode {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
}

const workflowNodes: WorkflowNode[] = ${JSON.stringify(nodes, null, 2)};

const workflowConnections: WorkflowConnection[] = ${JSON.stringify(connections, null, 2)};

class WorkflowEngine {
  private nodes: Map<string, WorkflowNode> = new Map();
  private connections: WorkflowConnection[] = [];
  
  constructor(nodes: WorkflowNode[], connections: WorkflowConnection[]) {
    nodes.forEach(node => this.nodes.set(node.id, node));
    this.connections = connections;
  }
  
  async execute(startNodeId?: string): Promise<any> {
    const executionOrder = this.getExecutionOrder(startNodeId);
    const results: Map<string, any> = new Map();
    
    for (const nodeId of executionOrder) {
      const node = this.nodes.get(nodeId);
      if (!node) continue;
      
      const result = await this.executeNode(node, results);
      results.set(nodeId, result);
    }
    
    return results;
  }
  
  private async executeNode(node: WorkflowNode, previousResults: Map<string, any>): Promise<any> {
    console.log(\`Executing node: \${node.type}\`);
    
    switch (node.type) {
      case 'webhook-trigger':
        return this.executeWebhookTrigger(node);
      case 'http-request':
        return this.executeHttpRequest(node, previousResults);
      case 'email-send':
        return this.executeEmailSend(node, previousResults);
      case 'condition':
        return this.executeCondition(node, previousResults);
      case 'transform':
        return this.executeTransform(node, previousResults);
      case 'delay':
        return this.executeDelay(node);
      default:
        console.warn(\`Unknown node type: \${node.type}\`);
        return null;
    }
  }
  
  private getExecutionOrder(startNodeId?: string): string[] {
    // Implementation for topological sort based on connections
    const visited = new Set<string>();
    const order: string[] = [];
    
    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      // Visit dependencies first
      const dependencies = this.connections
        .filter(conn => conn.target === nodeId)
        .map(conn => conn.source);
      
      dependencies.forEach(visit);
      order.push(nodeId);
    };
    
    if (startNodeId) {
      visit(startNodeId);
    } else {
      // Start with trigger nodes
      const triggerNodes = Array.from(this.nodes.values())
        .filter(node => node.type.includes('trigger'));
      
      triggerNodes.forEach(node => visit(node.id));
    }
    
    return order;
  }
  
  private async executeWebhookTrigger(node: WorkflowNode): Promise<any> {
    // Webhook trigger implementation
    return { triggered: true, timestamp: Date.now() };
  }
  
  private async executeHttpRequest(node: WorkflowNode, results: Map<string, any>): Promise<any> {
    // HTTP request implementation
    const config = node.data?.config || {};
    return { status: 200, data: 'Mock response' };
  }
  
  private async executeEmailSend(node: WorkflowNode, results: Map<string, any>): Promise<any> {
    // Email send implementation
    return { sent: true, messageId: 'mock-message-id' };
  }
  
  private async executeCondition(node: WorkflowNode, results: Map<string, any>): Promise<any> {
    // Condition evaluation implementation
    return { condition: true, branch: 'true' };
  }
  
  private async executeTransform(node: WorkflowNode, results: Map<string, any>): Promise<any> {
    // Data transformation implementation
    return { transformed: true };
  }
  
  private async executeDelay(node: WorkflowNode): Promise<any> {
    const delay = node.data?.config?.delay || 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    return { delayed: delay };
  }
}

// Export the workflow
export { workflowNodes, workflowConnections, WorkflowEngine };

// Usage example:
// const engine = new WorkflowEngine(workflowNodes, workflowConnections);
// engine.execute().then(results => console.log('Workflow completed:', results));
`,
  
  python: (nodes: Node[], connections: Connection[]) => `
# Auto-generated Workflow Code - Python
import json
import time
import requests
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class WorkflowNode:
    id: str
    type: str
    data: Dict[str, Any]
    position: Dict[str, float]

@dataclass
class WorkflowConnection:
    id: str
    source: str
    target: str

# Workflow Data
workflow_nodes = ${JSON.stringify(nodes, null, 4)}

workflow_connections = ${JSON.stringify(connections, null, 4)}

class WorkflowEngine:
    def __init__(self, nodes: List[Dict], connections: List[Dict]):
        self.nodes = {node['id']: WorkflowNode(**node) for node in nodes}
        self.connections = [WorkflowConnection(**conn) for conn in connections]
        self.results = {}
    
    async def execute(self, start_node_id: Optional[str] = None) -> Dict[str, Any]:
        """Execute the workflow"""
        execution_order = self.get_execution_order(start_node_id)
        
        for node_id in execution_order:
            node = self.nodes.get(node_id)
            if not node:
                continue
            
            print(f"Executing node: {node.type}")
            result = await self.execute_node(node)
            self.results[node_id] = result
        
        return self.results
    
    def get_execution_order(self, start_node_id: Optional[str] = None) -> List[str]:
        """Get the execution order using topological sort"""
        visited = set()
        order = []
        
        def visit(node_id: str):
            if node_id in visited:
                return
            visited.add(node_id)
            
            # Visit dependencies first
            dependencies = [
                conn.source for conn in self.connections
                if conn.target == node_id
            ]
            
            for dep in dependencies:
                visit(dep)
            
            order.append(node_id)
        
        if start_node_id:
            visit(start_node_id)
        else:
            # Start with trigger nodes
            trigger_nodes = [
                node_id for node_id, node in self.nodes.items()
                if 'trigger' in node.type
            ]
            
            for node_id in trigger_nodes:
                visit(node_id)
        
        return order
    
    async def execute_node(self, node: WorkflowNode) -> Any:
        """Execute a single node"""
        if node.type == 'webhook-trigger':
            return await self.execute_webhook_trigger(node)
        elif node.type == 'http-request':
            return await self.execute_http_request(node)
        elif node.type == 'email-send':
            return await self.execute_email_send(node)
        elif node.type == 'condition':
            return await self.execute_condition(node)
        elif node.type == 'transform':
            return await self.execute_transform(node)
        elif node.type == 'delay':
            return await self.execute_delay(node)
        else:
            print(f"Unknown node type: {node.type}")
            return None
    
    async def execute_webhook_trigger(self, node: WorkflowNode) -> Dict[str, Any]:
        """Execute webhook trigger"""
        return {
            'triggered': True,
            'timestamp': datetime.now().isoformat()
        }
    
    async def execute_http_request(self, node: WorkflowNode) -> Dict[str, Any]:
        """Execute HTTP request"""
        config = node.data.get('config', {})
        # Add actual HTTP request logic here
        return {
            'status': 200,
            'data': 'Mock response'
        }
    
    async def execute_email_send(self, node: WorkflowNode) -> Dict[str, Any]:
        """Execute email send"""
        config = node.data.get('config', {})
        # Add actual email sending logic here
        return {
            'sent': True,
            'message_id': 'mock-message-id'
        }
    
    async def execute_condition(self, node: WorkflowNode) -> Dict[str, Any]:
        """Execute condition"""
        config = node.data.get('config', {})
        # Add condition evaluation logic here
        return {
            'condition': True,
            'branch': 'true'
        }
    
    async def execute_transform(self, node: WorkflowNode) -> Dict[str, Any]:
        """Execute data transformation"""
        config = node.data.get('config', {})
        # Add transformation logic here
        return {
            'transformed': True
        }
    
    async def execute_delay(self, node: WorkflowNode) -> Dict[str, Any]:
        """Execute delay"""
        config = node.data.get('config', {})
        delay = config.get('delay', 1)
        time.sleep(delay)
        return {
            'delayed': delay
        }

# Usage example:
if __name__ == "__main__":
    import asyncio
    
    engine = WorkflowEngine(workflow_nodes, workflow_connections)
    results = asyncio.run(engine.execute())
    print("Workflow completed:", results)
`,
  
  json: (nodes: Node[], connections: Connection[]) => JSON.stringify({
    version: '1.0.0',
    created_at: new Date().toISOString(),
    metadata: {
      title: 'سير العمل المُصدر',
      description: 'سير عمل تم إنشاؤه وتصديره من نظام الأتمتة المرئية',
      node_count: nodes.length,
      connection_count: connections.length
    },
    nodes,
    connections,
    execution_config: {
      timeout: 30000,
      retry_attempts: 3,
      parallel_execution: false
    }
  }, null, 2),
  
  yaml: (nodes: Node[], connections: Connection[]) => `
# سير العمل المُصدر - YAML
version: '1.0.0'
created_at: ${new Date().toISOString()}

metadata:
  title: سير العمل المُصدر
  description: سير عمل تم إنشاؤه وتصديره من نظام الأتمتة المرئية
  node_count: ${nodes.length}
  connection_count: ${connections.length}

nodes:
${nodes.map(node => `  - id: ${node.id}
    type: ${node.type}
    position:
      x: ${node.position.x}
      y: ${node.position.y}
    data: ${JSON.stringify(node.data)}`).join('\n')}

connections:
${connections.map(conn => `  - id: ${conn.id}
    source: ${conn.source}
    target: ${conn.target}`).join('\n')}

execution_config:
  timeout: 30000
  retry_attempts: 3
  parallel_execution: false
`,

  react: (nodes: Node[], connections: Connection[]) => `
// Auto-generated React Component
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkflowNode {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
}

const workflowData = {
  nodes: ${JSON.stringify(nodes, null, 2)},
  connections: ${JSON.stringify(connections, null, 2)}
};

const WorkflowVisualization: React.FC = () => {
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const executeWorkflow = async () => {
      // Add your workflow execution logic here
      console.log('Workflow executing with', workflowData.nodes.length, 'nodes');
    };
    
    executeWorkflow();
  }, []);
  
  return (
    <div className="workflow-container w-full h-96 relative bg-gray-50 rounded-lg border">
      <svg className="absolute inset-0 w-full h-full">
        {/* Render connections */}
        {workflowData.connections.map(conn => {
          const sourceNode = workflowData.nodes.find(n => n.id === conn.source);
          const targetNode = workflowData.nodes.find(n => n.id === conn.target);
          if (!sourceNode || !targetNode) return null;
          
          return (
            <motion.line
              key={conn.id}
              x1={sourceNode.position.x * 0.1 + 50}
              y1={sourceNode.position.y * 0.1 + 50}
              x2={targetNode.position.x * 0.1 + 50}
              y2={targetNode.position.y * 0.1 + 50}
              stroke="#3b82f6"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          );
        })}
        
        {/* Render nodes */}
        {workflowData.nodes.map(node => (
          <motion.circle
            key={node.id}
            cx={node.position.x * 0.1 + 50}
            cy={node.position.y * 0.1 + 50}
            r="8"
            fill={node.type.includes('trigger') ? '#10b981' : '#3b82f6'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer"
          />
        ))}
      </svg>
      
      {/* Workflow Stats */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm p-3">
        <div className="text-sm text-gray-600">
          العقد: {workflowData.nodes.length} | الاتصالات: {workflowData.connections.length}
        </div>
      </div>
    </div>
  );
};

export default WorkflowVisualization;
`,

  docker: (nodes: Node[], connections: Connection[]) => `
# Auto-generated Dockerfile for Workflow
FROM node:18-alpine

WORKDIR /app

# Copy workflow data
COPY workflow.json ./

# Install dependencies
RUN npm init -y && \\
    npm install express cors body-parser

# Create workflow server
RUN cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const workflow = require('./workflow.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Workflow endpoints
app.get('/workflow', (req, res) => {
  res.json(workflow);
});

app.post('/workflow/execute', async (req, res) => {
  try {
    console.log('Executing workflow with', workflow.nodes.length, 'nodes');
    
    // Add your workflow execution logic here
    const results = {
      status: 'completed',
      executedNodes: workflow.nodes.length,
      executionTime: Date.now(),
      results: workflow.nodes.map(node => ({
        nodeId: node.id,
        type: node.type,
        status: 'success'
      }))
    };
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(\`Workflow server running on port \${port}\`);
});
EOF

# Create workflow data file
RUN cat > workflow.json << 'EOF'
${JSON.stringify({ nodes, connections, metadata: { created: new Date().toISOString(), version: '1.0.0' } }, null, 2)}
EOF

EXPOSE 3000

CMD ["node", "server.js"]
`,
  
  kubernetes: (nodes: Node[], connections: Connection[]) => `
# Auto-generated Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: workflow-engine
  labels:
    app: workflow-engine
spec:
  replicas: 2
  selector:
    matchLabels:
      app: workflow-engine
  template:
    metadata:
      labels:
        app: workflow-engine
    spec:
      containers:
      - name: workflow-engine
        image: workflow-engine:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_COUNT
          value: "${nodes.length}"
        - name: CONNECTION_COUNT
          value: "${connections.length}"
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /workflow
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /workflow
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: workflow-engine-service
spec:
  selector:
    app: workflow-engine
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: workflow-config
data:
  workflow.json: |
${JSON.stringify({ nodes, connections }, null, 4).split('\n').map(line => '    ' + line).join('\n')}
`
};

// Export Preview Component
const ExportPreview: React.FC<{
  nodes: Node[];
  connections: Connection[];
  settings: ExportSettings;
}> = ({ nodes, connections, settings }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="space-y-4">
      {/* Preview Canvas */}
      <div className="border border-border rounded-lg overflow-hidden bg-background-muted">
        <div 
          ref={canvasRef}
          className="relative w-full h-64 overflow-hidden"
          style={{ 
            backgroundColor: settings.includeBackground ? 
              (settings.theme === 'dark' ? '#0f0f1a' : '#faf9f7') : 
              'transparent'
          }}
        >
          {/* Mini workflow visualization */}
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Connections */}
            {connections.map(conn => {
              const sourceNode = nodes.find(n => n.id === conn.source);
              const targetNode = nodes.find(n => n.id === conn.target);
              if (!sourceNode || !targetNode) return null;
              
              const scale = 0.15;
              return (
                <line
                  key={conn.id}
                  x1={sourceNode.position.x * scale + 50}
                  y1={sourceNode.position.y * scale + 50}
                  x2={targetNode.position.x * scale + 50}
                  y2={targetNode.position.y * scale + 50}
                  stroke="var(--primary)"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <circle
                key={node.id}
                cx={node.position.x * 0.15 + 50}
                cy={node.position.y * 0.15 + 50}
                r="8"
                fill={node.type.includes('trigger') ? 'var(--success)' : 'var(--primary)'}
              />
            ))}
          </svg>
          
          {/* Custom branding */}
          {settings.customBranding && settings.logoUrl && (
            <div className="absolute top-4 right-4">
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="h-8 w-auto opacity-70"
              />
            </div>
          )}
          
          {/* Watermark */}
          {settings.watermark && (
            <div className="absolute bottom-4 left-4 text-xs text-foreground-muted opacity-50">
              {settings.watermark}
            </div>
          )}
        </div>
      </div>
      
      {/* Export Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-foreground-muted">التنسيق:</span>
          <span className="text-foreground mr-2">{settings.format.toUpperCase()}</span>
        </div>
        <div>
          <span className="text-foreground-muted">الجودة:</span>
          <span className="text-foreground mr-2">{settings.quality}%</span>
        </div>
        <div>
          <span className="text-foreground-muted">المقياس:</span>
          <span className="text-foreground mr-2">{settings.scale}x</span>
        </div>
        <div>
          <span className="text-foreground-muted">الثيم:</span>
          <span className="text-foreground mr-2">{settings.theme}</span>
        </div>
      </div>
    </div>
  );
};

// Code Preview Component
const CodePreview: React.FC<{
  nodes: Node[];
  connections: Connection[];
  format: 'typescript' | 'python' | 'json' | 'yaml' | 'react' | 'docker' | 'kubernetes';
}> = ({ nodes, connections, format }) => {
  const [copied, setCopied] = useState(false);
  
  const code = codeTemplates[format](nodes, connections);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('تم نسخ الكود');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            كود مُولد - {format.toUpperCase()}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'تم النسخ' : 'نسخ'}
        </Button>
      </div>
      
      <div className="relative">
        <pre className="bg-background-muted border border-border rounded-lg p-4 overflow-auto max-h-96 text-xs">
          <code className="text-foreground">{code}</code>
        </pre>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-foreground-muted">
        <span>الأسطر: {code.split('\n').length}</span>
        <span>الأحرف: {code.length}</span>
        <span>الحجم: {Math.round(new Blob([code]).size / 1024)} KB</span>
      </div>
    </div>
  );
};

// Advanced Export Tools Main Component
const AdvancedExportTools: React.FC<AdvancedExportToolsProps> = ({
  nodes,
  connections,
  canvasRef,
  onExport
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('visual');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'png',
    quality: 100,
    scale: 1,
    includeBackground: true,
    includeComments: false,
    includeMetadata: true,
    theme: 'auto',
    customBranding: false,
    watermark: 'مُولد بواسطة نظام الأتمتة المرئية'
  });
  
  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export progress
      const progressSteps = [0, 25, 50, 75, 100];
      for (const step of progressSteps) {
        setExportProgress(step);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      await onExport(settings.format, settings);
      toast.success('تم التصدير بنجاح');
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('خطأ في التصدير');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };
  
  const formatOptions = {
    visual: [
      { value: 'png', label: 'PNG - صورة عالية الجودة', icon: Image, description: 'مثالي للمشاركة والعرض' },
      { value: 'svg', label: 'SVG - رسوميات قابلة للتكبير', icon: Layers, description: 'جودة مثالية في جميع الأحجام' },
      { value: 'pdf', label: 'PDF - مستند احترافي', icon: FileText, description: 'للطباعة والأرشفة' }
    ],
    code: [
      { value: 'typescript', label: 'TypeScript - كود قوي ومتطور', icon: Code, description: 'محرك تنفيذ كامل مع فحص الأنواع' },
      { value: 'python', label: 'Python - سكريبت قابل للتنفيذ', icon: Braces, description: 'كود Python جاهز للتشغيل' },
      { value: 'json', label: 'JSON - بيانات منظمة', icon: Database, description: 'تنسيق بيانات قياسي' },
      { value: 'yaml', label: 'YAML - تكوين بسيط', icon: FileText, description: 'تكوين سهل القراءة' }
    ],
    advanced: [
      { value: 'react', label: 'React Component - مكون جاهز', icon: Code, description: 'مكون React قابل للاستخدام مباشرة' },
      { value: 'docker', label: 'Docker - حاوية جاهزة', icon: Database, description: 'حاوية Docker مع كامل البيئة' },
      { value: 'kubernetes', label: 'Kubernetes - نشر سحابي', icon: Layers, description: 'ملفات نشر Kubernetes' }
    ]
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="hidden" />
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            أدوات التصدير المتقدمة
          </DialogTitle>
          <DialogDescription className="sr-only">
            تصدير سير العمل بصيغ مختلفة مع خيارات متقدمة
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visual" className="gap-2">
              <Image className="w-4 h-4" />
              ��رئي
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code className="w-4 h-4" />
              كود
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Layers className="w-4 h-4" />
              متقدم
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              إعدادات
            </TabsTrigger>
          </TabsList>
          
          {/* Visual Export Tab */}
          <TabsContent value="visual" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Format Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">اختر تنسيق التصدير</h3>
                <div className="space-y-2">
                  {formatOptions.visual.map(option => (
                    <Button
                      key={option.value}
                      variant={settings.format === option.value ? "default" : "outline"}
                      className="w-full justify-start gap-3 h-auto py-3"
                      onClick={() => setSettings(prev => ({ ...prev, format: option.value as any }))}
                    >
                      <option.icon className="w-4 h-4" />
                      <div className="text-right">
                        <div className="font-medium">{option.label}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                
                {/* Quality Settings */}
                <div className="space-y-2">
                  <Label>الجودة: {settings.quality}%</Label>
                  <Slider
                    value={[settings.quality]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value[0] }))}
                    max={100}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                </div>
                
                {/* Scale Settings */}
                <div className="space-y-2">
                  <Label>المقياس: {settings.scale}x</Label>
                  <Slider
                    value={[settings.scale]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, scale: value[0] }))}
                    max={5}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">معاينة التصدير</h3>
                <ExportPreview
                  nodes={nodes}
                  connections={connections}
                  settings={settings}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Code Export Tab */}
          <TabsContent value="code" className="space-y-4">
            <div className="space-y-4">
              {/* Format Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {formatOptions.code.map(option => (
                  <Button
                    key={option.value}
                    variant={settings.format === option.value ? "default" : "outline"}
                    className="justify-start gap-3 h-auto py-3"
                    onClick={() => setSettings(prev => ({ ...prev, format: option.value as any }))}
                  >
                    <option.icon className="w-4 h-4" />
                    <div className="text-right flex-1">
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
              
              {/* Code Preview */}
              {formatOptions.code.some(opt => opt.value === settings.format) && (
                <CodePreview
                  nodes={nodes}
                  connections={connections}
                  format={settings.format as 'typescript' | 'python' | 'json' | 'yaml'}
                />
              )}
            </div>
          </TabsContent>
          
          {/* Advanced Export Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                التصدر المتقدم يوفر تطبيقات وحاويات جاهزة للنشر
              </div>
              
              {/* Advanced Format Selection */}
              <div className="space-y-3">
                {formatOptions.advanced.map(option => (
                  <Button
                    key={option.value}
                    variant={settings.format === option.value ? "default" : "outline"}
                    className="w-full justify-start gap-3 h-auto py-4"
                    onClick={() => setSettings(prev => ({ ...prev, format: option.value as any }))}
                  >
                    <option.icon className="w-5 h-5" />
                    <div className="text-right flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {option.value === 'react' ? 'JSX' : option.value === 'docker' ? 'Container' : 'YAML'}
                    </Badge>
                  </Button>
                ))}
              </div>
              
              {/* Advanced Preview */}
              {formatOptions.advanced.some(opt => opt.value === settings.format) && (
                <div className="mt-4">
                  <CodePreview
                    nodes={nodes}
                    connections={connections}
                    format={settings.format as any}
                  />
                </div>
              )}
              
              {/* Advanced Features Info */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  مميزات التصدير المتقدم
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• مكونات React قابلة للاستخدام مباشرة</li>
                  <li>• حاويات Docker مع بيئة كاملة</li>
                  <li>• ملفات نشر Kubernetes جاهزة</li>
                  <li>• دعم التطبيقات السحابية</li>
                  <li>• تكامل مع CI/CD pipelines</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">الإعدادات العامة</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>تضمين الخلفية</Label>
                    <Switch
                      checked={settings.includeBackground}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, includeBackground: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>تضمين التعليقات</Label>
                    <Switch
                      checked={settings.includeComments}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, includeComments: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>تضمين البيانات الوصفية</Label>
                    <Switch
                      checked={settings.includeMetadata}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, includeMetadata: checked }))
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>الثيم</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value: any) => setSettings(prev => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">فاتح</SelectItem>
                      <SelectItem value="dark">داكن</SelectItem>
                      <SelectItem value="auto">تلقائي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Branding Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">العلامة التجارية</h3>
                
                <div className="flex items-center justify-between">
                  <Label>علامة تجارية مخصصة</Label>
                  <Switch
                    checked={settings.customBranding}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, customBranding: checked }))
                    }
                  />
                </div>
                
                {settings.customBranding && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>رابط الشعار</Label>
                      <Input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        value={settings.logoUrl || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>العلامة المائية</Label>
                      <Input
                        placeholder="اسم الشركة أو النص المخصص"
                        value={settings.watermark || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, watermark: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Export Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-foreground-muted">
            {nodes.length} عقدة، {connections.length} اتصال
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleExport} disabled={isExporting} className="gap-2">
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري التصدير...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  تصدير
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Export Progress */}
        {isExporting && (
          <div className="space-y-2">
            <Progress value={exportProgress} className="w-full" />
            <div className="text-xs text-center text-foreground-muted">
              {exportProgress}% مكتمل
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { AdvancedExportTools };