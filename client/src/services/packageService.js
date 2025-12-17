import { supabase } from '../config/supabase';

/**
 * Package Management Service
 * Handles all package CRUD operations and image uploads to Supabase
 */

/**
 * Get all packages (filtered by active status for public view)
 * @param {boolean} includeInactive - Include inactive packages (for admin)
 * @returns {Promise<Array>} Array of package objects
 */
export const getPackages = async (includeInactive = false) => {
  try {
    let query = supabase
      .from('packages')
      .select('*')
      .order('display_order', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw new Error(`Failed to fetch packages: ${error.message}`);
  }
};

/**
 * Get a single package by ID
 * @param {string} packageId - Package UUID
 * @returns {Promise<Object>} Package object
 */
export const getPackageById = async (packageId) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching package:', error);
    throw new Error(`Failed to fetch package: ${error.message}`);
  }
};

/**
 * Create a new package
 * @param {Object} packageData - Package data (without images)
 * @returns {Promise<Object>} Created package object
 */
export const createPackage = async (packageData) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .insert([{
        title: packageData.title,
        description: packageData.description,
        price: packageData.price,
        price_unit: packageData.price_unit || 'per person per day',
        min_adults: packageData.min_adults || 10,
        children_free: packageData.children_free !== false,
        booking_type: packageData.booking_type,
        highlights: packageData.highlights || [],
        images: packageData.images || [],
        display_order: packageData.display_order || 0,
        is_active: packageData.is_active !== false
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating package:', error);
    throw new Error(`Failed to create package: ${error.message}`);
  }
};

/**
 * Update an existing package
 * @param {string} packageId - Package UUID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated package object
 */
export const updatePackage = async (packageId, updates) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .update(updates)
      .eq('id', packageId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating package:', error);
    throw new Error(`Failed to update package: ${error.message}`);
  }
};

/**
 * Delete a package (soft delete by setting is_active to false)
 * @param {string} packageId - Package UUID
 * @param {boolean} hardDelete - If true, permanently delete the package
 * @returns {Promise<boolean>} Success status
 */
export const deletePackage = async (packageId, hardDelete = false) => {
  try {
    if (hardDelete) {
      // Get package to delete its images first
      const pkg = await getPackageById(packageId);

      // Delete all associated images from storage
      if (pkg.images && pkg.images.length > 0) {
        for (const image of pkg.images) {
          await deletePackageImage(image.url);
        }
      }

      // Permanently delete the package
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', packageId);

      if (error) {
        throw error;
      }
    } else {
      // Soft delete: set is_active to false
      await updatePackage(packageId, { is_active: false });
    }

    return true;
  } catch (error) {
    console.error('Error deleting package:', error);
    throw new Error(`Failed to delete package: ${error.message}`);
  }
};

/**
 * Upload an image to Supabase Storage for a package
 * @param {File} file - Image file to upload
 * @param {string} packageId - Package UUID (for organizing files)
 * @returns {Promise<Object>} Object with url and path
 */
export const uploadPackageImage = async (file, packageId) => {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${packageId}/${timestamp}-${randomString}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('package-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('package-images')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('Error uploading package image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} imageUrl - Full URL or path of the image
 * @returns {Promise<boolean>} Success status
 */
export const deletePackageImage = async (imageUrl) => {
  try {
    // Extract path from URL if full URL is provided
    let path = imageUrl;
    if (imageUrl.includes('package-images/')) {
      path = imageUrl.split('package-images/')[1].split('?')[0];
    }

    const { error } = await supabase.storage
      .from('package-images')
      .remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting package image:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Add images to a package
 * @param {string} packageId - Package UUID
 * @param {Array} newImages - Array of image objects {url, alt, order}
 * @returns {Promise<Object>} Updated package object
 */
export const addPackageImages = async (packageId, newImages) => {
  try {
    const pkg = await getPackageById(packageId);
    const existingImages = pkg.images || [];
    const updatedImages = [...existingImages, ...newImages];

    return await updatePackage(packageId, { images: updatedImages });
  } catch (error) {
    console.error('Error adding package images:', error);
    throw new Error(`Failed to add package images: ${error.message}`);
  }
};

/**
 * Remove an image from a package (and delete from storage)
 * @param {string} packageId - Package UUID
 * @param {string} imageUrl - URL of the image to remove
 * @returns {Promise<Object>} Updated package object
 */
export const removePackageImage = async (packageId, imageUrl) => {
  try {
    const pkg = await getPackageById(packageId);
    const updatedImages = (pkg.images || []).filter(img => img.url !== imageUrl);

    // Delete from storage
    await deletePackageImage(imageUrl);

    // Update package
    return await updatePackage(packageId, { images: updatedImages });
  } catch (error) {
    console.error('Error removing package image:', error);
    throw new Error(`Failed to remove package image: ${error.message}`);
  }
};

/**
 * Reorder packages
 * @param {Array} packageIds - Array of package IDs in new order
 * @returns {Promise<boolean>} Success status
 */
export const reorderPackages = async (packageIds) => {
  try {
    const updates = packageIds.map((id, index) => ({
      id,
      display_order: index
    }));

    for (const update of updates) {
      await updatePackage(update.id, { display_order: update.display_order });
    }

    return true;
  } catch (error) {
    console.error('Error reordering packages:', error);
    throw new Error(`Failed to reorder packages: ${error.message}`);
  }
};

/**
 * Toggle package active status
 * @param {string} packageId - Package UUID
 * @returns {Promise<Object>} Updated package object
 */
export const togglePackageStatus = async (packageId) => {
  try {
    const pkg = await getPackageById(packageId);
    return await updatePackage(packageId, { is_active: !pkg.is_active });
  } catch (error) {
    console.error('Error toggling package status:', error);
    throw new Error(`Failed to toggle package status: ${error.message}`);
  }
};
