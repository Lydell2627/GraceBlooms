"use client";

import * as React from "react";
import {
    ShoppingCart,
    Search,
    Eye,
    ChevronDown,
    Package,
    Check,
    Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
    Card,
    CardContent,
} from "~/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Separator } from "~/components/ui/separator";
import { toast } from "sonner";

const statuses = ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, string> = {
    PENDING: "secondary",
    PROCESSING: "default",
    DELIVERED: "sage",
    CANCELLED: "destructive",
};

export default function AdminOrdersPage() {
    const orders = useQuery(api.orders.list, {});
    const updateOrderStatus = useMutation(api.orders.updateStatus);

    const [search, setSearch] = React.useState("");
    const [filterStatus, setFilterStatus] = React.useState<string>("ALL");
    const [selectedOrder, setSelectedOrder] = React.useState<NonNullable<typeof orders>[number] | null>(null);
    const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

    const isLoading = orders === undefined;

    // Filter orders
    const filteredOrders = React.useMemo(() => {
        if (!orders) return [];
        return orders.filter((o) => {
            const matchesSearch =
                o.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
                o.userName?.toLowerCase().includes(search.toLowerCase()) ||
                o._id.includes(search);
            const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [orders, search, filterStatus]);

    const handleStatusChange = async (orderId: Id<"orders">, newStatus: string) => {
        setIsUpdating(orderId);
        try {
            await updateOrderStatus({ id: orderId, status: newStatus });
            toast.success(`Order status updated to ${newStatus.toLowerCase()}`);
        } catch (error) {
            toast.error("Failed to update order status");
        } finally {
            setIsUpdating(null);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold font-serif">Orders</h1>
                <p className="text-muted-foreground">Manage customer orders</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                {statuses.map((status) => {
                    const count = orders?.filter((o) => o.status === status).length ?? 0;
                    return (
                        <Card
                            key={status}
                            className={`border-none shadow-sm cursor-pointer transition-colors ${filterStatus === status ? "ring-2 ring-primary" : ""}`}
                            onClick={() => setFilterStatus(filterStatus === status ? "ALL" : status)}
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {status.toLowerCase()}
                                        </p>
                                        <p className="text-2xl font-bold">{count}</p>
                                    </div>
                                    <Badge variant={statusColors[status] as any}>{status}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by customer or order ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
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
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="font-semibold">No orders found</h3>
                            <p className="text-muted-foreground text-sm">
                                {search || filterStatus !== "ALL"
                                    ? "Try adjusting your filters"
                                    : "Orders will appear here when customers place them"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-mono text-sm">
                                            #{order._id.slice(-8)}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {order.userName || "Guest"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.userEmail || "No email"}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{order.items.length} items</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ${order.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-1"
                                                        disabled={isUpdating === order._id}
                                                    >
                                                        {isUpdating === order._id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Badge variant={statusColors[order.status] as any}>
                                                                {order.status.toLowerCase()}
                                                            </Badge>
                                                        )}
                                                        <ChevronDown className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {statuses.map((status) => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    order._id as Id<"orders">,
                                                                    status
                                                                )
                                                            }
                                                        >
                                                            {order.status === status && (
                                                                <Check className="mr-2 h-4 w-4" />
                                                            )}
                                                            <span className="capitalize">
                                                                {status.toLowerCase()}
                                                            </span>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(order.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Order #{selectedOrder?._id.slice(-8)}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        {selectedOrder.userName || "Guest Customer"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedOrder.userEmail || "No email provided"}
                                    </p>
                                </div>
                                <Badge variant={statusColors[selectedOrder.status] as any}>
                                    {selectedOrder.status.toLowerCase()}
                                </Badge>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-medium mb-2">Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <span>{item.productName}</span>
                                                <Badge variant="outline">x{item.quantity}</Badge>
                                            </div>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {selectedOrder.shippingAddress && (
                                <>
                                    <div>
                                        <h4 className="font-medium mb-2">Shipping Address</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedOrder.shippingAddress.firstName}{" "}
                                            {selectedOrder.shippingAddress.lastName}
                                            <br />
                                            {selectedOrder.shippingAddress.address}
                                            <br />
                                            {selectedOrder.shippingAddress.city},{" "}
                                            {selectedOrder.shippingAddress.state}{" "}
                                            {selectedOrder.shippingAddress.zip}
                                        </p>
                                    </div>
                                    <Separator />
                                </>
                            )}

                            <div className="flex items-center justify-between font-bold">
                                <span>Total</span>
                                <span>${selectedOrder.total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
