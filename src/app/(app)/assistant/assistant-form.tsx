"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CampaignOptimizationInput,
  CampaignOptimizationOutput,
} from "@/ai/flows/campaign-optimization-suggestions";
import { getSuggestions } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, CalendarClock, Palette, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  campaignData: z.string().min(10, "Please provide more details about your campaign data."),
  targetAudience: z.string().min(10, "Please describe your target audience in more detail."),
  campaignGoals: z.string().min(10, "Please specify your campaign goals more clearly."),
  currentPlatformAllocation: z.string().min(5, "Please describe your current platform allocation."),
});

export function AssistantForm() {
  const [result, setResult] = useState<CampaignOptimizationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignData: "",
      targetAudience: "",
      campaignGoals: "",
      currentPlatformAllocation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const input: CampaignOptimizationInput = values;
    const response = await getSuggestions(input);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || "An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>
            Provide your campaign information and let our AI assist you.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="campaignData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Performance Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., CTR: 2.5%, Conversion Rate: 1.2%, Engagement: 5k likes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Young professionals aged 25-35, interested in tech and finance..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="campaignGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Increase brand awareness, generate leads, drive sales..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="currentPlatformAllocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Platform Allocation</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Meta: 50%, TikTok: 30%, LinkedIn: 20%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Suggestions
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="space-y-8">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Generating suggestions...</p>
            </div>
          </div>
        )}
        
        {error && (
            <Alert variant="destructive">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result ? (
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="text-accent" />
                        AI-Powered Suggestions
                    </CardTitle>
                    <CardDescription>Here are some recommendations to optimize your campaign.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><CalendarClock className="h-4 w-4 text-primary" />Optimal Engagement Times</h3>
                        <p className="text-sm text-muted-foreground">{result.optimalEngagementTimes}</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><Palette className="h-4 w-4 text-primary" />Content Variations</h3>
                        <p className="text-sm text-muted-foreground">{result.contentVariations}</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><Share2 className="h-4 w-4 text-primary" />Platform Allocation</h3>
                        <p className="text-sm text-muted-foreground">{result.platformAllocationSuggestions}</p>
                    </div>
                </CardContent>
            </Card>
        ) : (
          !isLoading && (
            <div className="flex items-center justify-center h-full rounded-lg border border-dashed p-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="rounded-full bg-muted p-4">
                        <Lightbulb className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="mt-4 max-w-xs text-muted-foreground">
                        Your campaign optimization suggestions will appear here once you provide the details.
                    </p>
                </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
