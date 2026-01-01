"use client";

import * as React from "react";
import Link from "next/link";
import NextImage from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Flower2, ShoppingBag, Menu, User, LogOut, Sparkles } from "lucide-react";

import { useCart } from "~/hooks/useCart";
import { useAuth } from "~/app/_components/AuthProvider";
import { signOut } from "~/lib/auth-client";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ThemeToggle } from "~/app/_components/ThemeToggle";
import { cn } from "~/lib/utils";
import { CartSheet } from "./CartSheet";
import { CommandPalette } from "./CommandPalette";

const collections: { title: string; href: string; description: string }[] = [
    {
        title: "Wedding Arrangements",
        href: "/products?category=wedding",
        description: "Elegant white lilies, roses, and custom bridal bouquets.",
    },
    {
        title: "Anniversary Blooms",
        href: "/products?category=anniversary",
        description: "Romantic red roses and seasonal favorites for your special milestones.",
    },
    {
        title: "Birthday Surprises",
        href: "/products?category=birthday",
        description: "Bright and cheerful mixes to celebrate another wonderful year.",
    },
    {
        title: "Sympathy & Funeral",
        href: "/products?category=sympathy",
        description: "Respectful and serene tributes to honor and remember.",
    },
    {
        title: "Indoor Plants",
        href: "/products?category=plants",
        description: "Long-lasting greenery to bring nature into your home.",
    },
    {
        title: "Gift Baskets",
        href: "/products?category=gifts",
        description: "Combinations of flowers and gourmet treats.",
    },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const cartItems = useCart((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const { user, isAuthenticated, isLoading } = useAuth();
    const prefersReducedMotion = useReducedMotion();

    // Scroll-aware navigation styling
    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            await fetch("/api/auth/google", { method: "DELETE" });
            window.location.href = "/";
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-premium"
                    : "bg-transparent border-b border-transparent"
            )}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
                {/* Logo with hover animation */}
                <Link
                    href="/"
                    className="group flex items-center gap-2 font-serif text-xl font-bold tracking-tight lg:text-2xl"
                >
                    <motion.div
                        whileHover={prefersReducedMotion ? {} : { rotate: 12, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Flower2 className="h-6 w-6 text-primary transition-colors group-hover:text-primary/80" />
                    </motion.div>
                    <span className="flex items-center gap-1">
                        <span className={cn(
                            "transition-colors duration-300",
                            scrolled ? "text-foreground" : "text-foreground"
                        )}>
                            Grace{" "}
                        </span>
                        <span className="italic text-primary">Blooms</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:block">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50">
                                    Explore
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className="group flex h-full w-full select-none flex-col justify-end rounded-2xl bg-gradient-to-b from-primary/15 to-primary/5 p-6 no-underline outline-none transition-all duration-300 hover:from-primary/25 hover:to-primary/10 focus:shadow-md"
                                                    href="/products"
                                                >
                                                    <div className="relative">
                                                        <Sparkles className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                                                    </div>
                                                    <div className="mb-2 mt-4 text-lg font-medium font-serif">
                                                        Seasonal Specialties
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground">
                                                        Hand-picked blooms at their peak freshness. Updated daily.
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem href="/products" title="All Flowers">
                                            Browse our entire collection of fresh arrangements.
                                        </ListItem>
                                        <ListItem href="/#about" title="Our Story">
                                            Learn about our commitment to quality and local growers.
                                        </ListItem>
                                        <ListItem href="/chat" title="Flower Care">
                                            Get advice on how to keep your blooms lasting longer.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50">
                                    Collections
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {collections.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/products" legacyBehavior passHref>
                                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-accent/50")}>
                                        Shop All
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1 lg:gap-2">
                    {/* Search / Command Palette */}
                    <CommandPalette />

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Cart with animated badge */}
                    <CartSheet>
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            <AnimatePresence mode="wait">
                                {cartCount > 0 && (
                                    <motion.div
                                        key={cartCount}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                        className="absolute -right-1 -top-1"
                                    >
                                        <Badge
                                            variant="default"
                                            className="h-5 min-w-5 rounded-full px-1.5 text-xs flex items-center justify-center shadow-bloom"
                                        >
                                            {cartCount > 9 ? "9+" : cartCount}
                                        </Badge>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <span className="sr-only">Cart ({cartCount} items)</span>
                        </Button>
                    </CartSheet>

                    {/* Desktop Auth - Conditional */}
                    <div className="hidden items-center gap-2 lg:flex">
                        {isLoading ? (
                            <div className="h-9 w-20 animate-pulse rounded-xl bg-muted" />
                        ) : isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 rounded-xl">
                                        {user.image ? (
                                            <NextImage
                                                src={user.image}
                                                alt={user.name || "User"}
                                                width={28}
                                                height={28}
                                                className="h-7 w-7 rounded-full ring-2 ring-primary/20"
                                            />
                                        ) : (
                                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                        )}
                                        <span className="max-w-[100px] truncate">
                                            {user.name || user.email?.split("@")[0]}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                    <DropdownMenuItem asChild className="rounded-lg">
                                        <Link href="/profile" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-lg">
                                        <Link href="/orders" className="flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4" />
                                            My Orders
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 text-destructive focus:text-destructive rounded-lg"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button variant="ghost" asChild className="rounded-xl">
                                    <Link href="/sign-in">Sign In</Link>
                                </Button>
                                <Button asChild className="rounded-xl">
                                    <Link href="/sign-up">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 border-l-0 bg-background/95 backdrop-blur-xl">
                            <SheetHeader>
                                <SheetTitle className="font-serif text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="mt-8 flex flex-col gap-1">
                                {[
                                    { href: "/products", label: "Shop All" },
                                    { href: "/products?category=wedding", label: "Wedding" },
                                    { href: "/products?category=birthday", label: "Birthday" },
                                    { href: "/products?category=anniversary", label: "Anniversary" },
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="block rounded-xl px-4 py-3 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="my-4 h-px bg-border" />

                                {/* Mobile Auth - Conditional */}
                                {isLoading ? (
                                    <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
                                ) : isAuthenticated && user ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-4 px-4">
                                            {user.image ? (
                                                <NextImage
                                                    src={user.image}
                                                    alt={user.name || "User"}
                                                    width={48}
                                                    height={48}
                                                    className="h-12 w-12 rounded-full ring-2 ring-primary/20"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium">{user.name || "User"}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block rounded-xl px-4 py-3 text-lg font-medium transition-colors hover:bg-accent"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="block rounded-xl px-4 py-3 text-lg font-medium transition-colors hover:bg-accent"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            My Orders
                                        </Link>
                                        <div className="px-4 mt-4">
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
                                                onClick={() => {
                                                    setMobileMenuOpen(false);
                                                    handleSignOut();
                                                }}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Sign Out
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-4 space-y-3">
                                        <Link
                                            href="/sign-in"
                                            className="block rounded-xl px-4 py-3 text-lg font-medium transition-colors hover:bg-accent text-center"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Button asChild className="w-full rounded-xl">
                                            <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                                                Get Started
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.nav>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent/70 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
