'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, FileJson, FileCode, Leaf, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateConflictPreventionRules } from '../actions';
import { GenerateConflictPreventionRulesOutput } from '../ai/generate-conflict-prevention-rules';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  projectName: z.string().min(1, 'Project name is required.'),
  projectType: z.string().min(1, 'Project type is required.'),
  projectScope: z.string().min(1, 'Project scope is required.'),
});

export default function ConflictPreventionGenerator() {
  const [result, setResult] = useState<GenerateConflictPreventionRulesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      projectType: 'application',
      projectScope: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await handleGenerateConflictPreventionRules(values);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: response.error,
      });
    }

    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          قواعد منع التضارب
        </CardTitle>
        <CardDescription>
          توليد قواعد ESLint ومسارات TypeScript وبادئات متغيرات البيئة لضمان العزل
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المشروع</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: my-feature" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المشروع</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: application" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="projectScope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نطاق المشروع</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: scope:my-feature" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              توليد القواعد
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FileJson className="h-5 w-5 text-muted-foreground" />
                قواعد ESLint (.eslintrc.json)
              </h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{result.eslintRules}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FileCode className="h-5 w-5 text-muted-foreground" />
                مسارات TypeScript (tsconfig.json)
              </h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{result.typescriptPathMappings}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Leaf className="h-5 w-5 text-muted-foreground" />
                بادئة متغيرات البيئة
              </h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{result.environmentVariablePrefix}</code>
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}