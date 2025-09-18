
'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame, GitBranch, Loader2 } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Textarea } from '../../../components/ui/textarea';
import { useToast } from '../../../components/ui/use-toast';
import { handleSuggestDependencyFirewallRules } from '@/app/dashboard/actions';
import { SuggestDependencyFirewallRulesOutput } from '@/app/dashboard/ai/suggest-dependency-firewall-rules';
import { Skeleton } from '../../../components/ui/skeleton';
import { CodeBlock } from '../../../components/ui/code-block';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';

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
  const [result, setResult] =
    useState<SuggestDependencyFirewallRulesOutput | null>(null);
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
        title: 'Error',
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
          Dependency Firewall
        </CardTitle>
        <CardDescription>
          Analyze package.json for stricter dependencies and discover implicit
          shared libraries.
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
                  <FormLabel>package.json content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{ "name": "my-app", "dependencies": { ... } }'
                      className="min-h-[150px] font-code text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Dependencies
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
              <AlertTitle>Recommendations</AlertTitle>
              <AlertDescription>
                <CodeBlock code={result.recommendations} language="markdown" />
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <Flame className="h-4 w-4" />
              <AlertTitle>Unexpected Dependencies</AlertTitle>
              <AlertDescription>
                <CodeBlock
                  code={result.unexpectedDependencies}
                  language="markdown"
                />
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
