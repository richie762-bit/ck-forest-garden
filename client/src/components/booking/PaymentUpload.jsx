import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadPaymentReceipt } from '../../services/api';
import { validateFileUpload } from '../../utils/validation';
import { parseErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * PaymentUpload Component
 * Upload payment receipt for a booking
 */
const PaymentUpload = ({ bookingId, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setFileError('');

    if (file) {
      // Validate file
      const validation = validateFileUpload(file);

      if (!validation.success) {
        setFileError(validation.error);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setFileError('');

    try {
      const response = await uploadPaymentReceipt(bookingId, selectedFile);

      if (response.status === 'success') {
        setUploadComplete(true);
        toast.success('Payment receipt uploaded successfully!');

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      setFileError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (uploadComplete) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
        <p className="text-gray-600 mb-6">
          Your payment receipt has been uploaded. We'll review and confirm your booking shortly.
        </p>
        <p className="text-sm text-gray-500">You will receive an email confirmation once reviewed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Payment Receipt</h3>
        <p className="text-gray-600">
          Please upload your payment receipt to complete your booking confirmation.
        </p>
      </div>

      {/* Upload Area */}
      <div className="card p-8">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            selectedFile
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 bg-gray-50'
          }`}
        >
          <Upload className="w-16 h-16 text-primary-600 mx-auto mb-4" />

          <input
            type="file"
            id="receipt-upload"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <label
            htmlFor="receipt-upload"
            className="btn btn-primary mb-4 cursor-pointer inline-block"
          >
            {selectedFile ? 'Change File' : 'Select File'}
          </label>

          {selectedFile && (
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-sm text-gray-500">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          <p className="text-sm text-gray-600">
            Accepted formats: JPG, PNG, PDF (Max 5MB)
          </p>
        </div>

        {/* Error Message */}
        {fileError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{fileError}</p>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && !fileError && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn btn-primary w-full mt-6 py-4 text-lg"
          >
            {uploading ? (
              <LoadingSpinner size="small" text="Uploading..." />
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2 inline" />
                Upload Receipt
              </>
            )}
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Payment Instructions
        </h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Make payment to the designated account</li>
          <li>Keep your payment receipt or screenshot</li>
          <li>Upload the receipt using the form above</li>
          <li>Wait for confirmation email from our team</li>
          <li>Your booking will be confirmed once payment is verified</li>
        </ol>
      </div>

      {/* Help */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Need help? Contact us at{' '}
          <a href="mailto:info@ckforestgarden.com" className="text-primary-600 hover:underline">
            info@ckforestgarden.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentUpload;
