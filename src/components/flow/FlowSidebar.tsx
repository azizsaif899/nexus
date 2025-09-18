'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, History, Workflow } from "lucide-react"
import { cn } from "@/lib/utils";


const sidebarTabs = [
  {
    name: "Chat",
    icon: Bot,
  },
  {
    name: "Nodes",
    icon: Workflow,
  },
  {
    name: "History",
    icon: History,
  }
]

const nodeTypes = [
  {
    type: 'Input',
    color: 'bg-blue-900/50 border-blue-500',
    nodes: [
      { name: 'Webhook', icon: Workflow },
      { name: 'Manual', icon: Bot },
    ],
  },
    {
    type: 'Logic',
    color: 'bg-orange-900/50 border-orange-500',
    nodes: [
      { name: 'Filter', icon: Workflow },
      { name: 'Router', icon: Bot },
    ],
  },
    {
    type: 'Action',
    color: 'bg-green-900/50 border-green-500',
    nodes: [
      { name: 'Send Email', icon: Workflow },
      { name: 'Update CRM', icon: Bot },
    ],
  },
]


export default function FlowSidebar() {
  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <Tabs defaultValue="nodes" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none rounded-t-lg">
            {sidebarTabs.map((tab) => (
              <TabsTrigger value={tab.name.toLowerCase()} key={tab.name} className="gap-2">
                <tab.icon className="h-4 w-4"/>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="chat" className="flex-1 p-4">
            Chat content
          </TabsContent>
          <TabsContent value="nodes" className="flex-1 p-4">
            <div className="space-y-6">
              {nodeTypes.map((type) => (
                <div key={type.type}>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-3">{type.type}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {type.nodes.map((node) => {
                    const Icon = node.icon;
                    return (
                      <div key={node.name} className={cn("p-3 rounded-md border border-border flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-accent", type.color)}>
                        <Icon className="h-6 w-6"/>
                        <p className="text-xs font-medium">{node.name}</p>
                      </div>
                    )
                  })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="history" className="flex-1 p-4">
            History content
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
