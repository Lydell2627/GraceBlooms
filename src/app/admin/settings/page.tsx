"use client";

import * as React from "react";
import { Bell, Mail, Palette, Save, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { toast } from "sonner";

export default function AdminSettingsPage() {
    const [email, setEmail] = React.useState("hello@graceblooms.com");
    const [phone, setPhone] = React.useState("(555) 123-4567");
    const [address, setAddress] = React.useState("123 Flower District, New York, NY 10001");

    const [orderNotifications, setOrderNotifications] = React.useState(true);
    const [lowStockAlerts, setLowStockAlerts] = React.useState(true);
    const [newUserNotifications, setNewUserNotifications] = React.useState(false);

    const [defaultTheme, setDefaultTheme] = React.useState("light");

    const handleSaveChanges = () => {
        toast.success("Settings saved successfully", {
            description: "Your changes have been applied.",
        });
    };

    const handleClearOrders = () => {
        toast.success("Orders cleared", {
            description: "All orders have been removed from the system.",
        });
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Store Configuration */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Store Configuration
                    </CardTitle>
                    <CardDescription>
                        Manage your store's contact information and details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input
                            id="store-name"
                            value="Grace Blooms"
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                            Store name is managed in the global config
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="hello@graceblooms.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Support Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(555) 123-4567"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Store Address</Label>
                        <Input
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="123 Flower District, New York, NY"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Email Notifications */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Notifications
                    </CardTitle>
                    <CardDescription>
                        Configure when you receive email alerts
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="order-notifications">Order Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive emails when new orders are placed
                            </p>
                        </div>
                        <Switch
                            id="order-notifications"
                            checked={orderNotifications}
                            onCheckedChange={setOrderNotifications}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="low-stock">Low Stock Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when products are running low
                            </p>
                        </div>
                        <Switch
                            id="low-stock"
                            checked={lowStockAlerts}
                            onCheckedChange={setLowStockAlerts}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="new-users">New User Registrations</Label>
                            <p className="text-sm text-muted-foreground">
                                Email alerts for new customer sign-ups
                            </p>
                        </div>
                        <Switch
                            id="new-users"
                            checked={newUserNotifications}
                            onCheckedChange={setNewUserNotifications}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Appearance
                    </CardTitle>
                    <CardDescription>
                        Customize the look and feel of your admin panel
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Default Customer Theme</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            The theme new customers see on first visit
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant={defaultTheme === "light" ? "default" : "outline"}
                                onClick={() => setDefaultTheme("light")}
                                className="flex-1"
                            >
                                Light
                            </Button>
                            <Button
                                variant={defaultTheme === "dark" ? "default" : "outline"}
                                onClick={() => setDefaultTheme("dark")}
                                className="flex-1"
                            >
                                Dark
                            </Button>
                            <Button
                                variant={defaultTheme === "system" ? "default" : "outline"}
                                onClick={() => setDefaultTheme("system")}
                                className="flex-1"
                            >
                                System
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSaveChanges} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            {/* Danger Zone */}
            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions that permanently affect your data
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear All Orders
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all
                                    order records from the database.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleClearOrders}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Yes, clear all orders
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <p className="text-xs text-muted-foreground px-2">
                        Use these actions with extreme caution. They are intended for testing and demo purposes only.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
