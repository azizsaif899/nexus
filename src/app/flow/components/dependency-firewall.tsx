'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame, GitBranch, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleSuggestDependencyFirewallRules } from '../actions';
import { SuggestDependencyFirewallRulesOutput } from '../ai/suggest-dependency-firewall-rules';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  packageJsonContent: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid JSON format.' },
  ),
});

export default function DependencyFirewall() {
  const [result, setResult] = useState<SuggestDependencyFirewallRulesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageJsonContent: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await handleSuggestDependencyFirewallRules(values);
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
          <Flame className="h-6 w-6 text-primary" />
          جدار حماية التبعيات
        </CardTitle>
        <CardDescription>
          تحليل package.json للحصول على تبعيات أكثر صرامة واكتشاف المكتبات المشتركة الضمنية
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="packageJsonContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>محتوى package.json</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{ "name": "my-app", "dependencies": { ... } }'
                      className="min-h-[150px] font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              تحليل التبعيات
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-6">
            <Alert>
              <GitBranch className="h-4 w-4" />
              <AlertTitle>التوصيات</AlertTitle>
              <AlertDescription>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mt-2">
                  <code>{result.recommendations}</code>
                </pre>
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <Flame className="h-4 w-4" />
              <AlertTitle>التبعيات غير المتوقعة</AlertTitle>
              <AlertDescription>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mt-2">
                  <code>{result.unexpectedDependencies}</code>
                </pre>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}