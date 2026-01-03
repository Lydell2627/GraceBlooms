import anime from "animejs/lib/anime.es.js";

/**
 * Bloom animation - Petal-opening effect for cards
 * Combines scale, opacity, and subtle rotation
 */
export function bloomAnimation(
    target: string | HTMLElement,
    options?: {
        duration?: number;
        scale?: number;
        rotate?: number;
    }
) {
    return anime({
        targets: target,
        scale: options?.scale || 1.05,
        opacity: [0.8, 1],
        rotate: options?.rotate || 2,
        duration: options?.duration || 600,
        easing: "easeOutElastic(1, .8)",
    });
}

/**
 * Reverse bloom animation for mouse leave
 */
export function bloomReverseAnimation(
    target: string | HTMLElement,
    options?: {
        duration?: number;
    }
) {
    return anime({
        targets: target,
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: options?.duration || 400,
        easing: "easeOutQuad",
    });
}

/**
 * Floral growth animation for SVG paths
 * Sequential path drawing effect
 */
export function floralGrowth(
    target: string | HTMLElement,
    options?: {
        duration?: number;
        delay?: number;
    }
) {
    return anime({
        targets: target,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "easeInOutSine",
        duration: options?.duration || 2000,
        delay: options?.delay || 0,
    });
}

/**
 * Stagger bloom animation for grid items
 * Cards bloom in sequence
 */
export function staggerBloom(
    target: string | NodeListOf<HTMLElement>,
    options?: {
        delay?: number;
        stagger?: number;
    }
) {
    return anime({
        targets: target,
        opacity: [0, 1],
        scale: [0.9, 1],
        translateY: [20, 0],
        duration: 800,
        delay: anime.stagger(options?.stagger || 100, {
            start: options?.delay || 0,
        }),
        easing: "easeOutElastic(1, .6)",
    });
}

/**
 * Magnetic effect for buttons
 * Element follows mouse movement within bounds
 */
export function createMagneticEffect(
    element: HTMLElement,
    options?: {
        strength?: number;
    }
) {
    const strength = options?.strength || 20;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
        if (!isHovering) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        anime({
            targets: element,
            translateX: deltaX * strength,
            translateY: deltaY * strength,
            duration: 400,
            easing: "easeOutQuad",
        });
    };

    const handleMouseEnter = () => {
        isHovering = true;
    };

    const handleMouseLeave = () => {
        isHovering = false;
        anime({
            targets: element,
            translateX: 0,
            translateY: 0,
            duration: 600,
            easing: "easeOutElastic(1, .6)",
        });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    // Return cleanup function
    return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
    };
}

/**
 * Shimmer effect for loading/shine animations
 */
export function shimmerAnimation(
    target: string | HTMLElement,
    options?: {
        duration?: number;
        loop?: boolean;
    }
) {
    return anime({
        targets: target,
        translateX: ["-100%", "100%"],
        duration: options?.duration || 1500,
        easing: "easeInOutQuad",
        loop: options?.loop !== false,
    });
}

/**
 * Fade in with bloom effect
 */
export function fadeInBloom(
    target: string | HTMLElement,
    options?: {
        duration?: number;
        delay?: number;
    }
) {
    return anime({
        targets: target,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: options?.duration || 600,
        delay: options?.delay || 0,
        easing: "easeOutElastic(1, .8)",
    });
}

/**
 * Navbar scroll animation - adjusts opacity on scroll
 * Smooth transition for floating navbar without shifting layout
 */
export function navbarScrollAnimation(
    target: string | HTMLElement,
    scrolled: boolean,
    options?: {
        duration?: number;
        initialOpacity?: number;
    }
) {
    const initialOpacity = options?.initialOpacity || 0.95;

    return anime({
        targets: target,
        opacity: scrolled ? 1 : initialOpacity,
        duration: options?.duration || 400,
        easing: "easeOutCubic",
    });
}
