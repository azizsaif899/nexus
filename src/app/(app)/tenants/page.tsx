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
import { mockTenants } from "@/lib/data";
import { PlusCircle } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary"> = {
    Active: "default",
    Inactive: "secondary",
}

const planVariant: Record<string, "default" | "secondary" | "outline"> = {
    Enterprise: "default",
    Pro: "secondary",
    Free: "outline",
}

export default function TenantsPage() {
  return (
    <>
      <PageHeader
        title="Tenants"
        description="Administer tenants and their subscriptions."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Tenant
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Tenant List</CardTitle>
          <CardDescription>
            An overview of all tenants using Symphony.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>
                    <Badge variant={planVariant[tenant.plan] || "default"}>{tenant.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[tenant.status] || "default"}>{tenant.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
