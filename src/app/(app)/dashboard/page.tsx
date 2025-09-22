import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  Users,
  Megaphone,
  Bot,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Active Users",
    value: "+2350",
    change: "+180.1% from last month",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Active Campaigns",
    value: "4",
    change: "+2 since last month",
    icon: <Megaphone className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Active Bots",
    value: "2",
    change: "No change",
    icon: <Bot className="h-4 w-4 text-muted-foreground" />,
  },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Here's a quick overview of your marketing performance."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "New lead from Summer Sale campaign.",
                "Welcome Bot handled a new user interaction.",
                "Brand Awareness Q3 campaign was paused.",
                "New user 'Charlie Brown' was added.",
              ].map((activity, i) => (
                <div key={i} className="flex items-center">
                  <Activity className="h-4 w-4 mr-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
