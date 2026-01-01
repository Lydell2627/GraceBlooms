"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import {
    ChevronLeft,
    CreditCard,
    Truck,
    ShieldCheck,
    Lock,
    CheckCircle2,
    Sparkles,
    Heart,
} from "lucide-react"

import { useCart } from "~/hooks/useCart"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Navbar } from "~/components/layout/Navbar"
import { Footer } from "~/components/layout/Footer"
import { toast } from "sonner"

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const prefersReducedMotion = useReducedMotion()

    const cartTotal = total()
    const shipping = 0 // Free delivery for demo
    const tax = cartTotal * 0.08
    const finalTotal = cartTotal + shipping + tax

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate order processing
        setTimeout(() => {
            setIsSubmitting(false)
            setSuccess(true)
            clearCart()
            toast.success("Order placed successfully!", {
                description: "You'll receive a confirmation email shortly.",
            })
        }, 2000)
    }

    if (success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
                <motion.div
                    initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mb-8 rounded-full bg-sage/10 p-8"
                >
                    <motion.div
                        animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <CheckCircle2 className="h-20 w-20 text-sage" />
                    </motion.div>
                </motion.div>
                <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="mb-3 font-serif text-4xl font-bold md:text-5xl">Thank You!</h1>
                    <p className="mb-8 max-w-md text-lg text-muted-foreground">
                        Your order has been placed and is being prepared by our floral artists.
                    </p>
                </motion.div>
                <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-4"
                >
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                    <Button asChild className="rounded-xl">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </motion.div>
            </div>
        )
    }

    if (items.length === 0 && !success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
                <Navbar />
                <h1 className="mb-4 font-serif text-2xl font-bold">Your cart is empty</h1>
                <Button asChild className="rounded-xl">
                    <Link href="/products">Go to Shop</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
                        <span className="text-primary italic">GB</span>
                        <span>Grace Blooms</span>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        Secure Checkout
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 lg:py-12">
                <Link
                    href="/products"
                    className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Shop
                </Link>

                <div className="grid gap-12 lg:grid-cols-12">
                    {/* Left Column: Checkout Form */}
                    <div className="lg:col-span-12 xl:col-span-8">
                        <motion.form
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-8"
                        >
                            {/* Contact Information */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</div>
                                    <h2 className="text-xl font-bold font-serif">Contact Information</h2>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" placeholder="you@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="(555) 000-0000" required />
                                    </div>
                                </div>
                            </section>

                            <Separator />

                            {/* Shipping Address */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</div>
                                    <h2 className="text-xl font-bold font-serif">Shipping Address</h2>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="Jane" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" required />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" placeholder="123 Floral St" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="San Francisco" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input id="state" placeholder="CA" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip">ZIP Code</Label>
                                            <Input id="zip" placeholder="94103" required />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <Separator />

                            {/* Delivery Notes */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</div>
                                    <h2 className="text-xl font-bold font-serif">Delivery Notes</h2>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Gate code or special instructions (Optional)</Label>
                                    <Input id="notes" placeholder="e.g. Leave at front door" />
                                </div>
                            </section>

                            <Separator />

                            {/* Payment Method */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">4</div>
                                    <h2 className="text-xl font-bold font-serif">Payment Method</h2>
                                </div>
                                <Card variant="glass" className="border-2 border-primary/20">
                                    <CardContent className="pt-6">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <CreditCard className="h-5 w-5 text-primary" />
                                                </div>
                                                <span className="font-semibold">Credit or Debit Card</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-6 w-10 rounded bg-muted" />
                                                <div className="h-6 w-10 rounded bg-muted" />
                                                <div className="h-6 w-10 rounded bg-muted" />
                                            </div>
                                        </div>
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber">Card Number</Label>
                                                <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="col-span-2 space-y-2">
                                                    <Label htmlFor="expiry">Expiry Date</Label>
                                                    <Input id="expiry" placeholder="MM / YY" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cvc">CVC</Label>
                                                    <Input id="cvc" placeholder="000" required />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            <Button
                                type="submit"
                                size="xl"
                                variant="premium"
                                className="w-full font-serif rounded-2xl"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="mr-2"
                                        >
                                            <Sparkles className="h-5 w-5" />
                                        </motion.div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Heart className="mr-2 h-5 w-5" />
                                        Complete Order — ${finalTotal.toFixed(2)}
                                    </>
                                )}
                            </Button>

                            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <ShieldCheck className="h-4 w-4 text-sage" />
                                Your security is our priority. Payment is encrypted and secure.
                            </p>
                        </motion.form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-12 xl:col-span-4">
                        <Card variant="elevated" className="sticky top-24 rounded-3xl">
                            <CardHeader>
                                <CardTitle className="font-serif">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Items List */}
                                <div className="max-h-60 overflow-auto pr-2 space-y-4 scrollbar-premium">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted border">
                                                <Image
                                                    src="https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn"
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-center">
                                                <h4 className="text-sm font-semibold line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="flex items-center font-medium">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                {/* Subtotal & Extras */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            Delivery
                                            <Badge variant="sage" className="text-[10px] h-4">Free</Badge>
                                        </span>
                                        <span className="text-sage">$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Estimated Tax</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Separator />

                                {/* Total */}
                                <div className="flex justify-between items-baseline">
                                    <span className="text-lg font-bold">Total</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-foreground">
                                            ${finalTotal.toFixed(2)}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Including VAT</p>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="rounded-2xl bg-muted/50 p-4 space-y-3">
                                    <div className="flex gap-3 text-xs">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                            <Truck className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Estimate Delivery</p>
                                            <p className="text-muted-foreground">Today, by 6:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 text-xs">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/10">
                                            <ShieldCheck className="h-4 w-4 text-sage" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Satisfaction Guaranteed</p>
                                            <p className="text-muted-foreground">Free cancellation up to 4 hours before delivery.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
