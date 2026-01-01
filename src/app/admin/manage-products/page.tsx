"use client";

import * as React from "react";
import Image from "next/image";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    MoreHorizontal,
    Package,
    Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { ImageUpload } from "~/components/ui/image-upload";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { toast } from "sonner";

const occasions = ["WEDDING", "BIRTHDAY", "FUNERAL", "ANNIVERSARY"];

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    image: string;
    occasion: string;
    stock: number;
}

const emptyForm: ProductFormData = {
    name: "",
    description: "",
    price: 0,
    image: "",
    occasion: "WEDDING",
    stock: 10,
};

export default function AdminProductsPage() {
    const products = useQuery(api.products.list, {});
    const createProduct = useMutation(api.products.create);
    const updateProduct = useMutation(api.products.update);
    const deleteProduct = useMutation(api.products.remove);

    const [search, setSearch] = React.useState("");
    const [filterOccasion, setFilterOccasion] = React.useState<string>("ALL");
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState<NonNullable<typeof products>[number] | null>(null);
    const [formData, setFormData] = React.useState<ProductFormData>(emptyForm);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const isLoading = products === undefined;

    // Filter products
    const filteredProducts = React.useMemo(() => {
        if (!products) return [];
        return products.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchesOccasion = filterOccasion === "ALL" || p.occasion === filterOccasion;
            return matchesSearch && matchesOccasion;
        });
    }, [products, search, filterOccasion]);

    const handleCreate = async () => {
        setIsSubmitting(true);
        try {
            await createProduct({
                name: formData.name,
                description: formData.description,
                price: formData.price,
                image: formData.image || undefined,
                occasion: formData.occasion,
                stock: formData.stock,
            });
            toast.success("Product created successfully");
            setIsCreateOpen(false);
            setFormData(emptyForm);
        } catch (error) {
            toast.error("Failed to create product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingProduct) return;
        setIsSubmitting(true);
        try {
            await updateProduct({
                id: editingProduct._id as Id<"products">,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                image: formData.image || undefined,
                occasion: formData.occasion,
                stock: formData.stock,
            });
            toast.success("Product updated successfully");
            setEditingProduct(null);
            setFormData(emptyForm);
        } catch (error) {
            toast.error("Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (productId: Id<"products">) => {
        try {
            await deleteProduct({ id: productId });
            toast.success("Product deleted");
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const openEdit = (product: NonNullable<typeof products>[number]) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image || "",
            occasion: product.occasion,
            stock: product.stock,
        });
    };



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-serif">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your flower arrangements
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setFormData(emptyForm)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Create a new flower arrangement for your store.
                            </DialogDescription>
                        </DialogHeader>
                        {/* Inline form - prevents focus loss from nested component re-renders */}
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-name">Product Name</Label>
                                <Input
                                    id="create-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Rose Bouquet"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-description">Description</Label>
                                <Input
                                    id="create-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Beautiful hand-picked roses..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="create-price">Price ($)</Label>
                                    <Input
                                        id="create-price"
                                        type="number"

                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="create-stock">Stock</Label>
                                    <Input
                                        id="create-stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-occasion">Occasion</Label>
                                <Select
                                    value={formData.occasion}
                                    onValueChange={(value) => setFormData({ ...formData, occasion: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {occasions.map((occ) => (
                                            <SelectItem key={occ} value={occ}>
                                                {occ.charAt(0) + occ.slice(1).toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Product Image</Label>
                                <ImageUpload
                                    value={formData.image}
                                    onChange={(url) => setFormData({ ...formData, image: url })}
                                    onRemove={() => setFormData({ ...formData, image: "" })}
                                    endpoint="productImage"
                                    className="aspect-square w-full max-w-[200px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate} disabled={isSubmitting || !formData.name}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Product
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterOccasion} onValueChange={setFilterOccasion}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Occasion" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Occasions</SelectItem>
                                {occasions.map((occ) => (
                                    <SelectItem key={occ} value={occ}>
                                        {occ.charAt(0) + occ.slice(1).toLowerCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="font-semibold">No products found</h3>
                            <p className="text-muted-foreground text-sm">
                                {search || filterOccasion !== "ALL"
                                    ? "Try adjusting your filters"
                                    : "Add your first product to get started"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Occasion</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>
                                            <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
                                                <Image
                                                    src={product.image || "https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn"}
                                                    alt={product.name}
                                                    width={48}
                                                    height={48}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {product.occasion.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ${product.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge
                                                variant={product.stock < 10 ? "destructive" : "secondary"}
                                            >
                                                {product.stock}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEdit(product)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(product._id as Id<"products">)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Update product details.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Inline form - prevents focus loss from nested component re-renders */}
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Product Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Rose Bouquet"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Beautiful hand-picked roses..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-price">Price ($)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-stock">Stock</Label>
                                <Input
                                    id="edit-stock"
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-occasion">Occasion</Label>
                            <Select
                                value={formData.occasion}
                                onValueChange={(value) => setFormData({ ...formData, occasion: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {occasions.map((occ) => (
                                        <SelectItem key={occ} value={occ}>
                                            {occ.charAt(0) + occ.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Product Image</Label>
                            <ImageUpload
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                                onRemove={() => setFormData({ ...formData, image: "" })}
                                endpoint="productImage"
                                className="aspect-square w-full max-w-[200px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingProduct(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
