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
import { mockCampaigns } from "@/lib/data";
import { Platform } from "@/lib/types";
import { Facebook, Linkedin, PlusCircle } from "lucide-react";
import { TiktokIcon, SnapchatIcon } from "@/components/icons";
import { Bot } from "lucide-react";

const platformIcons: Record<Platform, React.ReactNode> = {
  Meta: <Facebook className="h-5 w-5" />,
  TikTok: <TiktokIcon className="h-5 w-5" />,
  Snapchat: <SnapchatIcon className="h-5 w-5" />,
  LinkedIn: <Linkedin className="h-5 w-5" />,
  WhatsApp: <Bot className="h-5 w-5" />,
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    Active: "default",
    Paused: "secondary",
    Ended: "outline",
}

export default function CampaignsPage() {
  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Manage your multi-platform marketing campaigns."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Campaign List</CardTitle>
          <CardDescription>
            An overview of all your current and past campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {platformIcons[campaign.platform]}
                        {campaign.platform}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[campaign.status] || 'default'}>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                  <TableCell>${campaign.spent.toLocaleString()}</TableCell>
                  <TableCell>{campaign.startDate}</TableCell>
                  <TableCell>{campaign.endDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
