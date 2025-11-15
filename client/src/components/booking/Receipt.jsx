import { Check, Calendar, Users, Baby, DollarSign, Hash, Copy, Download } from 'lucide-react';
import { formatDate, formatCurrency, copyToClipboard } from '../../utils/helpers';
import toast from 'react-hot-toast';

/**
 * Receipt Component
 * Displays booking confirmation receipt
 */
const Receipt = ({ booking }) => {
  const handleCopyReference = async () => {
    const success = await copyToClipboard(booking.bookingReference);
    if (success) {
      toast.success('Booking reference copied to clipboard!');
    } else {
      toast.error('Failed to copy booking reference');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your booking has been successfully created. Please check your email for confirmation.
        </p>
      </div>

      {/* Receipt Card */}
      <div className="card p-8 mb-6">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">CK Forest Garden</h3>
          <p className="text-gray-600">Booking Receipt</p>
        </div>

        {/* Booking Reference */}
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
              <p className="text-xl font-bold text-primary-600">{booking.bookingReference}</p>
            </div>
            <button
              onClick={handleCopyReference}
              className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              title="Copy reference"
            >
              <Copy className="w-5 h-5 text-primary-600" />
            </button>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-gray-900">{booking.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{booking.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">{booking.customerPhone}</span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Booking Details</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-primary-600" />
              <div className="flex-1 flex justify-between">
                <span className="text-gray-600">Booking Type:</span>
                <span className="font-medium text-gray-900">{booking.bookingType}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div className="flex-1 flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium text-gray-900">{formatDate(booking.dateFrom)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div className="flex-1 flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium text-gray-900">{formatDate(booking.dateTo)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary-600" />
              <div className="flex-1 flex justify-between">
                <span className="text-gray-600">Adults:</span>
                <span className="font-medium text-gray-900">{booking.numberOfAdults}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Baby className="w-5 h-5 text-primary-600" />
              <div className="flex-1 flex justify-between">
                <span className="text-gray-600">Children (FREE):</span>
                <span className="font-medium text-green-600">{booking.numberOfChildren}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary - Mobile responsive */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Days:</span>
              <span className="font-medium text-gray-900">{booking.numberOfDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rate per Adult per Day:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(booking.ratePerAdultPerDay)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Calculation:</span>
              <span>
                {booking.numberOfAdults} × {formatCurrency(booking.ratePerAdultPerDay)} ×{' '}
                {booking.numberOfDays}
              </span>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-primary-50 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              <span className="text-base sm:text-lg font-semibold text-gray-900">Total Amount:</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-primary-600">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>

          {/* Deposit Required (50% of total) - Automatically calculated */}
          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <span className="text-base sm:text-lg font-bold text-green-900">
                  Deposit Required (50%):
                </span>
              </div>
              <span className="text-xs text-green-700 ml-7 sm:ml-8">
                Pay this amount to confirm your booking
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-green-600 ml-7 sm:ml-0">
              {formatCurrency(Math.round(booking.totalAmount * 0.5))}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Status:</strong> {booking.bookingStatus} - {booking.paymentStatus}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button onClick={handlePrint} className="btn btn-secondary flex-1 py-3">
          <Download className="w-5 h-5 mr-2 inline" />
          Print Receipt
        </button>
      </div>

      {/* Important Notice - Updated without receipt upload mention */}
      <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs sm:text-sm text-blue-800">
          <strong>Important:</strong> Your booking reference is{' '}
          <strong>{booking.bookingReference}</strong>. Please keep this for your records and use
          it when making your deposit payment. You will receive payment instructions via email.
        </p>
      </div>
    </div>
  );
};

export default Receipt;
