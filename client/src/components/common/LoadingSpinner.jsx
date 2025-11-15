import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner Component
 * Displays a loading spinner with optional text
 */
const LoadingSpinner = ({ size = 'medium', text = '', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-primary-600`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
