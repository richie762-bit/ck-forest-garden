import { useState } from 'react';
import Modal from '../common/Modal';
import BookingForm from './BookingForm';
import Receipt from './Receipt';
import { createBooking } from '../../services/api';
import { parseErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

/**
 * BookingModal Component
 * Two-step booking flow: Form → Receipt (Upload step removed)
 */
const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Receipt
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal closes
  const handleClose = () => {
    setStep(1);
    setBooking(null);
    setIsLoading(false);
    onClose();
  };

  // Handle booking form submission
  const handleBookingSubmit = async (formData) => {
    setIsLoading(true);

    try {
      // Convert date strings to ISO datetime format
      const bookingData = {
        ...formData,
        dateFrom: new Date(formData.dateFrom).toISOString(),
        dateTo: new Date(formData.dateTo).toISOString(),
      };

      const response = await createBooking(bookingData);

      if (response.status === 'success' && response.data) {
        setBooking(response.data);
        setStep(2); // Move to receipt step
        toast.success('Booking created successfully!');
      }
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large" title="">
      <div className="p-4 sm:p-6">
        {/* Progress Steps - Only 2 steps now (removed upload step) */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Step 1: Booking Form */}
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                1
              </div>
              <span
                className={`hidden sm:inline font-medium text-sm sm:text-base ${
                  step >= 1 ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                Booking
              </span>
            </div>

            <div className="w-12 sm:w-16 h-0.5 bg-gray-300"></div>

            {/* Step 2: Receipt (Upload step removed) */}
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 2
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                2
              </div>
              <span
                className={`hidden sm:inline font-medium text-sm sm:text-base ${
                  step >= 2 ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div>
          {/* Step 1: Booking Form */}
          {step === 1 && (
            <BookingForm onSubmit={handleBookingSubmit} isLoading={isLoading} />
          )}

          {/* Step 2: Receipt (Upload step removed - simplified flow) */}
          {step === 2 && booking && (
            <div>
              <Receipt booking={booking} />
              <div className="mt-6">
                <button
                  onClick={handleClose}
                  className="btn btn-primary w-full py-3 sm:py-4 text-base sm:text-lg touch-manipulation"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookingModal;
