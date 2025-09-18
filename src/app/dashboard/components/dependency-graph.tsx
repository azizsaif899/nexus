
'use client';

import { useState } from 'react';
import { GitBranch, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface NxGraph {
  graph: {
    nodes: Record<string, { type: string; name: string; data: unknown }>;
    dependencies: Record<
      string,
      { source: string; target: string; type: string }[]
    >;
  };
}

interface ProjectNode {
  name: string;
  type: string;
  dependencies: string[];
}

export default function DependencyGraph() {
  const [graphJson, setGraphJson] = useState('');
  const [projects, setProjects] = useState<ProjectNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyzeGraph = () => {
    setError(null);
    setProjects([]);
    if (!graphJson) {
      setError('Please paste the JSON output from `nx graph`.');
      return;
    }
    try {
      const data: NxGraph = JSON.parse(graphJson);
      if (!data.graph || !data.graph.nodes || !data.graph.dependencies) {
        throw new Error('Invalid graph format.');
      }

      const projectNodes = Object.values(data.graph.nodes)
        .filter((node) => node.type === 'app' || node.type === 'lib')
        .map((node) => {
          const deps = data.graph.dependencies[node.name] || [];
          return {
            name: node.name,
            type: node.type,
            dependencies: deps.map((dep) => dep.target),
          };
        });

      setProjects(projectNodes);
    } catch {
      setError('Failed to parse JSON. Please ensure it is valid graph output.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-6 w-6 text-primary" />
          Project Dependency Graph
        </CardTitle>
        <CardDescription>
          Paste the JSON output of `nx graph` to visualize project dependencies
          and potential conflicts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label
            htmlFor="graph-json"
            className="text-sm font-medium mb-2 block"
          >
            Graph JSON from `nx graph --file=output.json`
          </label>
          <Textarea
            id="graph-json"
            value={graphJson}
            onChange={(e) => setGraphJson(e.target.value)}
            placeholder="Paste JSON here..."
            className="min-h-[150px] font-code text-xs"
          />
        </div>
        <Button onClick={analyzeGraph}>Analyze Graph</Button>
        {error && (
          <p className="text-destructive text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {error}
          </p>
        )}
        {projects.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            {projects.map((project) => (
              <AccordionItem value={project.name} key={project.name}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span>{project.name}</span>
                    <Badge
                      variant={project.type === 'app' ? 'default' : 'secondary'}
                    >
                      {project.type}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {project.dependencies.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {project.dependencies.map((dep) => (
                        <li key={dep}>{dep}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No dependencies found.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
