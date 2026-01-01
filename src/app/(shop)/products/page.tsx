"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { motion, useReducedMotion } from "framer-motion";
import { api } from "~/convex/_generated/api";
import { ProductCard } from "~/components/product/ProductCard";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
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
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { SlidersHorizontal, X, Package, Sparkles } from "lucide-react";
import { cn } from "~/lib/utils";
import { QuickViewDialog } from "~/components/product/QuickViewDialog";
import { ScrollReveal } from "~/components/ui/scroll-reveal";

const occasions = ["ALL", "WEDDING", "BIRTHDAY", "FUNERAL", "ANNIVERSARY"];

export default function ProductsPage() {
    const [filter, setFilter] = useState("ALL");
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [sortBy, setSortBy] = useState("featured");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState<{
        id: string;
        name: string;
        description: string;
        price: number;
        image: string | null;
        occasion: string;
    } | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // Use Convex query instead of tRPC
    const products = useQuery(api.products.list, filter === "ALL" ? {} : { occasion: filter });
    const isLoading = products === undefined;

    // Filter products by price range (client-side for demo)
    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );
    }, [products, priceRange]);

    // Sort products
    const sortedProducts = filteredProducts?.sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0; // featured - original order
    });

    const activeFiltersCount =
        (filter !== "ALL" ? 1 : 0) +
        (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0);

    const clearFilters = () => {
        setFilter("ALL");
        setPriceRange([0, 200]);
    };

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Occasion Filter */}
            <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                    Occasion
                </h3>
                <div className="flex flex-wrap gap-2">
                    {occasions.map((occ) => (
                        <Badge
                            key={occ}
                            variant={filter === occ ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer capitalize transition-all duration-300",
                                filter === occ && "shadow-bloom"
                            )}
                            onClick={() => setFilter(occ)}
                        >
                            {occ.toLowerCase()}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                    Price Range
                </h3>
                <div className="px-2">
                    <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        step={10}
                        className="mb-4"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="font-medium">${priceRange[0]}</span>
                        <span className="font-medium">${priceRange[1]}</span>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
                <Button variant="outline" className="w-full rounded-xl" onClick={clearFilters}>
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 pb-16 pt-24 lg:pt-28">
                {/* Header with animation */}
                <ScrollReveal className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-serif text-4xl font-bold md:text-5xl">
                                Our Collection
                            </h1>
                            <p className="text-muted-foreground">
                                Hand-picked arrangements for every occasion.
                            </p>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden w-64 shrink-0 lg:block">
                        <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-premium">
                            <h2 className="mb-6 font-serif text-lg font-semibold">Filters</h2>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                {/* Mobile Filter Button */}
                                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                                    <SheetTrigger asChild className="lg:hidden">
                                        <Button variant="outline" className="gap-2 rounded-xl">
                                            <SlidersHorizontal className="h-4 w-4" />
                                            Filters
                                            {activeFiltersCount > 0 && (
                                                <Badge variant="secondary" className="ml-1">
                                                    {activeFiltersCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80 rounded-r-3xl border-r-0">
                                        <SheetHeader>
                                            <SheetTitle className="font-serif">Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6">
                                            <FilterContent />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Active Filters */}
                                {filter !== "ALL" && (
                                    <Badge
                                        variant="secondary"
                                        className="hidden gap-1.5 capitalize sm:flex rounded-full px-3"
                                    >
                                        {filter.toLowerCase()}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                                            onClick={() => setFilter("ALL")}
                                        />
                                    </Badge>
                                )}
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">Sort by:</span>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-44 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="featured" className="rounded-lg">Featured</SelectItem>
                                        <SelectItem value="price-low" className="rounded-lg">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high" className="rounded-lg">Price: High to Low</SelectItem>
                                        <SelectItem value="name" className="rounded-lg">Name</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Products Grid with staggered animation */}
                        {isLoading ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="overflow-hidden rounded-3xl border">
                                        <Skeleton className="aspect-[4/5]" />
                                        <div className="p-5 space-y-3">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : sortedProducts?.length === 0 ? (
                            <motion.div
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="mb-6 rounded-full bg-muted p-8">
                                    <Package className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h3 className="mb-2 font-serif text-xl font-semibold">No flowers found</h3>
                                <p className="mb-8 max-w-sm text-muted-foreground">
                                    Try adjusting your filters to find what you're looking for.
                                </p>
                                <Button variant="outline" className="rounded-xl" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {sortedProducts?.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: index * 0.05,
                                            duration: 0.5,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        <ProductCard
                                            product={{
                                                id: product._id,
                                                name: product.name,
                                                description: product.description,
                                                price: product.price,
                                                image: product.image ?? null,
                                                occasion: product.occasion,
                                                stock: product.stock,
                                            }}
                                            onQuickView={(p) => setQuickViewProduct(p)}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Results Count */}
                        {!isLoading && sortedProducts && sortedProducts.length > 0 && (
                            <motion.p
                                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-12 text-center text-sm text-muted-foreground"
                            >
                                Showing {sortedProducts.length} of {products?.length} products
                            </motion.p>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            <QuickViewDialog
                product={quickViewProduct}
                open={!!quickViewProduct}
                onOpenChange={(open) => !open && setQuickViewProduct(null)}
            />
        </div>
    );
}
