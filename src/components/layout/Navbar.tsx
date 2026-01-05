"use client";

import * as React from "react";
import Link from "next/link";
import NextImage from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Flower2, Menu, User, LogOut, Sparkles, Phone, MessageCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";

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
import { useScrollDirection } from "~/hooks/useScrollDirection";

const collections: { title: string; href: string; description: string }[] = [
    {
        title: "Wedding Arrangements",
        href: "/catalog?category=wedding",
        description: "Elegant white lilies, roses, and custom bridal bouquets.",
    },
    {
        title: "Anniversary Blooms",
        href: "/catalog?category=anniversary",
        description: "Romantic red roses and seasonal favorites for your special milestones.",
    },
    {
        title: "Birthday Surprises",
        href: "/catalog?category=birthday",
        description: "Bright and cheerful mixes to celebrate another wonderful year.",
    },
    {
        title: "Sympathy & Funeral",
        href: "/catalog?category=sympathy",
        description: "Respectful and serene tributes to honor and remember.",
    },
    {
        title: "Custom Orders",
        href: "/catalog?category=custom",
        description: "Work with our designers to create something unique.",
    },
    {
        title: "All Occasions",
        href: "/catalog",
        description: "Browse our complete catalog of arrangements.",
    },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const { user, isAuthenticated, isLoading } = useAuth();
    const settings = useQuery(api.settings.get, {});
    const prefersReducedMotion = useReducedMotion();
    const scrollDirection = useScrollDirection();
    const navRef = React.useRef<HTMLElement>(null);

    // Dynamic contact info from settings
    const whatsappNumber = settings?.whatsappNumber || "919876543210";
    const phoneNumber = settings?.phoneNumber || "+919876543210";

    // GSAP hide/show animation based on scroll direction
    React.useEffect(() => {
        if (!navRef.current || prefersReducedMotion) return;

        const animateNavbar = async () => {
            try {
                const gsap = (await import("gsap")).default;

                if (scrollDirection === "down") {
                    gsap.to(navRef.current, {
                        y: -100,
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.out",
                    });
                } else if (scrollDirection === "up") {
                    gsap.to(navRef.current, {
                        y: 0,
                        opacity: 1,
                        duration: 0.3,
                        ease: "power2.inOut",
                    });
                }
            } catch (error) {
                console.warn("GSAP animation failed:", error);
            }
        };

        animateNavbar();
    }, [scrollDirection, prefersReducedMotion]);

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
        <nav
            ref={navRef}
            className={cn(
                "navbar-floating rounded-full transition-all duration-500 shadow-lg",
                "dark:navbar-glass-dark navbar-glass-light"
            )}
        >
            <div className="container mx-auto flex h-16 items-center justify-center px-6 lg:h-18 lg:px-8 relative">
                {/* Logo with hover animation - positioned absolutely on left */}
                <Link
                    href="/"
                    className="group absolute left-6 lg:left-8 flex items-center gap-2 font-serif text-xl font-bold tracking-tight lg:text-2xl"
                >
                    <motion.div
                        whileHover={prefersReducedMotion ? {} : { rotate: 12, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Flower2 className="h-6 w-6 text-primary transition-colors group-hover:text-primary/80" />
                    </motion.div>
                    <span className="flex items-center gap-1">
                        <span className="transition-colors duration-300 text-foreground">
                            Grace{" "}
                        </span>
                        <span className="italic text-primary">Blooms</span>
                    </span>
                </Link>

                {/* Desktop Navigation - Centered */}
                <div className="hidden lg:block">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="navbar-link bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50">
                                    Explore
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className="group flex h-full w-full select-none flex-col justify-end rounded-2xl bg-gradient-to-b from-primary/15 to-primary/5 p-6 no-underline outline-none transition-all duration-300 hover:from-primary/25 hover:to-primary/10 focus:shadow-md"
                                                    href="/catalog"
                                                >
                                                    <div className="relative">
                                                        <Sparkles className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                                                    </div>
                                                    <div className="mb-2 mt-4 text-lg font-medium font-serif">
                                                        Browse Catalog
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground">
                                                        Discover our handcrafted arrangements for every occasion.
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem href="/services" title="Our Services">
                                            Wedding florals, subscriptions, and custom designs.
                                        </ListItem>
                                        <ListItem href="/about" title="Our Story">
                                            Learn about our commitment to quality and craftsmanship.
                                        </ListItem>
                                        <ListItem href="/contact" title="Contact Us">
                                            Get in touch via WhatsApp, phone, or email.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="navbar-link bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50">
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
                                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "navbar-link bg-transparent hover:bg-accent/50")}>
                                    <Link href="/catalog">
                                        Catalog
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "navbar-link bg-transparent hover:bg-accent/50")}>
                                    <Link href={isAuthenticated ? "/contact" : "/sign-in?redirect=/contact"}>
                                        Contact
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right Actions - positioned absolutely on right */}
                <div className="flex items-center gap-1 lg:gap-2 absolute right-6 lg:right-8">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Contact Quick Actions (Desktop) - Only show when authenticated */}
                    {isAuthenticated && (
                        <div className="hidden lg:flex items-center gap-1">
                            <Button variant="ghost" size="icon" asChild className="text-primary hover:text-primary/80">
                                <a href={`tel:${phoneNumber}`} aria-label="Call us">
                                    <Phone className="h-5 w-5" />
                                </a>
                            </Button>
                            <Button variant="ghost" size="icon" asChild className="text-green-600 hover:text-green-500">
                                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                    <MessageCircle className="h-5 w-5" />
                                </a>
                            </Button>
                        </div>
                    )}

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
                                        <Link href="/my-inquiries" className="flex items-center gap-2">
                                            <MessageCircle className="h-4 w-4" />
                                            My Inquiries
                                        </Link>
                                    </DropdownMenuItem>
                                    {user.role === "ADMIN" && (
                                        <DropdownMenuItem asChild className="rounded-lg">
                                            <Link href="/admin" className="flex items-center gap-2">
                                                <Sparkles className="h-4 w-4" />
                                                Admin Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
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
                                <Button asChild className="rounded-full bg-[#A3B18A] hover:bg-[#8fa175] text-white">
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
                        <SheetContent side="right" className="w-80 border-l-0 bg-background/95 backdrop-blur-xl overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="font-serif text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="mt-6 flex flex-col gap-2 pb-8">
                                {[
                                    { href: "/catalog", label: "Browse Catalog" },
                                    { href: "/catalog?category=wedding", label: "Wedding" },
                                    { href: "/catalog?category=birthday", label: "Birthday" },
                                    { href: "/catalog?category=anniversary", label: "Anniversary" },
                                    { href: "/services", label: "Services" },
                                    { href: "/about", label: "About Us" },
                                    { href: isAuthenticated ? "/contact" : "/sign-in?redirect=/contact", label: "Contact" },
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

                                {/* Mobile Contact Quick Actions - Only show when authenticated */}
                                {isAuthenticated && (
                                    <div className="flex gap-2 px-4 mb-4">
                                        <Button variant="outline" className="flex-1 rounded-xl" asChild>
                                            <a href={`tel:${phoneNumber}`}>
                                                <Phone className="h-4 w-4 mr-2" />
                                                Call
                                            </a>
                                        </Button>
                                        <Button className="flex-1 rounded-xl bg-green-600 hover:bg-green-500" asChild>
                                            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                WhatsApp
                                            </a>
                                        </Button>
                                    </div>
                                )}

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
                                            href="/my-inquiries"
                                            className="block rounded-xl px-4 py-3 text-lg font-medium transition-colors hover:bg-accent"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            My Inquiries
                                        </Link>
                                        {user.role === "ADMIN" && (
                                            <Link
                                                href="/admin"
                                                className="block rounded-xl px-4 py-3 text-lg font-medium transition-colors hover:bg-accent"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
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
        </nav>
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
