import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Calendar, Users, Baby, Mail, Phone, User, FileText, AlertCircle, Upload, CheckCircle, Info } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookingSchema } from '../../utils/validation';
import { calculateDays, calculateTotalAmount, formatCurrency, getMinBookingDate, validateFileUpload } from '../../utils/helpers';
import { createSupabaseBooking, getConfirmedBookings } from '../../services/supabaseService';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * BookingFormWithReceipt Component
 * Complete booking form with receipt upload and Supabase integration
 */
const BookingFormWithReceipt = ({ onSuccess }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [blockedDates, setBlockedDates] = useState([]);
  const [dateConflict, setDateConflict] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Receipt upload state
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptError, setReceiptError] = useState('');
  const [receiptPreview, setReceiptPreview] = useState(null);

  // Add-ons state
  const [addOns, setAddOns] = useState({
    meals: false,
    transportation: false,
    tourGuide: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      numberOfAdults: 10,
      numberOfChildren: 0,
    },
  });

  // Watch form values for real-time calculation
  const numberOfAdults = watch('numberOfAdults');
  const numberOfChildren = watch('numberOfChildren');
  const dateFrom = watch('dateFrom');
  const dateTo = watch('dateTo');

  // Fetch confirmed bookings on component mount
  useEffect(() => {
    const fetchConfirmedBookings = async () => {
      try {
        const bookings = await getConfirmedBookings();
        setBlockedDates(bookings);
      } catch (error) {
        console.error('Failed to fetch confirmed bookings:', error);
      }
    };

    fetchConfirmedBookings();
  }, []);

  // Generate array of all blocked dates for date picker
  const getBlockedDateArray = () => {
    const blocked = [];
    blockedDates.forEach((booking) => {
      const start = new Date(booking.date_from);
      const end = new Date(booking.date_to);

      let current = new Date(start);
      while (current <= end) {
        blocked.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return blocked;
  };

  // Check for date conflicts with confirmed bookings
  const checkDateConflict = (fromDate, toDate) => {
    if (!fromDate || !toDate) return false;

    const requestedFrom = new Date(fromDate);
    const requestedTo = new Date(toDate);

    return blockedDates.some((booking) => {
      const blockedFrom = new Date(booking.date_from);
      const blockedTo = new Date(booking.date_to);

      return requestedTo >= blockedFrom && requestedFrom <= blockedTo;
    });
  };

  // Calculate total amount and deposit whenever values change
  useEffect(() => {
    if (dateFrom && dateTo && numberOfAdults) {
      const days = calculateDays(dateFrom, dateTo);
      const total = calculateTotalAmount(Number(numberOfAdults), days);
      const deposit = Math.round(total * 0.5);
      setNumberOfDays(days);
      setTotalAmount(total);
      setDepositAmount(deposit);

      const hasConflict = checkDateConflict(dateFrom, dateTo);
      setDateConflict(hasConflict);
    } else {
      setNumberOfDays(0);
      setTotalAmount(0);
      setDepositAmount(0);
      setDateConflict(false);
    }
  }, [numberOfAdults, dateFrom, dateTo, blockedDates]);

  // Handle receipt file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setReceiptError('');

    if (file) {
      const validation = validateFileUpload(file);

      if (!validation.success) {
        setReceiptError(validation.error);
        setReceiptFile(null);
        setReceiptPreview(null);
        return;
      }

      setReceiptFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReceiptPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  // Handle form submission with Supabase
  const onSubmit = async (formData) => {
    // Validate receipt upload
    if (!receiptFile) {
      setReceiptError('Please upload your payment receipt');
      toast.error('Payment receipt is required');
      return;
    }

    // Validate date selection
    if (!dateFrom || !dateTo) {
      toast.error('Please select booking dates');
      return;
    }

    if (dateConflict) {
      toast.error('Selected dates are not available');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data
      const bookingData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        bookingType: formData.bookingType,
        numberOfAdults: Number(formData.numberOfAdults),
        numberOfChildren: Number(formData.numberOfChildren),
        dateFrom: new Date(dateFrom).toISOString(),
        dateTo: new Date(dateTo).toISOString(),
        numberOfDays,
        totalAmount,
        depositAmount,
        addOns,
      };

      // Create booking in Supabase with receipt upload
      const response = await createSupabaseBooking(bookingData, receiptFile);

      if (response.status === 'success') {
        toast.success('Booking created successfully!');

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      toast.error(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = getMinBookingDate();

  // Check if form is complete
  const isFormComplete = receiptFile && dateFrom && dateTo && !dateConflict && !isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="label">
              <User className="w-4 h-4 inline mr-1" />
              Full Name
            </label>
            <input
              type="text"
              {...register('customerName')}
              className={`input ${errors.customerName ? 'input-error' : ''}`}
              placeholder="John Doe"
            />
            {errors.customerName && (
              <p className="error-text">{errors.customerName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              {...register('customerEmail')}
              className={`input ${errors.customerEmail ? 'input-error' : ''}`}
              placeholder="john@example.com"
            />
            {errors.customerEmail && (
              <p className="error-text">{errors.customerEmail.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="label">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength="7"
              {...register('customerPhone')}
              className={`input ${errors.customerPhone ? 'input-error' : ''}`}
              placeholder="6251234"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
              }}
            />
            {errors.customerPhone && (
              <p className="error-text">{errors.customerPhone.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Enter exactly 7 digits</p>
          </div>

          {/* Booking Type */}
          <div>
            <label className="label">
              <FileText className="w-4 h-4 inline mr-1" />
              Booking Type
            </label>
            <select
              {...register('bookingType')}
              className={`input ${errors.bookingType ? 'input-error' : ''}`}
            >
              <option value="">Select booking type</option>
              <option value="Day Visit">Day Visit</option>
              <option value="Weekend Camping">Weekend Camping</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Other">Other</option>
            </select>
            {errors.bookingType && (
              <p className="error-text">{errors.bookingType.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Booking Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number of Adults */}
          <div>
            <label className="label">
              <Users className="w-4 h-4 inline mr-1" />
              Number of Adults (Min: 10)
            </label>
            <input
              type="number"
              {...register('numberOfAdults', { valueAsNumber: true })}
              className={`input ${errors.numberOfAdults ? 'input-error' : ''}`}
              min="10"
              placeholder="10"
            />
            {errors.numberOfAdults && (
              <p className="error-text">{errors.numberOfAdults.message}</p>
            )}
          </div>

          {/* Number of Children */}
          <div>
            <label className="label">
              <Baby className="w-4 h-4 inline mr-1" />
              Number of Children (Under 12 - FREE)
            </label>
            <input
              type="number"
              {...register('numberOfChildren', { valueAsNumber: true })}
              className={`input ${errors.numberOfChildren ? 'input-error' : ''}`}
              min="0"
              placeholder="0"
            />
            {errors.numberOfChildren && (
              <p className="error-text">{errors.numberOfChildren.message}</p>
            )}
          </div>

          {/* Date From */}
          <div>
            <label className="label">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <Controller
              name="dateFrom"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date ? date.toISOString().split('T')[0] : '');
                  }}
                  excludeDates={getBlockedDateArray()}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select start date"
                  className={`input ${errors.dateFrom ? 'input-error' : ''}`}
                  wrapperClassName="w-full"
                  calendarClassName="shadow-xl"
                />
              )}
            />
            {errors.dateFrom && <p className="error-text">{errors.dateFrom.message}</p>}
          </div>

          {/* Date To */}
          <div>
            <label className="label">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
            <Controller
              name="dateTo"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date ? date.toISOString().split('T')[0] : '');
                  }}
                  excludeDates={getBlockedDateArray()}
                  minDate={dateFrom ? new Date(dateFrom) : new Date()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select end date"
                  className={`input ${errors.dateTo ? 'input-error' : ''}`}
                  wrapperClassName="w-full"
                  calendarClassName="shadow-xl"
                />
              )}
            />
            {errors.dateTo && <p className="error-text">{errors.dateTo.message}</p>}
          </div>
        </div>

        {/* Date Conflict Warning */}
        {dateConflict && (
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 flex items-start gap-3 mt-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-900 mb-1">Dates Not Available</h4>
              <p className="text-sm text-red-800">
                The selected dates overlap with a confirmed booking. Please choose different dates
                to proceed with your reservation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add-ons Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services (Optional)</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-400 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={addOns.meals}
              onChange={(e) => setAddOns({ ...addOns, meals: e.target.checked })}
              className="w-5 h-5 text-primary-600 rounded"
            />
            <span className="text-gray-700">Meals</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-400 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={addOns.transportation}
              onChange={(e) => setAddOns({ ...addOns, transportation: e.target.checked })}
              className="w-5 h-5 text-primary-600 rounded"
            />
            <span className="text-gray-700">Transportation</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-400 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={addOns.tourGuide}
              onChange={(e) => setAddOns({ ...addOns, tourGuide: e.target.checked })}
              className="w-5 h-5 text-primary-600 rounded"
            />
            <span className="text-gray-700">Tour Guide</span>
          </label>
        </div>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            All tours are conducted by <a href="https://www.instagram.com/ckforesttours/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-900">CK Forest Tours</a>
          </p>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Payment Instructions
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Please pay via:</p>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="font-bold text-primary-600 mb-2">MMG</p>
            <p>Account: <span className="font-semibold">CK-6335874</span></p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="font-bold text-primary-600 mb-2">Bank Transfer</p>
            <p>Bank: <span className="font-semibold">Republic Bank (Camp St.)</span></p>
            <p>Account Number: <span className="font-semibold">9000369260369</span></p>
          </div>
        </div>
      </div>

      {/* Receipt Upload Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary-600" />
          Upload Payment Receipt
        </h3>
        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          receiptFile ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 bg-gray-50'
        }`}>
          <Upload className="w-12 h-12 text-primary-600 mx-auto mb-3" />

          <input
            type="file"
            id="receipt-upload"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isSubmitting}
          />

          <label
            htmlFor="receipt-upload"
            className="btn btn-primary mb-3 cursor-pointer inline-block"
          >
            {receiptFile ? 'Change Receipt' : 'Select Receipt'}
          </label>

          {receiptFile && (
            <div className="mt-3">
              {receiptPreview && (
                <img src={receiptPreview} alt="Receipt preview" className="max-w-xs mx-auto rounded-lg border-2 border-primary-300 mb-3" />
              )}
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">{receiptFile.name}</span>
                <span className="text-sm text-gray-500">
                  ({(receiptFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 mt-2">
            Accepted formats: JPG, PNG, PDF (Max 5MB)
          </p>
        </div>

        {receiptError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{receiptError}</p>
          </div>
        )}
      </div>

      {/* Price Summary */}
      {numberOfDays > 0 && totalAmount > 0 && (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border-2 border-primary-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Adults:</span>
              <span className="font-semibold">{numberOfAdults || 0}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Children (FREE):</span>
              <span className="font-semibold text-primary-600">{numberOfChildren || 0}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Number of Days:</span>
              <span className="font-semibold">{numberOfDays}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Rate per Adult per Day:</span>
              <span className="font-semibold">GYD 5,000</span>
            </div>
            <div className="border-t-2 border-primary-300 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3 flex justify-between items-center">
              <div>
                <span className="text-lg font-bold text-green-900 block">
                  Deposit Required (50%):
                </span>
                <span className="text-xs text-green-700">Pay this amount to confirm booking</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(depositAmount)}
              </span>
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
              {numberOfAdults} adults × GYD 5,000 × {numberOfDays} day{numberOfDays > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary w-full py-4 text-lg touch-manipulation"
        disabled={!isFormComplete}
      >
        {isSubmitting ? (
          <LoadingSpinner size="small" text="Creating Booking..." />
        ) : !receiptFile ? (
          'Upload Receipt to Book'
        ) : dateConflict ? (
          'Dates Not Available'
        ) : !dateFrom || !dateTo ? (
          'Select Dates to Continue'
        ) : (
          'Book Now'
        )}
      </button>

      {/* Info text */}
      <p className="text-sm text-gray-600 text-center px-2">
        After booking, you'll receive a confirmation email. Your booking will be confirmed once payment is verified.
      </p>
    </form>
  );
};

export default BookingFormWithReceipt;
