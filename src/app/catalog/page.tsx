"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Search, SlidersHorizontal, X, MessageCircle, Phone, Mail } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { ProductCard } from "~/components/product/ProductCard";
import { QuickViewDialog } from "~/components/product/QuickViewDialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet";
import { ScrollReveal } from "~/components/ui/scroll-reveal";

interface CatalogItem {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    priceMin: number;
    priceMax: number;
    currency: string;
    category: string;
    tags: string[];
    images: string[];
    customizationAvailable?: boolean;
    leadTimeDays?: number;
    deliveryNotes?: string;
}

interface ProductItem {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    priceMin: number;
    priceMax: number;
    currency: string;
    category: string;
    tags: string[];
    images: string[];
    customizationAvailable?: boolean;
    leadTimeDays?: number;
    deliveryNotes?: string;
}

function toProductCardItem(item: CatalogItem): ProductItem {
    return {
        id: item._id,
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription || "",
        description: item.description || "",
        priceMin: item.priceMin,
        priceMax: item.priceMax,
        currency: item.currency,
        category: item.category,
        tags: item.tags,
        images: item.images,
        customizationAvailable: item.customizationAvailable,
        leadTimeDays: item.leadTimeDays,
        deliveryNotes: item.deliveryNotes,
    };
}

const tagOptions = ["featured", "new", "seasonal", "bestseller"];
const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
];

export default function CatalogPage() {
    const searchParams = useSearchParams();
    const prefersReducedMotion = useReducedMotion();

    // Filter states
    const [search, setSearch] = React.useState("");
    const [category, setCategory] = React.useState<string>(searchParams.get("category")?.toUpperCase() || "all");
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 25000]);
    const [sort, setSort] = React.useState("featured");
    const [filtersOpen, setFiltersOpen] = React.useState(false);

    const [quickViewProduct, setQuickViewProduct] = React.useState<ReturnType<typeof toProductCardItem> | null>(null);

    // Fetch data
    const categories = useQuery(api.catalog.getCategories, {});
    const searchResults = useQuery(api.catalog.search, { query: search });
    const catalogItems = useQuery(api.catalog.list, {
        category: category && category !== "all" ? category : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 25000 ? priceRange[1] : undefined,
        sort,
    });
    const settings = useQuery(api.settings.get, {});

    // Use search results if searching, otherwise use catalog list
    const items = search.trim() ? searchResults : catalogItems;
    const isLoading = items === undefined;

    // Update category when URL param changes
    React.useEffect(() => {
        const urlCategory = searchParams.get("category");
        if (urlCategory) {
            setCategory(urlCategory.toUpperCase());
        }
    }, [searchParams]);

    const clearFilters = () => {
        setCategory("all");
        setSelectedTags([]);
        setPriceRange([0, 25000]);
        setSort("featured");
    };

    const hasActiveFilters = (category && category !== "all") || selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 25000;

    // WhatsApp link
    const whatsappMessage = encodeURIComponent("Hi! I'm browsing your catalog and would like some help.");
    const whatsappLink = `https://wa.me/${settings?.whatsappNumber || "919876543210"}?text=${whatsappMessage}`;

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Category */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Tags */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold">Tags</Label>
                <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => (
                        <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer capitalize transition-all hover:scale-105"
                            onClick={() => {
                                setSelectedTags((prev) =>
                                    prev.includes(tag)
                                        ? prev.filter((t) => t !== tag)
                                        : [...prev, tag]
                                );
                            }}
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold">
                    Budget: ₹{priceRange[0].toLocaleString("en-IN")} – ₹{priceRange[1].toLocaleString("en-IN")}
                </Label>
                <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    min={0}
                    max={25000}
                    step={500}
                    className="py-4"
                />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button variant="ghost" className="w-full" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                            Our Catalog
                        </h1>
                        <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 px-2">
                            Browse our handcrafted arrangements and chat with our AI assistant for personalized help.
                        </p>

                        {/* Search */}
                        <div className="relative max-w-md mx-auto px-2">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search arrangements..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 h-12 rounded-xl text-base"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Catalog */}
            <section className="py-8 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Desktop Sidebar Filters */}
                        <aside className="hidden lg:block w-64 shrink-0">
                            <div className="sticky top-24 rounded-2xl border bg-card p-6">
                                <h3 className="font-semibold mb-4">Filters</h3>
                                <FilterContent />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Mobile Filter + Sort Bar */}
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {isLoading ? "Loading..." : `${items?.length || 0} items`}
                                    </span>
                                    {hasActiveFilters && (
                                        <Badge variant="secondary" className="text-xs">
                                            Filtered
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Mobile Filter Sheet */}
                                    <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                                        <SheetTrigger asChild className="lg:hidden">
                                            <Button variant="outline" size="sm">
                                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                                Filters
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-80">
                                            <SheetHeader>
                                                <SheetTitle>Filters</SheetTitle>
                                            </SheetHeader>
                                            <div className="mt-6">
                                                <FilterContent />
                                            </div>
                                        </SheetContent>
                                    </Sheet>

                                    {/* Sort */}
                                    <Select value={sort} onValueChange={setSort}>
                                        <SelectTrigger className="w-[160px] rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sortOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Product Grid */}
                            {isLoading ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="aspect-[4/5] rounded-3xl bg-muted animate-pulse" />
                                            <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                                            <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            ) : items && items.length > 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {items.map((item, i) => (
                                        <ScrollReveal key={item._id} delay={i * 0.05}>
                                            <ProductCard
                                                product={toProductCardItem(item)}
                                                onQuickView={(p) => setQuickViewProduct(p)}
                                            />
                                        </ScrollReveal>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="mb-4 text-6xl">🌸</div>
                                    <h3 className="font-serif text-2xl font-bold mb-2">No arrangements found</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Try adjusting your filters or search terms.
                                    </p>
                                    <Button variant="outline" onClick={clearFilters}>
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <QuickViewDialog
                product={quickViewProduct}
                open={!!quickViewProduct}
                onOpenChange={(open) => !open && setQuickViewProduct(null)}
            />
        </main>
    );
}
