'use client';

import React from 'react';
import FlowCanvas from './FlowCanvas';
import FlowSidebar from './FlowSidebar';
import { Button } from '../ui/button';
import { Play, Save, Share2 } from 'lucide-react';

const FlowPageLayout = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">My First Workflow</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FlowCanvas />
        </div>
        <div className="lg:col-span-1">
          <FlowSidebar />
        </div>
      </div>
    </div>
  );
};

export default FlowPageLayout;
