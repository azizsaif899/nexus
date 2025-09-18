'use client';

import React from 'react';
import FlowCanvas from './FlowCanvas';
import FlowSidebar from './FlowSidebar';

const FlowPageLayout = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <FlowCanvas />
      </div>
      <div className="lg:col-span-1">
        <FlowSidebar />
      </div>
    </div>
  );
};

export default FlowPageLayout;
