import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, Mail, Eye, Heart } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DeliveryBadge } from "./DeliveryBadge";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import { bloomAnimation, bloomReverseAnimation } from "~/lib/anime-utils";
import { SpotlightCard } from "~/components/ui/spotlight-card";
import { useCurrency } from "~/app/_components/CurrencyProvider";

interface CatalogItem {
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

interface ProductCardProps {
    product: CatalogItem;
    onQuickView?: (product: CatalogItem) => void;
    className?: string;
}

export function ProductCard({ product, onQuickView, className }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const settings = useQuery(api.settings.get, {});
    const prefersReducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLDivElement>(null);
    const { formatRange } = useCurrency();

    // Dynamic contact info from settings
    const whatsappNumber = settings?.whatsappNumber || "919876543210";
    const phoneNumber = settings?.phoneNumber || "+919876543210";

    // Anime.js bloom effect on hover
    useEffect(() => {
        if (prefersReducedMotion || !cardRef.current) return;

        if (isHovered) {
            bloomAnimation(cardRef.current, { duration: 500, scale: 1.02, rotate: 1 });
        } else {
            bloomReverseAnimation(cardRef.current, { duration: 400 });
        }
    }, [isHovered, prefersReducedMotion]);

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
            description: product.title,
        });
    };

    // Format price range with currency conversion
    const priceDisplay = product.priceMin === product.priceMax
        ? formatRange(product.priceMin, product.priceMin).split(" - ")[0] // Get just the first part if same
        : formatRange(product.priceMin, product.priceMax);

    // Generate WhatsApp message
    const whatsappMessage = encodeURIComponent(
        `Hi! I'm interested in "${product.title}" (${priceDisplay}). Can you help me with more details?`
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    const mainImage = product.images?.[0] || "https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn";

    return (
        <SpotlightCard className={cn("rounded-3xl", className)}>
            <motion.div
                ref={cardRef}
                whileHover={prefersReducedMotion ? {} : { y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                    "group relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all duration-500",
                    isHovered ? "shadow-bloom-lg" : "shadow-premium"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <Link href={`/catalog/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <Image
                        src={mainImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        loading="lazy"
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
                                {/* WhatsApp Quick Action */}
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { scale: 0.8, y: 10 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ delay: 0.05, type: "spring", stiffness: 400 }}
                                >
                                    <Button
                                        size="icon"
                                        className="h-12 w-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-400 hover:scale-110 transition-transform"
                                        asChild
                                    >
                                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                            <MessageCircle className="h-5 w-5" />
                                        </a>
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
                                ? "bg-terracotta/20 text-terracotta scale-110"
                                : "bg-white/90 text-muted-foreground hover:text-terracotta hover:scale-110"
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

                    {/* Category Badge */}
                    <Badge
                        variant="glass"
                        className="absolute left-3 top-3 z-10 text-xs font-medium capitalize backdrop-blur-md"
                    >
                        {product.category.toLowerCase()}
                    </Badge>

                    {/* Tags */}
                    {product.tags.length > 0 && (
                        <div className="absolute left-3 bottom-3 z-10 flex flex-wrap gap-1">
                            {product.tags.slice(0, 2).map((tag) => (
                                <Badge
                                    key={tag}
                                    variant={tag === "featured" ? "default" : tag === "new" ? "sage" : "secondary"}
                                    className="text-[10px] font-medium capitalize"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                        <Link href={`/catalog/${product.slug}`} className="group/title">
                            <h3 className="font-serif text-lg font-semibold leading-tight text-foreground line-clamp-1 group-hover/title:text-primary transition-colors">
                                {product.title}
                            </h3>
                        </Link>
                    </div>

                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-primary">
                                {priceDisplay}
                            </span>
                            {product.customizationAvailable && (
                                <span className="text-xs text-muted-foreground">Customizable</span>
                            )}
                        </div>
                        <DeliveryBadge type={product.leadTimeDays === 1 ? "same-day" : "standard"} />
                    </div>
                </div>

                {/* Contact CTAs (Mobile) */}
                <div className="border-t p-4 md:hidden">
                    <div className="flex gap-2">
                        <Button className="flex-1 rounded-xl bg-green-600 hover:bg-green-500" size="sm" asChild>
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                WhatsApp
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl" asChild>
                            <a href={`tel:${phoneNumber}`}>
                                <Phone className="h-4 w-4" />
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl" asChild>
                            <Link href="/contact">
                                <Mail className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </SpotlightCard>
    );
}
