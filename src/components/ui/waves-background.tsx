"use client";

import * as React from "react";
import { useEffect, useRef } from "react";

/**
 * Animated waves background component
 * Creates smooth, flowing wave animations
 */
export function WavesBackground({
    className = "",
    colors = ["rgba(232, 213, 196, 0.1)", "rgba(163, 177, 138, 0.1)", "rgba(244, 172, 183, 0.1)"],
    speed = 30,
}: {
    className?: string;
    colors?: string[];
    speed?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resize();
        window.addEventListener("resize", resize);

        const drawWave = (
            yOffset: number,
            amplitude: number,
            frequency: number,
            phase: number,
            color: string
        ) => {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);

            for (let x = 0; x <= canvas.width; x += 5) {
                const y =
                    yOffset +
                    Math.sin((x * frequency + phase) / 100) * amplitude +
                    Math.sin((x * frequency * 0.5 + phase * 1.2) / 150) * (amplitude * 0.5);

                if (x === 0) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();

            ctx.fillStyle = color;
            ctx.fill();
        };

        const animate = () => {
            time += speed / 1000;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw multiple wave layers
            drawWave(
                canvas.height * 0.7,
                30,
                0.015,
                time,
                colors[0] || "rgba(232, 213, 196, 0.1)"
            );

            drawWave(
                canvas.height * 0.75,
                40,
                0.012,
                time * 0.8,
                colors[1] || "rgba(163, 177, 138, 0.1)"
            );

            drawWave(
                canvas.height * 0.8,
                35,
                0.018,
                time * 1.2,
                colors[2] || "rgba(244, 172, 183, 0.1)"
            );

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors, speed]);

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none ${className}`}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
            }}
        />
    );
}
