"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
    LayoutDashboard,
    Flower2,
    Briefcase,
    Settings,
    HelpCircle,
    Bot,
    MessageSquare,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";


import { Button } from "~/components/ui/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";

const adminLinks = [
    {
        title: "Catalog",
        description: "Manage flower arrangements and products",
        href: "/admin/catalog",
        icon: Flower2,
        color: "bg-primary/10 text-primary",
    },
    {
        title: "Services",
        description: "Manage service offerings",
        href: "/admin/services",
        icon: Briefcase,
        color: "bg-sage/10 text-sage",
    },
    {
        title: "Settings",
        description: "Site settings, contact info, hero content",
        href: "/admin/settings",
        icon: Settings,
        color: "bg-blush/10 text-blush",
    },
    {
        title: "FAQ",
        description: "Manage frequently asked questions",
        href: "/admin/faq",
        icon: HelpCircle,
        color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    },
    {
        title: "AI Bot",
        description: "Configure AI assistant settings",
        href: "/admin/ai",
        icon: Bot,
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
];

export default function AdminDashboard() {
    const prefersReducedMotion = useReducedMotion();

    // Fetch dashboard stats
    const catalogItems = useQuery(api.catalog.listAll, {});
    const services = useQuery(api.services.listAll, {});
    const inquiries = useQuery(api.contact.list, {});
    const faqItems = useQuery(api.faq.listAll, {});

    const stats = [
        {
            label: "Catalog Items",
            value: catalogItems?.length ?? 0,
            icon: Flower2,
            color: "text-primary",
            description: `${catalogItems?.filter(i => i.published).length ?? 0} published`,
        },
        {
            label: "Services",
            value: services?.length ?? 0,
            icon: Briefcase,
            color: "text-sage",
            description: `${services?.filter(s => s.published).length ?? 0} active`,
        },
        {
            label: "Inquiries",
            value: inquiries?.length ?? 0,
            icon: MessageSquare,
            color: "text-blush",
            description: `${inquiries?.filter(i => i.status === "new").length ?? 0} new`,
        },
        {
            label: "FAQ Items",
            value: faqItems?.length ?? 0,
            icon: HelpCircle,
            color: "text-amber-500",
            description: `${faqItems?.filter(f => f.published).length ?? 0} published`,
        },
    ];

    // Recent inquiries
    const recentInquiries = inquiries?.slice(0, 5) ?? [];

    return (
        <main className="min-h-screen bg-background">


            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                {/* Header */}
                <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                            <LayoutDashboard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
                            <p className="text-muted-foreground">Manage your Grace Blooms catalog</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <motion.div
                                    whileHover={prefersReducedMotion ? {} : { y: -4 }}
                                    className="rounded-2xl border bg-card p-6 transition-all hover:shadow-bloom"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <Icon className={`h-8 w-8 ${stat.color}`} />
                                        <span className="text-3xl font-bold">{stat.value}</span>
                                    </div>
                                    <p className="font-medium">{stat.label}</p>
                                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                                </motion.div>
                            </ScrollReveal>
                        );
                    })}
                </div>

                {/* Quick Actions Grid */}
                <div className="mb-12">
                    <h2 className="font-serif text-2xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {adminLinks.map((link, i) => {
                            const Icon = link.icon;
                            return (
                                <ScrollReveal key={i} delay={i * 0.1}>
                                    <Link href={link.href}>
                                        <motion.div
                                            whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.02 }}
                                            className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-bloom cursor-pointer"
                                        >
                                            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${link.color} transition-transform group-hover:scale-110`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-serif text-xl font-bold mb-2">{link.title}</h3>
                                            <p className="text-sm text-muted-foreground">{link.description}</p>
                                        </motion.div>
                                    </Link>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Inquiries */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-2xl font-bold">Recent Inquiries</h2>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/inquiries">View All</Link>
                        </Button>
                    </div>

                    {recentInquiries.length > 0 ? (
                        <div className="rounded-2xl border bg-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/30">
                                            <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Source</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentInquiries.map((inquiry) => (
                                            <tr key={inquiry._id} className="border-b last:border-0 hover:bg-muted/20">
                                                <td className="px-6 py-4 font-medium">{inquiry.name}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{inquiry.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium capitalize">
                                                        {inquiry.source.replace("_", " ")}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${inquiry.status === "new"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                                        : inquiry.status === "contacted"
                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                        }`}>
                                                        {inquiry.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border bg-card p-12 text-center">
                            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="font-medium mb-2">No inquiries yet</h3>
                            <p className="text-sm text-muted-foreground">
                                When customers submit contact forms, they&apos;ll appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>


        </main>
    );
}
