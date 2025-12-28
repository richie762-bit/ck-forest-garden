import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import {
  uploadGalleryImageToStorage,
  createGalleryImage,
  getAllGalleryImagesAdmin,
  updateGalleryImage,
  deleteGalleryImage,
} from '../../services/supabaseService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * GalleryManager Component
 * Admin interface for managing gallery images
 */
const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    category: 'general',
    displayOrder: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await getAllGalleryImagesAdmin();
      setImages(data);
    } catch (error) {
      toast.error('Failed to load gallery images');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingImage && !selectedFile) {
      toast.error('Please select an image');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      setUploading(true);

      if (editingImage) {
        // Update existing image
        const updates = {
          title: formData.title,
          caption: formData.caption,
          category: formData.category,
          display_order: parseInt(formData.displayOrder),
        };

        // Upload new image if selected
        if (selectedFile) {
          const imageUrl = await uploadGalleryImageToStorage(selectedFile);
          updates.image_url = imageUrl;
        }

        await updateGalleryImage(editingImage.id, updates);
        toast.success('Image updated successfully');
      } else {
        // Upload new image
        const imageUrl = await uploadGalleryImageToStorage(selectedFile);

        // Create gallery image record
        await createGalleryImage({
          title: formData.title,
          caption: formData.caption,
          imageUrl,
          category: formData.category,
          displayOrder: parseInt(formData.displayOrder),
        });

        toast.success('Image uploaded successfully');
      }

      // Reset form
      setFormData({
        title: '',
        caption: '',
        category: 'general',
        displayOrder: 0,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setEditingImage(null);

      // Refresh images list
      fetchImages();
    } catch (error) {
      toast.error(error.message || 'Failed to save image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      caption: image.caption || '',
      category: image.category,
      displayOrder: image.display_order,
    });
    setPreviewUrl(image.image_url);
  };

  const handleCancelEdit = () => {
    setEditingImage(null);
    setFormData({
      title: '',
      caption: '',
      category: 'general',
      displayOrder: 0,
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleToggleActive = async (image) => {
    try {
      await updateGalleryImage(image.id, { is_active: !image.is_active });
      toast.success(image.is_active ? 'Image hidden' : 'Image activated');
      fetchImages();
    } catch (error) {
      toast.error('Failed to update image status');
      console.error(error);
    }
  };

  const handleDelete = async (image) => {
    if (!window.confirm(`Are you sure you want to delete "${image.title}"?`)) {
      return;
    }

    try {
      await deleteGalleryImage(image.id);
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error) {
      toast.error('Failed to delete image');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" text="Loading gallery..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Manager</h1>
        <p className="text-gray-600">Upload and manage photos for the gallery slideshow</p>
      </div>

      {/* Upload Form */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {editingImage ? 'Edit Image' : 'Upload New Image'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image {editingImage ? '(Optional - leave empty to keep current)' : '*'}
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : 'Click to select an image'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {previewUrl && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., Beautiful Sunset"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="general">General</option>
                <option value="overview">Overview</option>
                <option value="nature">Nature</option>
                <option value="activities">Activities</option>
                <option value="facilities">Facilities</option>
                <option value="events">Events</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>

            {/* Caption */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
                className="input-field"
                rows="3"
                placeholder="Describe the image (shown in slideshow)"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                className="input-field"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  {editingImage ? 'Updating...' : 'Uploading...'}
                </>
              ) : (
                <>{editingImage ? 'Update Image' : 'Upload Image'}</>
              )}
            </button>
            {editingImage && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Images List */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Gallery Images ({images.length})
          </h2>
        </div>
        <div className="p-6">
          {images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No images uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`card overflow-hidden ${
                    !image.is_active ? 'opacity-50 bg-gray-50' : ''
                  }`}
                >
                  <div className="aspect-video relative bg-gray-200">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    {!image.is_active && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Hidden
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {image.caption || 'No caption'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span className="badge badge-primary">{image.category}</span>
                      <span>Order: {image.display_order}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(image)}
                        className="flex-1 btn btn-sm btn-secondary"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(image)}
                        className={`flex-1 btn btn-sm ${
                          image.is_active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={image.is_active ? 'Hide' : 'Show'}
                      >
                        {image.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(image)}
                        className="flex-1 btn btn-sm bg-red-100 text-red-700 hover:bg-red-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
