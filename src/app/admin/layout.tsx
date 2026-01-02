"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Briefcase,
    HelpCircle,
    Bot,
    Settings,
    LogOut,
    Flower2,
    Menu,
    ChevronRight,
    AlertTriangle,
    MessageSquare,
    Users,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/app/_components/ThemeToggle";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "~/components/ui/sheet";
import { useAuth } from "~/app/_components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/catalog", label: "Catalog", icon: Package },
    { href: "/admin/services", label: "Services", icon: Briefcase },
    { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
    { href: "/admin/ai", label: "AI Bot", icon: Bot },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/admin/users", label: "Users", icon: Users },
];

function NavLink({
    href,
    label,
    icon: Icon,
    isActive,
    onClick,
}: {
    href: string;
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
            {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
        </Link>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    // Redirect to sign-in if not authenticated (using useEffect to avoid setState during render)
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/sign-in?redirect=/admin");
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/30">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Return null while redirecting (will show briefly before redirect completes)
    if (!isAuthenticated) {
        return null;
    }

    // Show access denied if not admin
    if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
                <Card className="max-w-md border-destructive/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                            <CardTitle className="text-destructive">Access Denied</CardTitle>
                        </div>
                        <CardDescription>
                            You don't have permission to access the admin dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            This area is restricted to administrators only. If you believe you should have access, please contact your system administrator.
                        </p>
                        <div className="flex gap-2">
                            <Button asChild className="flex-1">
                                <Link href="/">Go to Home</Link>
                            </Button>
                            <Button variant="outline" asChild className="flex-1">
                                <Link href="/sign-out">Sign Out</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold">
                    <Flower2 className="h-5 w-5 text-primary" />
                    <span>Grace <span className="text-primary italic">Admin</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        isActive={isActive(item.href)}
                        onClick={() => setMobileOpen(false)}
                    />
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t p-4 space-y-1">
                <NavLink
                    href="/admin/settings"
                    label="Settings"
                    icon={Settings}
                    isActive={isActive("/admin/settings")}
                />
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    <LogOut className="h-4 w-4" />
                    Exit Admin
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r bg-background lg:block">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:pl-64">
                {/* Top Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md lg:px-8">
                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>

                    {/* Page Title */}
                    <div className="hidden lg:block">
                        <h1 className="text-lg font-semibold capitalize">
                            {pathname === "/admin"
                                ? "Dashboard"
                                : pathname.split("/").pop()?.replace("-", " ")}
                        </h1>
                    </div>

                    {/* Mobile Logo */}
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 font-serif font-bold lg:hidden"
                    >
                        <Flower2 className="h-5 w-5 text-primary" />
                        <span>Admin</span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                            <Link href="/">View Store</Link>
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
