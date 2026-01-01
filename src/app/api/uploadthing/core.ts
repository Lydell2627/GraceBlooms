import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple file routes
export const ourFileRouter = {
    // Product images - max 4MB, only images
    productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            // For now, allow any uploads
            // In production, you'd check auth here:
            // const session = await getSession();
            // if (!session?.user?.isAdmin) throw new UploadThingError("Unauthorized");
            return { uploadedBy: "admin" };
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete:", file.url);
            return { url: file.url };
        }),

    // Collection/banner images - larger size allowed
    collectionImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
        .middleware(async () => {
            return { uploadedBy: "admin" };
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Collection image uploaded:", file.url);
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
