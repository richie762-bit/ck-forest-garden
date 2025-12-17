import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Loader2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { createPackage, updatePackage, uploadPackageImage } from '../../services/packageService';

const PackageForm = ({ existingPackage, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    price_unit: 'per person per day',
    min_adults: 10,
    children_free: true,
    booking_type: '',
    highlights: [],
    images: [],
    display_order: 0,
    is_active: true
  });
  const [newHighlight, setNewHighlight] = useState('');
  const [errors, setErrors] = useState({});

  // Load existing package data if editing
  useEffect(() => {
    if (existingPackage) {
      setFormData({
        title: existingPackage.title || '',
        description: existingPackage.description || '',
        price: existingPackage.price || '',
        price_unit: existingPackage.price_unit || 'per person per day',
        min_adults: existingPackage.min_adults || 10,
        children_free: existingPackage.children_free !== false,
        booking_type: existingPackage.booking_type || '',
        highlights: existingPackage.highlights || [],
        images: (existingPackage.images || []).map(img => ({
          ...img,
          uploaded: true // Mark existing images as already uploaded
        })),
        display_order: existingPackage.display_order || 0,
        is_active: existingPackage.is_active !== false
      });
    }
  }, [existingPackage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Package title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Package description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.highlights.length === 0) {
      newErrors.highlights = 'Add at least one package highlight';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let packageData = {
        ...formData,
        price: parseFloat(formData.price),
        min_adults: parseInt(formData.min_adults, 10)
      };

      let savedPackage;

      // Create or update package
      if (existingPackage) {
        // Update existing package
        savedPackage = await updatePackage(existingPackage.id, packageData);
      } else {
        // Create new package (without images first)
        const packageToCreate = { ...packageData, images: [] };
        savedPackage = await createPackage(packageToCreate);
      }

      // Upload new images (those with 'file' property and not yet uploaded)
      const newImages = formData.images.filter(img => img.file && !img.uploaded);
      const uploadedImages = [];

      for (const imageObj of newImages) {
        try {
          const uploadResult = await uploadPackageImage(imageObj.file, savedPackage.id);
          uploadedImages.push({
            url: uploadResult.url,
            alt: imageObj.alt || '',
            order: imageObj.order
          });
        } catch (error) {
          console.error('Failed to upload image:', error);
          alert(`Failed to upload one or more images: ${error.message}`);
        }
      }

      // Combine already uploaded images with newly uploaded images
      const existingUploadedImages = formData.images
        .filter(img => img.uploaded)
        .map(img => ({
          url: img.url,
          alt: img.alt || '',
          order: img.order
        }));

      const allImages = [...existingUploadedImages, ...uploadedImages];

      // Update package with all images
      if (allImages.length > 0) {
        await updatePackage(savedPackage.id, { images: allImages });
      }

      // Notify parent component
      onSave({ ...savedPackage, images: allImages });

      alert(`Package ${existingPackage ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving package:', error);
      alert(`Failed to save package: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {existingPackage ? 'Edit Package' : 'Create New Package'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Package Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Package Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Weekend Camping Experience"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Package Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe what's included in this package..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Price and Settings Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (GYD) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="5000.00"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Price Unit */}
        <div>
          <label htmlFor="price_unit" className="block text-sm font-medium text-gray-700 mb-1">
            Price Unit
          </label>
          <input
            type="text"
            id="price_unit"
            name="price_unit"
            value={formData.price_unit}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="per person per day"
          />
        </div>
      </div>

      {/* Min Adults and Booking Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Minimum Adults */}
        <div>
          <label htmlFor="min_adults" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Adults Required
          </label>
          <input
            type="number"
            id="min_adults"
            name="min_adults"
            value={formData.min_adults}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Booking Type */}
        <div>
          <label htmlFor="booking_type" className="block text-sm font-medium text-gray-700 mb-1">
            Booking Type
          </label>
          <select
            id="booking_type"
            name="booking_type"
            value={formData.booking_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a type (optional)</option>
            <option value="day_visit">Day Visit</option>
            <option value="weekend_camping">Weekend Camping</option>
            <option value="corporate_event">Corporate Event</option>
            <option value="custom">Custom Package</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="children_free"
            checked={formData.children_free}
            onChange={handleInputChange}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Children under 12 are FREE</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Package is active and visible to customers</span>
        </label>
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Package Highlights *
        </label>

        {/* Existing Highlights */}
        {formData.highlights.length > 0 && (
          <ul className="space-y-2 mb-3">
            {formData.highlights.map((highlight, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200"
              >
                <span className="text-sm text-gray-700">{highlight}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add New Highlight */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddHighlight();
              }
            }}
            placeholder="Add a package feature or benefit..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={handleAddHighlight}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
        {errors.highlights && <p className="text-red-500 text-sm mt-1">{errors.highlights}</p>}
      </div>

      {/* Display Order */}
      <div>
        <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-1">
          Display Order
        </label>
        <input
          type="number"
          id="display_order"
          name="display_order"
          value={formData.display_order}
          onChange={handleInputChange}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="0"
        />
        <p className="text-xs text-gray-500 mt-1">
          Lower numbers appear first. Leave at 0 for default ordering.
        </p>
      </div>

      {/* Image Uploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Package Images
        </label>
        <ImageUploader
          images={formData.images}
          onImagesChange={handleImagesChange}
          maxImages={5}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{existingPackage ? 'Update Package' : 'Create Package'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PackageForm;
