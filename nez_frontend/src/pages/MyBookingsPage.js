import React, { useState } from 'react';
import { getBookings, cancelBooking } from '../services/api';

function MyBookingsPage() {
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await getBookings(email);
            setBookings(response.data);
            setSearched(true);
        } catch (err) {
            setError('Failed to fetch bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await cancelBooking(bookingId);
            setBookings(prev =>
                prev.map(b =>
                    b.id === bookingId ? { ...b, status: 'cancelled' } : b
                )
            );
        } catch (err) {
            alert('Failed to cancel booking. Please try again.');
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-light min-vh-100 pb-5">
            {/* Header */}
            <div
                className="text-white text-center py-5"
                style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
            >
                <h1 className="fw-bold mb-2">My Bookings</h1>
                <p className="text-white-50">Enter your email to view all your bookings</p>
            </div>

            <div className="container py-5">
                {/* Email Search */}
                <div className="row justify-content-center mb-5">
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm p-4">
                            <form onSubmit={handleSearch}>
                                <label className="form-label fw-semibold">
                                    Your Email Address
                                </label>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-dark px-4"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        ) : (
                                            'Find Bookings'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-danger text-center">{error}</div>
                )}

                {/* No bookings found */}
                {searched && !loading && bookings.length === 0 && (
                    <div className="text-center py-4">
                        <div className="fs-1 mb-3">🎟️</div>
                        <h4 className="text-muted">No bookings found</h4>
                        <p className="text-muted">No bookings found for {email}</p>
                    </div>
                )}

                {/* Bookings List */}
                {bookings.length > 0 && (
                    <>
                        <h5 className="fw-bold mb-3">
                            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
                        </h5>
                        <div className="row g-3">
                            {bookings.map((booking) => (
                                <div className="col-md-6 col-lg-4" key={booking.id}>
                                    <div className={`card border-0 shadow-sm h-100 ${booking.status === 'cancelled' ? 'opacity-75' : ''}`}>
                                        <div className="card-body">
                                            {/* Status Badge */}
                                            <span
                                                className={`badge mb-2 ${booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`}
                                            >
                                                {booking.status === 'confirmed' ? '✅ Confirmed' : '❌ Cancelled'}
                                            </span>

                                            {/* Event Name */}
                                            <h6 className="fw-bold">{booking.event_title}</h6>

                                            {/* Details */}
                                            <div className="text-muted small mb-3">
                                                <div>📅 {formatDate(booking.event_date)}</div>
                                                <div>📍 {booking.event_venue}</div>
                                                <div>🎟️ {booking.tickets} ticket{booking.tickets !== 1 ? 's' : ''}</div>
                                                <div>💰 ₹{booking.total_amount}</div>
                                                <div>👤 {booking.user_name}</div>
                                            </div>

                                            {/* Booked on */}
                                            <p className="text-muted" style={{ fontSize: '11px' }}>
                                                Booked on {formatDate(booking.booked_at)}
                                            </p>

                                            {/* Cancel Button */}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    className="btn btn-outline-danger btn-sm w-100"
                                                    onClick={() => handleCancel(booking.id)}
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MyBookingsPage;