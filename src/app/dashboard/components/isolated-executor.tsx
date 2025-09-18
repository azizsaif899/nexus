
'use client';

import React, { useState } from 'react';
import { Play, TestTube, Code, Search, Terminal, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';

type CommandType = 'serve' | 'build' | 'test' | 'lint';

export default function IsolatedExecutor() {
  const [projectName, setProjectName] = useState('');
  const [command, setCommand] = useState('');
  const [loadingCommand, setLoadingCommand] = useState<CommandType | null>(
    null,
  );

  const handleExecute = (type: CommandType) => {
    if (!projectName) {
      setCommand(`echo "Please enter a project name."`);
      return;
    }
    setLoadingCommand(type);
    setCommand('');

    setTimeout(() => {
      setCommand(`nx ${type} ${projectName}`);
      setLoadingCommand(null);
    }, 1000);
  };

  const commands: {
    type: CommandType;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { type: 'serve', icon: <Play />, label: 'Serve' },
    { type: 'build', icon: <Code />, label: 'Build' },
    { type: 'test', icon: <TestTube />, label: 'Test' },
    { type: 'lint', icon: <Search />, label: 'Lint' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-6 w-6 text-primary" />
          Isolated Command Executor
        </CardTitle>
        <CardDescription>
          Run build, serve, test, and lint commands for a single project in
          isolation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label
            htmlFor="project-name"
            className="text-sm font-medium mb-2 block"
          >
            Project Name
          </label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g., your-awesome-app"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {commands.map(({ type, icon, label }) => (
            <Button
              key={type}
              variant="outline"
              onClick={() => handleExecute(type)}
              disabled={loadingCommand !== null}
            >
              {loadingCommand === type ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                icon
              )}
              {label}
            </Button>
          ))}
        </div>
        {command && (
          <div className="space-y-2">
            <h3 className="font-semibold">Generated Command:</h3>
            <CodeBlock code={command} language="bash" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
