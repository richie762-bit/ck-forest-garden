import { useState } from 'react';
import Modal from '../common/Modal';
import BookingFormWithReceipt from './BookingFormWithReceipt';
import { CheckCircle } from 'lucide-react';

/**
 * NewBookingModal Component
 * Modal for new booking flow with Supabase integration
 */
const NewBookingModal = ({ isOpen, onClose }) => {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Reset state when modal closes
  const handleClose = () => {
    setBookingSuccess(false);
    setBookingData(null);
    onClose();
  };

  // Handle successful booking
  const handleBookingSuccess = (data) => {
    setBookingData(data);
    setBookingSuccess(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large" title="">
      <div className="p-4 sm:p-6">
        {!bookingSuccess ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Book Your Visit
              </h2>
              <p className="text-gray-600">
                Complete the form below to reserve your spot at CK Forest Gardens
              </p>
            </div>
            <BookingFormWithReceipt onSuccess={handleBookingSuccess} />
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Booking Submitted!</h2>
            <p className="text-lg text-gray-700 mb-2">
              Your booking reference: <span className="font-bold text-primary-600">{bookingData?.bookingReference}</span>
            </p>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Thank you for booking with CK Forest Gardens. We've received your payment receipt and will review it shortly. You'll receive a confirmation email once your booking is confirmed.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-lg mx-auto">
              <p className="text-sm text-blue-800">
                <strong>What's next?</strong> Our team will verify your payment and send you a confirmation email within 24 hours. Please check your email ({bookingData?.customer_email}) for updates.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NewBookingModal;
