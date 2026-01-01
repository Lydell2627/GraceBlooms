"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { useUploadThing } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import type { ClientUploadedFileData } from "uploadthing/types";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    endpoint?: "productImage" | "collectionImage";
    className?: string;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    endpoint = "productImage",
    className,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const { startUpload } = useUploadThing(endpoint, {
        onClientUploadComplete: (res: ClientUploadedFileData<{ url: string }>[]) => {
            if (res?.[0]?.url) {
                onChange(res[0].url);
            }
            setIsUploading(false);
        },
        onUploadError: (error: Error) => {
            console.error("Upload error:", error);
            setIsUploading(false);
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        await startUpload([file]);
    };

    if (value) {
        return (
            <div className={cn("relative rounded-lg overflow-hidden", className)}>
                <Image
                    src={value}
                    alt="Uploaded image"
                    fill
                    className="object-cover"
                />
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <label
            className={cn(
                "flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors",
                isUploading && "pointer-events-none opacity-50",
                className
            )}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
            />
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                {isUploading ? (
                    <>
                        <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                    </>
                ) : (
                    <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Click to upload image
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            PNG, JPG up to 4MB
                        </p>
                    </>
                )}
            </div>
        </label>
    );
}
