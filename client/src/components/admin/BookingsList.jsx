import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
} from 'lucide-react';
import {
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} from '../../services/api';
import {
  formatCurrency,
  formatDateShort,
  getStatusColor,
  getStatusText,
  parseErrorMessage,
  debounce,
} from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';

/**
 * BookingsList Component
 * Admin bookings list with search, filters, and pagination
 */
const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
  });

  useEffect(() => {
    fetchBookings();
  }, [filters.page, filters.limit, filters.status]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getAllBookings(filters);
      if (response.status === 'success') {
        setBookings(response.data.bookings);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error(parseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
      fetchBookings();
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
    debouncedSearch(value);
  };

  const handleStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await updateBookingStatus(bookingId, {
        bookingStatus: newStatus,
      });
      if (response.status === 'success') {
        toast.success('Booking status updated successfully');
        fetchBookings();
        setIsDetailsModalOpen(false);
      }
    } catch (error) {
      toast.error(parseErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    const reason = window.prompt('Enter cancellation reason:');
    if (!reason) return;

    setIsUpdating(true);
    try {
      const response = await cancelBooking(bookingId, reason);
      if (response.status === 'success') {
        toast.success('Booking cancelled successfully');
        fetchBookings();
        setIsDetailsModalOpen(false);
      }
    } catch (error) {
      toast.error(parseErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-600">Manage and track all bookings</p>
        </div>
        <button onClick={fetchBookings} className="btn btn-secondary" disabled={loading}>
          <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search by name, email, or reference..."
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Per Page */}
          <div>
            <select
              value={filters.limit}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))
              }
              className="input"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner size="large" text="Loading bookings..." />
          </div>
        ) : bookings.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Reference
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Customer
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Dates
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Guests
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      {/* Reference - Compact, no wrap */}
                      <td className="px-3 py-3 text-xs font-medium text-primary-600 whitespace-nowrap">
                        <span title={booking.bookingReference}>{booking.bookingReference}</span>
                      </td>
                      {/* Customer info - Truncated with tooltip */}
                      <td className="px-3 py-3">
                        <div className="max-w-[150px]">
                          <div className="text-sm font-medium text-gray-900 truncate" title={booking.customerName}>
                            {booking.customerName}
                          </div>
                          <div className="text-xs text-gray-500 truncate" title={booking.customerEmail}>
                            {booking.customerEmail}
                          </div>
                        </div>
                      </td>
                      {/* Booking type - Truncated */}
                      <td className="px-3 py-3">
                        <div className="text-sm text-gray-600 max-w-[100px] truncate" title={booking.bookingType}>
                          {booking.bookingType}
                        </div>
                      </td>
                      {/* Dates - Compact format */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                          {formatDateShort(booking.dateFrom)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDateShort(booking.dateTo)}
                        </div>
                      </td>
                      {/* Guests - Compact */}
                      <td className="px-3 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {booking.numberOfAdults}A / {booking.numberOfChildren}C
                      </td>
                      {/* Amount - Compact */}
                      <td className="px-3 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      {/* Status badge */}
                      <td className="px-3 py-3">
                        <span className={`badge text-xs ${getStatusColor(booking.bookingStatus)}`}>
                          {getStatusText(booking.bookingStatus)}
                        </span>
                      </td>
                      {/* Actions - Centered */}
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-2 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems
                  )}{' '}
                  of {pagination.totalItems} bookings
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="btn btn-secondary py-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="btn btn-secondary py-2"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p>No bookings found</p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Booking Details"
        size="large"
      >
        {selectedBooking && (
          <div className="p-6">
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{selectedBooking.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedBooking.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Reference:</span>
                    <p className="font-medium text-primary-600">
                      {selectedBooking.bookingReference}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium">{selectedBooking.bookingType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Dates:</span>
                    <p className="font-medium">
                      {formatDateShort(selectedBooking.dateFrom)} -{' '}
                      {formatDateShort(selectedBooking.dateTo)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Adults:</span>
                    <p className="font-medium">{selectedBooking.numberOfAdults}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Children:</span>
                    <p className="font-medium">{selectedBooking.numberOfChildren}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <p className="font-medium text-primary-600">
                      {formatCurrency(selectedBooking.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p>
                      <span className={`badge ${getStatusColor(selectedBooking.bookingStatus)}`}>
                        {getStatusText(selectedBooking.bookingStatus)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Receipt */}
              {selectedBooking.paymentReceiptUrl && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Receipt</h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Uploaded Receipt</span>
                      <a
                        href={selectedBooking.paymentReceiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Download
                      </a>
                    </div>
                    <div className="relative bg-white border border-gray-300 rounded-lg overflow-hidden">
                      {selectedBooking.paymentReceiptUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="p-8 text-center">
                          <svg
                            className="w-16 h-16 mx-auto mb-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-gray-600 mb-4">PDF Document</p>
                          <a
                            href={selectedBooking.paymentReceiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                          >
                            Open PDF
                          </a>
                        </div>
                      ) : (
                        <img
                          src={selectedBooking.paymentReceiptUrl}
                          alt="Payment Receipt"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'pending')}
                    disabled={isUpdating || selectedBooking.bookingStatus === 'pending'}
                    className="btn btn-secondary"
                  >
                    Set Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                    disabled={isUpdating || selectedBooking.bookingStatus === 'confirmed'}
                    className="btn btn-primary"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                    disabled={isUpdating || selectedBooking.bookingStatus === 'completed'}
                    className="btn"
                    style={{ background: '#10b981', color: 'white' }}
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    disabled={isUpdating || selectedBooking.bookingStatus === 'cancelled'}
                    className="btn btn-danger"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingsList;
