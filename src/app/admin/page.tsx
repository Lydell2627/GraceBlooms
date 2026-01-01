"use client";

import * as React from "react";
import Link from "next/link";
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Eye,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";

export default function AdminDashboardPage() {
    const products = useQuery(api.products.list, {});
    const orders = useQuery(api.orders.list, {});
    const users = useQuery(api.users.list, {});

    const isLoading = products === undefined || orders === undefined || users === undefined;

    // Calculate stats
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) ?? 0;
    const pendingOrders = orders?.filter((o) => o.status === "PENDING").length ?? 0;
    const lowStockProducts = products?.filter((p) => p.stock < 10).length ?? 0;

    const stats = [
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
        },
        {
            title: "Total Orders",
            value: orders?.length.toString() ?? "0",
            change: "+8.2%",
            trend: "up",
            icon: ShoppingCart,
        },
        {
            title: "Products",
            value: products?.length.toString() ?? "0",
            subtext: lowStockProducts > 0 ? `${lowStockProducts} low stock` : "All stocked",
            icon: Package,
        },
        {
            title: "Customers",
            value: users?.filter((u) => u.role === "CUSTOMER").length.toString() ?? "0",
            change: "+4.1%",
            trend: "up",
            icon: Users,
        },
    ];

    const recentOrders = orders?.slice(0, 5) ?? [];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    {stat.change && (
                                        <p className="flex items-center text-xs text-muted-foreground">
                                            {stat.trend === "up" ? (
                                                <ArrowUpRight className="mr-1 h-3 w-3 text-sage" />
                                            ) : (
                                                <ArrowDownRight className="mr-1 h-3 w-3 text-blush" />
                                            )}
                                            <span className={stat.trend === "up" ? "text-sage" : "text-blush"}>
                                                {stat.change}
                                            </span>
                                            <span className="ml-1">from last month</span>
                                        </p>
                                    )}
                                    {stat.subtext && (
                                        <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Orders */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest customer orders</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/orders">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                ))}
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No orders yet</p>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                <ShoppingCart className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {order.userName || order.userEmail || "Guest"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.items.length} items · ${order.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                order.status === "PENDING"
                                                    ? "secondary"
                                                    : order.status === "DELIVERED"
                                                        ? "sage"
                                                        : "outline"
                                            }
                                        >
                                            {order.status.toLowerCase()}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common admin tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        <Button asChild className="justify-start">
                            <Link href="/admin/manage-products">
                                <Package className="mr-2 h-4 w-4" />
                                Add New Product
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="justify-start">
                            <Link href="/admin/orders">
                                <Eye className="mr-2 h-4 w-4" />
                                View Pending Orders
                                {pendingOrders > 0 && (
                                    <Badge variant="destructive" className="ml-auto">
                                        {pendingOrders}
                                    </Badge>
                                )}
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="justify-start">
                            <Link href="/admin/users">
                                <Users className="mr-2 h-4 w-4" />
                                Manage Users
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="justify-start">
                            <Link href="/" target="_blank">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                View Live Store
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Low Stock Alert */}
            {!isLoading && lowStockProducts > 0 && (
                <Card className="border-blush/20 bg-blush/5">
                    <CardHeader>
                        <CardTitle className="text-blush">Low Stock Alert</CardTitle>
                        <CardDescription>
                            {lowStockProducts} products have stock below 10 units
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {products
                                ?.filter((p) => p.stock < 10)
                                .slice(0, 5)
                                .map((product) => (
                                    <Badge key={product._id} variant="outline" className="border-blush/30">
                                        {product.name} ({product.stock} left)
                                    </Badge>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
