import { useEffect, useState } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { getDashboardStats } from '../../services/api';
import { formatCurrency, formatDateShort, getStatusColor, parseErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard Component
 * Admin dashboard with statistics and recent bookings
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      if (response.status === 'success') {
        setStats(response.data);
      }
    } catch (error) {
      toast.error(parseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const { overview, recentBookings } = stats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">All Time</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{overview.totalBookings}</h3>
          <p className="text-sm text-gray-600">Total Bookings</p>
        </div>

        {/* Total Revenue */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency(overview.totalRevenue)}
          </h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        {/* Pending Bookings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="badge badge-pending">{overview.pendingBookings}</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{overview.pendingBookings}</h3>
          <p className="text-sm text-gray-600">Pending Bookings</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatCurrency(overview.pendingRevenue)} potential
          </p>
        </div>

        {/* Confirmed Bookings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary-600" />
            </div>
            <span className="badge badge-confirmed">{overview.confirmedBookings}</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{overview.confirmedBookings}</h3>
          <p className="text-sm text-gray-600">Confirmed Bookings</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completed */}
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900">{overview.completedBookings}</h4>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900">{overview.cancelledBookings}</h4>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900">
                {overview.totalBookings > 0
                  ? Math.round(
                      ((overview.confirmedBookings + overview.completedBookings) /
                        overview.totalBookings) *
                        100
                    )
                  : 0}
                %
              </h4>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>
        </div>

        {recentBookings && recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/bookings`)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-primary-600">
                      {booking.bookingReference}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{booking.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.bookingType}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateShort(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No bookings yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
