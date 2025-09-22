import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockBots } from "@/lib/data";
import { PlusCircle } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
    Active: "default",
    Inactive: "secondary",
    Draft: "outline",
}

export default function BotsPage() {
  return (
    <>
      <PageHeader
        title="WhatsApp Bots"
        description="Create and manage your automated WhatsApp bots."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Bot
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Bot List</CardTitle>
          <CardDescription>
            Here are the bots you've configured for your WhatsApp channels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bot Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interactions</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBots.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="font-medium">{bot.name}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[bot.status] || "default"}>{bot.status}</Badge>
                  </TableCell>
                  <TableCell>{bot.interactions.toLocaleString()}</TableCell>
                  <TableCell>{bot.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
