'use client';

import React, { useState } from 'react';
import { Play, TestTube, Code, Search, Terminal, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type CommandType = 'serve' | 'build' | 'test' | 'lint';

export default function IsolatedExecutor() {
  const [projectName, setProjectName] = useState('');
  const [command, setCommand] = useState('');
  const [loadingCommand, setLoadingCommand] = useState<CommandType | null>(null);

  const handleExecute = (type: CommandType) => {
    if (!projectName) {
      setCommand(`echo "يرجى إدخال اسم المشروع."`);
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
    { type: 'serve', icon: <Play />, label: 'تشغيل' },
    { type: 'build', icon: <Code />, label: 'بناء' },
    { type: 'test', icon: <TestTube />, label: 'اختبار' },
    { type: 'lint', icon: <Search />, label: 'فحص' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-6 w-6 text-primary" />
          منفذ الأوامر المعزول
        </CardTitle>
        <CardDescription>
          تشغيل أوامر البناء والتشغيل والاختبار والفحص لمشروع واحد بشكل معزول
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="project-name" className="text-sm font-medium mb-2 block">
            اسم المشروع
          </label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="مثال: your-awesome-app"
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
            <h3 className="font-semibold">الأمر المُولد:</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{command}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}