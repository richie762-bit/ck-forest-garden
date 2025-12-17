import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Image as ImageIcon } from 'lucide-react';
import PackageForm from './PackageForm';
import {
  getPackages,
  deletePackage,
  togglePackageStatus
} from '../../services/packageService';

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showInactive, setShowInactive] = useState(true);

  useEffect(() => {
    loadPackages();
  }, [showInactive]);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await getPackages(showInactive);
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
      alert('Failed to load packages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingPackage(null);
    setShowForm(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleDelete = async (pkg) => {
    if (!confirm(`Are you sure you want to delete "${pkg.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deletePackage(pkg.id, true); // Hard delete
      alert('Package deleted successfully!');
      loadPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert(`Failed to delete package: ${error.message}`);
    }
  };

  const handleToggleStatus = async (pkg) => {
    try {
      await togglePackageStatus(pkg.id);
      alert(`Package ${pkg.is_active ? 'deactivated' : 'activated'} successfully!`);
      loadPackages();
    } catch (error) {
      console.error('Error toggling package status:', error);
      alert(`Failed to update package status: ${error.message}`);
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingPackage(null);
    loadPackages();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPackage(null);
  };

  if (showForm) {
    return (
      <PackageForm
        existingPackage={editingPackage}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your pricing packages</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Package</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Show inactive packages</span>
        </label>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      )}

      {/* Packages Grid */}
      {!loading && packages.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all ${
                pkg.is_active ? 'border-green-200' : 'border-gray-200 opacity-75'
              }`}
            >
              {/* Package Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {pkg.images && pkg.images.length > 0 ? (
                  <img
                    src={pkg.images[0].url}
                    alt={pkg.images[0].alt || pkg.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                )}
              </div>

              {/* Package Info */}
              <div className="p-4 space-y-3">
                {/* Title and Status */}
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">{pkg.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      pkg.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {pkg.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>

                {/* Price */}
                <div className="text-2xl font-bold text-green-600">
                  GYD {parseFloat(pkg.price).toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {pkg.price_unit}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                  <span>Min: {pkg.min_adults} adults</span>
                  <span>{pkg.images?.length || 0} images</span>
                  <span>{pkg.highlights?.length || 0} highlights</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-3">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                    title="Edit package"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(pkg)}
                    className={`px-3 py-2 rounded transition-colors flex items-center justify-center space-x-1 text-sm ${
                      pkg.is_active
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    title={pkg.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {pkg.is_active ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Show</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(pkg)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                    title="Delete package"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && packages.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-600 mb-4">
            {showInactive
              ? 'Create your first package to get started.'
              : 'No active packages. Try showing inactive packages.'}
          </p>
          <button
            onClick={handleCreateNew}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Package</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PackagesList;
