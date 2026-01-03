/**
 * Cloudinary Service
 * Handles image uploads and management using Cloudinary
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
}

/**
 * Upload an image to Cloudinary using unsigned upload
 * This uses the ml_default upload preset which is enabled by default
 * @param file - The file to upload
 * @param folder - The folder path in Cloudinary (e.g., 'gallery', 'receipts', 'profiles')
 * @returns Promise with the uploaded image URL and public ID
 */
export const uploadImageSigned = async (
    file: File,
    folder: string = 'general'
): Promise<{ url: string; publicId: string }> => {
    try {
        // Use unsigned upload with the custom humsj_charity preset
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'humsj_charity');
        formData.append('folder', folder);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error('Cloudinary upload error:', error);
            throw new Error(error.error?.message || 'Upload failed');
        }

        const data: CloudinaryUploadResponse = await response.json();

        return {
            url: data.secure_url,
            publicId: data.public_id,
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

/**
 * Delete an image from Cloudinary
 * Note: This requires server-side implementation for security
 * For now, we'll skip deletion from Cloudinary and only remove from Firestore
 */
export const deleteImage = async (publicId: string): Promise<void> => {
    // This should be implemented server-side using Firebase Functions
    // For now, we'll just remove from Firestore database
    console.warn('Cloudinary deletion should be implemented server-side');
    return Promise.resolve();
};

/**
 * Get an optimized image URL with transformations
 * @param url - The original Cloudinary URL
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export const getOptimizedUrl = (
    url: string,
    options: {
        width?: number;
        height?: number;
        quality?: 'auto' | number;
        format?: 'auto' | 'jpg' | 'png' | 'webp';
    } = {}
): string => {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }

    const { width, height, quality = 'auto', format = 'auto' } = options;

    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    const transformString = transformations.join(',');

    // Insert transformations into URL
    // Example: https://res.cloudinary.com/demo/image/upload/...
    // Becomes: https://res.cloudinary.com/demo/image/upload/w_400,h_300,q_auto/...
    return url.replace('/upload/', `/upload/${transformString}/`);
};

/**
 * Extract public ID from Cloudinary URL
 */
export const extractPublicId = (url: string): string => {
    if (!url || !url.includes('cloudinary.com')) {
        return '';
    }

    try {
        const parts = url.split('/upload/');
        if (parts.length < 2) return '';

        const afterUpload = parts[1];
        // Remove version if present (v1234567890/)
        const withoutVersion = afterUpload.replace(/^v\d+\//, '');
        // Remove file extension
        const publicId = withoutVersion.replace(/\.\w+$/, '');

        return publicId;
    } catch (error) {
        console.error('Error extracting public ID:', error);
        return '';
    }
};

export default {
    uploadImageSigned,
    deleteImage,
    getOptimizedUrl,
    extractPublicId,
};
