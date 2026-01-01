"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronRight,
    ShoppingBag,
    Heart,
    Truck,
    Clock,
    ShieldCheck,
    Info,
    ArrowLeft,
    Star
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { useCart } from "~/hooks/useCart";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "~/components/ui/accordion";
import { Separator } from "~/components/ui/separator";
import { Price } from "~/components/product/Price";
import { Rating } from "~/components/product/Rating";
import { ProductCard } from "~/components/product/ProductCard";
import { Navbar } from "~/components/layout/Navbar";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
    const { id } = use(params);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Use Convex queries
    const product = useQuery(api.products.get, { id: id as Id<"products"> });
    const allProducts = useQuery(api.products.list, product?.occasion ? { occasion: product.occasion } : {});

    const isLoading = product === undefined;

    const addItem = useCart((state) => state.addItem);

    // Mock rating and reviews
    const rating = 4.8;
    const reviewCount = 124;

    const relatedProducts = allProducts
        ?.filter((p) => p._id !== id)
        .slice(0, 4);

    const handleAddToCart = () => {
        if (!product) return;

        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product._id,
                name: product.name,
                price: product.price,
            });
        }

        toast.success("Added to cart", {
            description: `${quantity}x ${product.name} added to your cart.`,
        });
    };

    if (isLoading) {
        return <ProductSkeleton />;
    }

    if (!product) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <Navbar />
                <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
                <Button asChild variant="outline">
                    <Link href="/products">Back to Shop</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 pb-20 pt-24 lg:pt-32">
                {/* Breadcrumbs */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/products" className="hover:text-foreground">Shop</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-foreground truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Left: Product Images */}
                    <div className="space-y-4">
                        <div className="group relative aspect-square overflow-hidden rounded-2xl bg-muted border shadow-sm">
                            <Image
                                src={product.image || "/product-placeholder.png"}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <Badge
                                variant="secondary"
                                className="absolute left-6 top-6 bg-white/90 px-3 py-1 text-sm font-medium backdrop-blur-sm dark:bg-black/70"
                            >
                                {product.occasion.toLowerCase()}
                            </Badge>
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={cn(
                                    "absolute right-6 top-6 rounded-full p-2.5 transition-all shadow-sm",
                                    isWishlisted
                                        ? "bg-blush/20 text-blush"
                                        : "bg-white/80 text-muted-foreground hover:text-blush"
                                )}
                            >
                                <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                            </button>
                        </div>

                        {/* More images could be here */}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <h1 className="mb-2 font-serif text-4xl font-bold leading-tight md:text-5xl">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <Price value={product.price} size="lg" className="text-2xl font-bold" />
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-2">
                                    <Rating value={rating} size="sm" />
                                    <span className="text-sm text-muted-foreground">
                                        {rating} ({reviewCount} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                            {product.description}
                        </p>

                        {/* Order Features */}
                        <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl border bg-card/50 p-6 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-sage/10 p-2 text-sage">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div className="text-sm text-left">
                                    <p className="font-semibold text-foreground">Same Day Delivery</p>
                                    <p className="text-muted-foreground">Order by 2pm local time</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-left">
                                <div className="rounded-full bg-blush/10 p-2 text-blush">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-foreground">Artisan Crafted</p>
                                    <p className="text-muted-foreground">Hand-picked fresh daily</p>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Section */}
                        <div className="mb-10 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 items-center rounded-lg border bg-muted/50 p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-background hover:shadow-sm"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center text-lg font-medium">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-background hover:shadow-sm"
                                    >
                                        +
                                    </button>
                                </div>
                                <Button
                                    className="h-12 flex-1 text-lg font-semibold"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingBag className="mr-2 h-5 w-5" />
                                    Add to Cart — ${(product.price * quantity).toFixed(2)}
                                </Button>
                            </div>
                            <p className="text-center text-sm text-muted-foreground">
                                <ShieldCheck className="mr-1 inline-block h-4 w-4 text-sage" />
                                Freshness guaranteed for 7 days or your money back.
                            </p>
                        </div>

                        {/* Product Accordion */}
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details">
                                <AccordionTrigger>Product Details</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Every Grace Blooms arrangement is unique. While we strive to match the images shown,
                                    some seasonal variations in blooms may occur to ensure the highest quality
                                    and freshness for your delivery.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="care">
                                <AccordionTrigger>Care Instructions</AccordionTrigger>
                                <AccordionContent className="space-y-2 text-muted-foreground">
                                    <ul className="list-disc pl-5">
                                        <li>Trim stems at a 45-degree angle upon arrival.</li>
                                        <li>Place in a clean vase with fresh, room-temperature water.</li>
                                        <li>Change water every 2 days and remove wilted petals.</li>
                                        <li>Keep away from direct sunlight, drafts, and fruit.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="delivery">
                                <AccordionTrigger>Delivery Information</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    We deliver across the metropolitan area. Same-day delivery is available for orders
                                    placed before 2:00 PM. Weekend deliveries are available on Saturday.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <section className="mt-24">
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <h2 className="mb-2 font-serif text-3xl font-bold">You May Also Love</h2>
                                <p className="text-muted-foreground">
                                    Perfect companions for {product.name.toLowerCase()}.
                                </p>
                            </div>
                            <Button variant="ghost" asChild>
                                <Link href="/products" className="group">
                                    View All <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p._id} product={{
                                    id: p._id,
                                    name: p.name,
                                    description: p.description,
                                    price: p.price,
                                    image: p.image ?? null,
                                    occasion: p.occasion,
                                    stock: p.stock,
                                }} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

function ProductSkeleton() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 pb-20 pt-24 lg:pt-32">
                <div className="mb-8">
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="grid gap-12 lg:grid-cols-2">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <div className="space-y-6">
                        <div>
                            <Skeleton className="mb-4 h-12 w-3/4" />
                            <Skeleton className="h-8 w-1/4" />
                        </div>
                        <Skeleton className="h-32 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-20 w-full rounded-xl" />
                            <Skeleton className="h-20 w-full rounded-xl" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-12 w-1/3" />
                            <Skeleton className="h-12 w-2/3" />
                        </div>
                        <div className="space-y-4 pt-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
