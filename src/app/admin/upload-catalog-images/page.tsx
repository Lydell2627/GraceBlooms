"use client";

import { useState } from "react";
import { UploadButton } from "~/lib/uploadthing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Check, Upload, Copy } from "lucide-react";

interface UploadedImage {
    category: string;
    fileName: string;
    url: string;
}

export default function UploadCatalogImagesPage() {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string>("wedding");

    const categories = [
        { id: "wedding", name: "Wedding", count: 3 },
        { id: "birthday", name: "Birthday", count: 3 },
        { id: "anniversary", name: "Anniversary", count: 2 },
        { id: "sympathy", name: "Sympathy", count: 2 },
        { id: "custom", name: "Custom", count: 2 },
        { id: "general", name: "General", count: 8 },
    ];

    const copyAllUrls = () => {
        const jsonData = JSON.stringify(uploadedImages, null, 2);
        navigator.clipboard.writeText(jsonData);
        alert("All URLs copied to clipboard!");
    };

    const exportAsJson = () => {
        const dataStr = JSON.stringify(uploadedImages, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'catalog-image-urls.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Catalog Images to UploadThing</CardTitle>
                    <CardDescription>
                        Upload all catalog images by category. Select a category and upload the corresponding images.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Category Selection */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Select Category</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {categories.map((cat) => {
                                const uploaded = uploadedImages.filter(img => img.category === cat.id).length;
                                const isComplete = uploaded === cat.count;

                                return (
                                    <Button
                                        key={cat.id}
                                        variant={currentCategory === cat.id ? "default" : "outline"}
                                        className="relative"
                                        onClick={() => setCurrentCategory(cat.id)}
                                    >
                                        {cat.name}
                                        {isComplete && (
                                            <Check className="absolute top-2 right-2 h-4 w-4 text-green-500" />
                                        )}
                                        <span className="ml-2 text-xs opacity-70">
                                            ({uploaded}/{cat.count})
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">
                            Upload {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Images
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Location: <code className="bg-muted px-2 py-1 rounded">
                                public/catalog-images/{currentCategory}/
                            </code>
                        </p>
                        <UploadButton
                            endpoint="catalogImage"
                            onClientUploadComplete={(res) => {
                                if (res) {
                                    const newImages = res.map((file) => ({
                                        category: currentCategory,
                                        fileName: file.name,
                                        url: file.url,
                                    }));
                                    setUploadedImages([...uploadedImages, ...newImages]);
                                    alert(`${res.length} file(s) uploaded successfully!`);
                                }
                            }}
                            onUploadError={(error: Error) => {
                                alert(`Upload error: ${error.message}`);
                            }}
                        />
                    </div>

                    {/* Uploaded Images List */}
                    {uploadedImages.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold">
                                    Uploaded Images ({uploadedImages.length}/20)
                                </h3>
                                <div className="space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={copyAllUrls}
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy JSON
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={exportAsJson}
                                    >
                                        Download JSON
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {uploadedImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={img.url}
                                            alt={img.fileName}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{img.fileName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Category: {img.category}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {img.url}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                navigator.clipboard.writeText(img.url);
                                                alert("URL copied!");
                                            }}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-muted p-4 rounded-lg text-sm">
                        <h4 className="font-semibold mb-2">📝 Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            <li>Select a category above</li>
                            <li>Click "Choose Files" and select images from: <code>public/catalog-images/{currentCategory}/</code></li>
                            <li>Wait for upload to complete</li>
                            <li>Repeat for each category</li>
                            <li>Click "Download JSON" to save all URLs</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
