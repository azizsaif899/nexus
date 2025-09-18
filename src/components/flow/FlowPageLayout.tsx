'use client';

import FlowCanvas from './FlowCanvas';
import FlowSidebar from './FlowSidebar';
import { Button } from '../ui/button';
import { Play, Settings, Save, Share2 } from 'lucide-react';

const FlowPageLayout = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-16 w-full flex-shrink-0 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-lg">
        <div>
          <h1 className="text-xl font-bold text-foreground">Untitled Flow</h1>
          <p className="text-xs text-muted-foreground">Last saved 2 minutes ago</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button size="sm" className="bg-green-500 hover:bg-green-600">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <FlowCanvas />
        </main>
        <FlowSidebar />
      </div>
    </div>
  );
};

export default FlowPageLayout;
