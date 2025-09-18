'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Bot, SlidersHorizontal, History } from 'lucide-react'

const FlowSidebar = () => {
  return (
    <aside className="w-80 flex-shrink-0 border-l border-border bg-card/50 backdrop-blur-lg">
      <Tabs defaultValue="chat" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat"><Bot className="h-4 w-4 mr-2"/>Chat</TabsTrigger>
          <TabsTrigger value="nodes"><SlidersHorizontal className="h-4 w-4 mr-2"/>Nodes</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-2"/>History</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-1 p-4">
          <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
            <Bot className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-foreground">Executive Chat</h3>
            <p className="text-sm">Chat interface will be implemented here.</p>
          </div>
        </TabsContent>
        <TabsContent value="nodes" className="flex-1 p-4">
           <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
            <SlidersHorizontal className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-foreground">Nodes Library</h3>
            <p className="text-sm">Node selection and properties will be here.</p>
          </div>
        </TabsContent>
        <TabsContent value="history" className="flex-1 p-4">
           <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
            <History className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-foreground">Run History</h3>
            <p className="text-sm">Execution history will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default FlowSidebar;
