import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and application settings."
      />
      <Card>
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
          <CardDescription>
            This page is currently under development. Check back soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings for profile, billing, notifications, and integrations will be available here.</p>
        </CardContent>
      </Card>
    </>
  );
}
