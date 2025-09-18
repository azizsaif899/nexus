'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Bot, SlidersHorizontal, History, Zap, BrainCircuit, Code, MessageCircle } from 'lucide-react'
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

const nodeTypes = [
  {
    category: 'Triggers',
    color: 'bg-cyan-500/20 text-cyan-300',
    nodes: [
      { name: 'On Form Submit', icon: Code },
      { name: 'On New Email', icon: MessageCircle },
      { name: 'Scheduled Time', icon: History },
    ]
  },
  {
    category: 'Actions',
    color: 'bg-blue-500/20 text-blue-300',
    nodes: [
      { name: 'Send Email', icon: MessageCircle },
      { name: 'Update CRM', icon: Zap },
      { name: 'Run Script', icon: Code },
    ]
  },
  {
    category: 'AI',
    color: 'bg-purple-500/20 text-purple-300',
    nodes: [
      { name: 'Summarize Text', icon: BrainCircuit },
      { name: 'Generate Image', icon: BrainCircuit },
      { name: 'Analyze Sentiment', icon: BrainCircuit },
    ]
  }
];

const executionHistory = [
  { id: 'run-1', status: 'success', timestamp: '5 minutes ago', duration: '2.1s' },
  { id: 'run-2', status: 'failed', timestamp: '1 hour ago', duration: '0.5s' },
  { id: 'run-3', status: 'success', timestamp: '3 hours ago', duration: '1.8s' },
];

const FlowSidebar = () => {
  return (
    <aside className="w-96 border-l border-border bg-background flex flex-col">
       <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-2">
          <TabsTrigger value="chat"><Bot className="h-4 w-4 mr-1 inline-block"/>Chat</TabsTrigger>
          <TabsTrigger value="nodes"><SlidersHorizontal className="h-4 w-4 mr-1 inline-block"/>Nodes</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-1 inline-block"/>History</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-1 flex flex-col p-4 gap-4">
            <h3 className="text-lg font-semibold">Executive Chat</h3>
            <div className="flex-1 rounded-lg border border-border p-4 space-y-4 text-sm bg-muted/20">
                <p className="text-muted-foreground">AI: How can I help you build your workflow?</p>
                <p className="text-right text-foreground">User: Create a flow that sends a welcome email when a new user signs up.</p>
            </div>
            <div className="flex gap-2">
                <Input placeholder="Ask AI to build..."/>
                <Button>Send</Button>
            </div>
        </TabsContent>
        <TabsContent value="nodes" className="flex-1 p-4 overflow-y-auto">
           <div className="flex flex-col h-full gap-6">
            <h3 className="text-lg font-semibold">Nodes Library</h3>
            {nodeTypes?.map(type => (
              <div key={type.category}>
                <h4 className="font-semibold text-muted-foreground mb-3">{type.category}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {type.nodes?.map(node => {
                    const Icon = node.icon;
                    return (
                      <div key={node.name} className={cn("p-3 rounded-md border border-border flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-accent", type.color)}>
                        <Icon className="h-6 w-6"/>
                        <p className="text-xs font-medium">{node.name}</p>
                      </div>
                    )
                  }) || []}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="history" className="flex-1 p-4 space-y-3 overflow-y-auto">
           <h3 className="text-lg font-semibold">Execution History</h3>
           {executionHistory?.map(run => (
             <div key={run.id} className="p-3 rounded-lg border border-border bg-muted/20 flex justify-between items-center">
               <div>
                  <p className="font-semibold">{run.id}</p>
                  <p className="text-xs text-muted-foreground">{run.timestamp}</p>
               </div>
               <div className="text-right">
                  <Badge variant={run.status === 'success' ? 'default' : 'destructive'} className={cn(run.status === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30')}>
                    {run.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{run.duration}</p>
               </div>
             </div>
           ))}
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default FlowSidebar;
