import { PageHeader } from "@/components/app/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { mockTenants, mockUsers } from "@/lib/data";
import { PlusCircle } from "lucide-react";

const roleVariant: Record<string, "default" | "secondary" | "outline"> = {
    Admin: "default",
    Manager: "secondary",
    Viewer: "outline",
}

export default function UsersPage() {
  const getTenantName = (tenantId: string) => {
    return mockTenants.find(t => t.id === tenantId)?.name || "N/A";
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage all users in your organization."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New User
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            View and manage all registered users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tenant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name}/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleVariant[user.role] || 'default'}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{getTenantName(user.tenantId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
