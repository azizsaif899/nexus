'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Bot, SlidersHorizontal, History } from 'lucide-react'

const FlowSidebar = () => {
  return (
    <aside className="w-96 border-l border-border bg-background flex flex-col">
       <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-2">
          <TabsTrigger value="chat"><Bot className="h-4 w-4 mr-1 inline-block"/>Chat</TabsTrigger>
          <TabsTrigger value="nodes"><SlidersHorizontal className="h-4 w-4 mr-1 inline-block"/>Nodes</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-1 inline-block"/>History</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-1 p-4">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4">Executive Chat</h3>
            <div className="flex-1 rounded-md border border-dashed border-border p-4 flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center">Chat interface coming soon...</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="nodes" className="flex-1 p-4">
           <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4">Nodes Library</h3>
            <div className="flex-1 rounded-md border border-dashed border-border p-4 flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center">Nodes library coming soon...</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history" className="flex-1 p-4">
           <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4">Execution History</h3>
            <div className="flex-1 rounded-md border border-dashed border-border p-4 flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center">History log coming soon...</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default FlowSidebar;
