"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { useCart } from "~/hooks/useCart";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Rating } from "./Rating";
import { Price } from "./Price";
import { DeliveryBadge } from "./DeliveryBadge";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string | null;
        occasion: string;
        stock?: number;
    };
    onQuickView?: (product: ProductCardProps["product"]) => void;
    className?: string;
}

export function ProductCard({ product, onQuickView, className }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const addItem = useCart((state) => state.addItem);
    const prefersReducedMotion = useReducedMotion();

    // Generate a consistent rating for demo (based on product id)
    const rating = 3.5 + (product.id.charCodeAt(0) % 15) / 10;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
        });
        toast.success("Added to cart", {
            description: `${product.name} has been added to your cart.`,
        });
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
            description: product.name,
        });
    };

    return (
        <motion.div
            whileHover={prefersReducedMotion ? {} : { y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all duration-500",
                isHovered ? "shadow-bloom-lg" : "shadow-premium",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <Link href={`/products/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Image
                    src={product.image || "https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn"}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-700 ease-premium",
                        isHovered && !prefersReducedMotion ? "scale-110" : "scale-100"
                    )}
                />

                {/* Overlay Actions */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 backdrop-blur-[2px]"
                        >
                            <motion.div
                                initial={prefersReducedMotion ? {} : { scale: 0.8, y: 10 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ delay: 0.05, type: "spring", stiffness: 400 }}
                            >
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-12 w-12 rounded-full bg-white/95 text-foreground shadow-lg hover:bg-white hover:scale-110 transition-transform"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCart();
                                    }}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                </Button>
                            </motion.div>
                            {onQuickView && (
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { scale: 0.8, y: 10 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                                >
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-12 w-12 rounded-full bg-white/95 text-foreground shadow-lg hover:bg-white hover:scale-110 transition-transform"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onQuickView(product);
                                        }}
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleWishlist();
                    }}
                    className={cn(
                        "absolute right-3 top-3 z-10 rounded-full p-2.5 transition-all duration-300",
                        isWishlisted
                            ? "bg-blush/20 text-blush scale-110"
                            : "bg-white/90 text-muted-foreground hover:text-blush hover:scale-110"
                    )}
                >
                    <motion.div
                        animate={isWishlisted && !prefersReducedMotion ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <Heart
                            className={cn("h-4 w-4", isWishlisted && "fill-current")}
                        />
                    </motion.div>
                </button>

                {/* Occasion Badge */}
                <Badge
                    variant="glass"
                    className="absolute left-3 top-3 z-10 text-xs font-medium capitalize backdrop-blur-md"
                >
                    {product.occasion.toLowerCase()}
                </Badge>
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <Link href={`/products/${product.id}`} className="group/title">
                        <h3 className="font-serif text-lg font-semibold leading-tight text-foreground line-clamp-1 group-hover/title:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <p className="mb-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                <div className="mb-3 flex items-center gap-2">
                    <Rating value={rating} size="sm" />
                    <span className="text-xs text-muted-foreground">
                        ({Math.floor(rating * 20)})
                    </span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <Price value={product.price} size="md" />
                    <DeliveryBadge type="same-day" />
                </div>
            </div>

            {/* Quick Add Button (Mobile) */}
            <div className="border-t p-4 md:hidden">
                <Button onClick={handleAddToCart} className="w-full rounded-xl" size="sm">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </div>
        </motion.div>
    );
}
