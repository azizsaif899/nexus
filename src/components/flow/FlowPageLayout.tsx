'use client';

import React from 'react';
import FlowCanvas from './FlowCanvas';
import FlowSidebar from './FlowSidebar';
import { Button } from '../ui/button';
import { Play, Settings, Save, Share2 } from 'lucide-react';

const FlowPageLayout = () => {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
        <div>
          <h1 className="text-xl font-bold">Automation Workflow</h1>
          <p className="text-sm text-muted-foreground">Untitled Flow</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button size="sm">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <FlowCanvas />
        <FlowSidebar />
      </div>
    </div>
  );
};

export default FlowPageLayout;
