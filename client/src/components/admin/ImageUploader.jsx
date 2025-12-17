import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

/**
 * ImageUploader Component
 * Flashcard-style image uploader for package images
 */
const ImageUploader = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Check max images limit
    if (images.length + fileArray.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images per package.`);
      return;
    }

    setUploading(true);

    try {
      const newImageObjects = [];

      for (const file of fileArray) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image.`);
          continue;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 5MB limit.`);
          continue;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        newImageObjects.push({
          file,
          preview: previewUrl,
          alt: '',
          order: images.length + newImageObjects.length
        });
      }

      onImagesChange([...images, ...newImageObjects]);
    } catch (error) {
      console.error('Error selecting files:', error);
      alert('Failed to select images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    // Update order
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      order: i
    }));
    onImagesChange(reorderedImages);
  };

  const handleAltTextChange = (index, altText) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], alt: altText };
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);

    // Update order
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      order: i
    }));
    onImagesChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          className="hidden"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={uploading || images.length >= maxImages}
        />

        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          {uploading ? (
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">
              {uploading ? 'Processing images...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WebP or GIF (max 5MB per image)
            </p>
            <p className="text-xs text-gray-500">
              {images.length} / {maxImages} images uploaded
            </p>
          </div>
        </label>
      </div>

      {/* Image Grid - Flashcard Style */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Image Preview */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                {image.preview || image.url ? (
                  <img
                    src={image.preview || image.url}
                    alt={image.alt || `Package image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                )}
              </div>

              {/* Image Controls */}
              <div className="p-3 space-y-2">
                {/* Alt Text Input */}
                <input
                  type="text"
                  placeholder="Image description (optional)"
                  value={image.alt || ''}
                  onChange={(e) => handleAltTextChange(index, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  {/* Reorder Buttons */}
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => moveImage(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Left
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                      disabled={index === images.length - 1}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Right →
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Order Badge */}
                <div className="text-xs text-gray-500 text-center">
                  Position: {index + 1} of {images.length}
                </div>
              </div>

              {/* Upload Status Badge (if uploading) */}
              {image.file && !image.uploaded && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Pending Upload
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No images uploaded yet</p>
          <p className="text-xs mt-1">Upload images to showcase your package</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
