"use client";

import * as React from "react";
import {
    Users,
    Search,
    Shield,
    ShieldCheck,
    MoreHorizontal,
    Loader2,
    Mail,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent } from "~/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { toast } from "sonner";

const roles = ["ADMIN", "CUSTOMER"];

export default function AdminUsersPage() {
    const users = useQuery(api.users.list, {});
    const updateRole = useMutation(api.users.updateRole);

    const [search, setSearch] = React.useState("");
    const [filterRole, setFilterRole] = React.useState<string>("ALL");
    const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

    const isLoading = users === undefined;

    // Filter users
    const filteredUsers = React.useMemo(() => {
        if (!users) return [];
        return users.filter((u) => {
            const matchesSearch =
                u.email?.toLowerCase().includes(search.toLowerCase()) ||
                u.name?.toLowerCase().includes(search.toLowerCase());
            const matchesRole = filterRole === "ALL" || u.role === filterRole;
            return matchesSearch && matchesRole;
        });
    }, [users, search, filterRole]);

    const handleRoleChange = async (userId: Id<"users">, newRole: string) => {
        setIsUpdating(userId);
        try {
            await updateRole({ id: userId, role: newRole });
            toast.success(`User role updated to ${newRole.toLowerCase()}`);
        } catch (error) {
            toast.error("Failed to update user role");
        } finally {
            setIsUpdating(null);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const adminCount = users?.filter((u) => u.role === "ADMIN").length ?? 0;
    const customerCount = users?.filter((u) => u.role === "CUSTOMER").length ?? 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold font-serif">Users</h1>
                <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{users?.length ?? 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`border-none shadow-sm cursor-pointer ${filterRole === "ADMIN" ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setFilterRole(filterRole === "ADMIN" ? "ALL" : "ADMIN")}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blush/10">
                                <ShieldCheck className="h-6 w-6 text-blush" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Admins</p>
                                <p className="text-2xl font-bold">{adminCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`border-none shadow-sm cursor-pointer ${filterRole === "CUSTOMER" ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setFilterRole(filterRole === "CUSTOMER" ? "ALL" : "CUSTOMER")}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/10">
                                <Users className="h-6 w-6 text-sage" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Customers</p>
                                <p className="text-2xl font-bold">{customerCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterRole} onValueChange={setFilterRole}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roles</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role.charAt(0) + role.slice(1).toLowerCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            ))}
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="font-semibold">No users found</h3>
                            <p className="text-muted-foreground text-sm">
                                {search || filterRole !== "ALL"
                                    ? "Try adjusting your filters"
                                    : "Users will appear here when they register"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium">
                                                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <span className="font-medium">
                                                    {user.name || "Unnamed User"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.role === "ADMIN" ? "default" : "secondary"}
                                                className="gap-1"
                                            >
                                                {user.role === "ADMIN" ? (
                                                    <ShieldCheck className="h-3 w-3" />
                                                ) : (
                                                    <Shield className="h-3 w-3" />
                                                )}
                                                {user.role?.toLowerCase() ?? "customer"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(user.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={isUpdating === user._id}
                                                    >
                                                        {isUpdating === user._id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleRoleChange(
                                                                user._id as Id<"users">,
                                                                user.role === "ADMIN" ? "CUSTOMER" : "ADMIN"
                                                            )
                                                        }
                                                    >
                                                        {user.role === "ADMIN" ? (
                                                            <>
                                                                <Shield className="mr-2 h-4 w-4" />
                                                                Demote to Customer
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                                Promote to Admin
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
