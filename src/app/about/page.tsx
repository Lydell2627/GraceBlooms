import { Navbar } from "~/components/layout/Navbar";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section className="container mx-auto px-6 py-24">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <h1 className="font-serif text-5xl font-bold">About Grace Blooms</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Where artistry meets nature in a dark, romantic embrace.
                        </p>
                    </div>

                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted">
                        <Image
                            src="/about-hero.jpg"
                            alt="Our floral studio"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Placeholder overlay if image is missing */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white/50">
                            (Placeholder Image: /about-hero.jpg)
                        </div>
                    </div>

                    <div className="prose prose-lg dark:prose-invert mx-auto">
                        <p>
                            Founded in 2024, Grace Blooms was born from a desire to bring joy through beautiful floristry. We believe that flowers are for every occasion—bright celebrations, heartfelt moments, and everyday elegance.
                        </p>
                        <p>
                            Our studio uses a curated selection of rare and exotic blooms, often sourcing locally to ensure the highest quality and sustainability. Every arrangement is a piece of living art, designed to evoke feeling and create memory.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
