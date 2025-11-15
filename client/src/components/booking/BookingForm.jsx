import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Calendar, Users, Baby, Mail, Phone, User, FileText, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookingSchema } from '../../utils/validation';
import { calculateDays, calculateTotalAmount, formatCurrency, getMinBookingDate } from '../../utils/helpers';
import { getBlockedDates } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * BookingForm Component
 * Form for creating a new booking with real-time price calculation
 */
const BookingForm = ({ onSubmit, isLoading }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0); // 50% deposit
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [blockedDates, setBlockedDates] = useState([]);
  const [dateConflict, setDateConflict] = useState(false);

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
  const dateFrom = watch('dateFrom');
  const dateTo = watch('dateTo');

  // Fetch blocked dates on component mount
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await getBlockedDates();
        if (response.status === 'success') {
          setBlockedDates(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch blocked dates:', error);
      }
    };

    fetchBlockedDates();
  }, []);

  // Generate array of all blocked dates for date picker
  // Block ALL dates in confirmed booking ranges
  const getBlockedDateArray = () => {
    const blocked = [];
    blockedDates.forEach((booking) => {
      const start = new Date(booking.dateFrom);
      const end = new Date(booking.dateTo);

      // Add all dates in the range (inclusive)
      let current = new Date(start);
      while (current <= end) {
        blocked.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return blocked;
  };

  // Check if a date is blocked
  const isDateBlocked = (date) => {
    return blockedDates.some((booking) => {
      const blockedFrom = new Date(booking.dateFrom);
      const blockedTo = new Date(booking.dateTo);
      blockedFrom.setHours(0, 0, 0, 0);
      blockedTo.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      // Block dates within range (inclusive)
      return date >= blockedFrom && date <= blockedTo;
    });
  };

  // Check for date conflicts with confirmed bookings
  const checkDateConflict = (fromDate, toDate) => {
    if (!fromDate || !toDate) return false;

    const requestedFrom = new Date(fromDate);
    const requestedTo = new Date(toDate);

    return blockedDates.some((booking) => {
      const blockedFrom = new Date(booking.dateFrom);
      const blockedTo = new Date(booking.dateTo);

      // Check if dates overlap (standard overlap detection)
      // Overlap occurs if: requested end >= existing start AND requested start <= existing end
      return requestedTo >= blockedFrom && requestedFrom <= blockedTo;
    });
  };

  // Calculate total amount and deposit (50%) whenever values change
  useEffect(() => {
    if (dateFrom && dateTo && numberOfAdults) {
      const days = calculateDays(dateFrom, dateTo);
      const total = calculateTotalAmount(Number(numberOfAdults), days);
      const deposit = Math.round(total * 0.5); // Calculate 50% deposit
      setNumberOfDays(days);
      setTotalAmount(total);
      setDepositAmount(deposit);

      // Check for date conflicts
      const hasConflict = checkDateConflict(dateFrom, dateTo);
      setDateConflict(hasConflict);
    } else {
      setNumberOfDays(0);
      setTotalAmount(0);
      setDepositAmount(0);
      setDateConflict(false);
    }
  }, [numberOfAdults, dateFrom, dateTo, blockedDates]);

  const minDate = getMinBookingDate();

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

          {/* Phone - Exactly 7 digits required */}
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
                // Only allow numeric input
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
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 flex items-start gap-3">
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

      {/* Price Summary - Automatically calculates total and 50% deposit */}
      {numberOfDays > 0 && totalAmount > 0 && (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 sm:p-6 border-2 border-primary-300">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
          <div className="space-y-2 sm:space-y-3">
            {/* Adults count */}
            <div className="flex justify-between text-sm sm:text-base text-gray-700">
              <span>Adults:</span>
              <span className="font-semibold">{numberOfAdults || 0}</span>
            </div>
            {/* Children count (FREE) */}
            <div className="flex justify-between text-sm sm:text-base text-gray-700">
              <span>Children (FREE):</span>
              <span className="font-semibold text-primary-600">
                {watch('numberOfChildren') || 0}
              </span>
            </div>
            {/* Number of days */}
            <div className="flex justify-between text-sm sm:text-base text-gray-700">
              <span>Number of Days:</span>
              <span className="font-semibold">{numberOfDays}</span>
            </div>
            {/* Rate per adult per day */}
            <div className="flex justify-between text-sm sm:text-base text-gray-700">
              <span>Rate per Adult per Day:</span>
              <span className="font-semibold">GYD 5,000</span>
            </div>
            {/* Total amount */}
            <div className="border-t-2 border-primary-300 pt-3 flex justify-between items-center">
              <span className="text-base sm:text-lg font-bold text-gray-900">Total Amount:</span>
              <span className="text-xl sm:text-2xl font-bold text-primary-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            {/* Deposit amount (50% of total) - automatically calculated */}
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3 flex justify-between items-center">
              <div>
                <span className="text-base sm:text-lg font-bold text-green-900 block">
                  Deposit Required (50%):
                </span>
                <span className="text-xs text-green-700">Pay this amount to confirm booking</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(depositAmount)}
              </span>
            </div>
            {/* Calculation breakdown */}
            <p className="text-xs sm:text-sm text-gray-600 text-center mt-2">
              {numberOfAdults} adults × GYD 5,000 × {numberOfDays} day
              {numberOfDays > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Submit Button - Mobile optimized with larger touch target */}
      <button
        type="submit"
        className="btn btn-primary w-full py-4 sm:py-4 text-base sm:text-lg touch-manipulation"
        disabled={isLoading || dateConflict}
      >
        {isLoading ? (
          <LoadingSpinner size="small" text="Creating Booking..." />
        ) : dateConflict ? (
          'Dates Not Available'
        ) : (
          'Create Booking'
        )}
      </button>

      {/* Info text - removed receipt upload mention */}
      <p className="text-xs sm:text-sm text-gray-600 text-center px-2">
        After booking, you'll receive a confirmation email with payment instructions.
      </p>
    </form>
  );
};

export default BookingForm;
