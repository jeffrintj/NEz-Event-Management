import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventDetail, createBooking } from '../services/api';

function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Booking form state
    const [bookingForm, setBookingForm] = useState({
        user_name: '',
        user_email: '',
        tickets: 1,
    });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState(null);

    useEffect(() => {
        fetchEventDetail();
    }, [id]);

    const fetchEventDetail = async () => {
        setLoading(true);
        try {
            const response = await getEventDetail(id);
            setEvent(response.data);
            setError(null);
        } catch (err) {
            setError('Event not found or something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setBookingLoading(true);
        setBookingError(null);

        try {
            await createBooking({
                event: event.id,
                user_name: bookingForm.user_name,
                user_email: bookingForm.user_email,
                tickets: parseInt(bookingForm.tickets),
            });
            setBookingSuccess(true);
            // Update available seats in UI
            setEvent(prev => ({
                ...prev,
                available_seats: prev.available_seats - parseInt(bookingForm.tickets)
            }));
        } catch (err) {
            setBookingError(
                err.response?.data?.error || 'Booking failed. Please try again.'
            );
        } finally {
            setBookingLoading(false);
        }
    };

    // Total amount calculation
    const totalAmount = event
        ? (parseFloat(event.ticket_price) * parseInt(bookingForm.tickets)).toFixed(2)
        : 0;

    // Format date
    const formattedDate = event
        ? new Date(event.date).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '';

    // Format time
    const formattedTime = event
        ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
        : '';

    // Category badge color
    const categoryColors = {
        concert: 'danger',
        workshop: 'primary',
        business: 'success',
        food: 'warning',
        sports: 'info',
        other: 'secondary',
    };

    if (loading) {
        return (
            <div className="text-center py-5 min-vh-100 d-flex align-items-center justify-content-center">
                <div>
                    <div className="spinner-border text-warning" role="status"></div>
                    <p className="mt-3 text-muted">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center">
                <div className="fs-1 mb-3">😕</div>
                <h4>{error}</h4>
                <button className="btn btn-dark mt-3" onClick={() => navigate('/')}>
                    Back to Events
                </button>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 pb-5">
            {/* Event Hero Image */}
            <div
                className="position-relative"
                style={{ height: '350px', overflow: 'hidden' }}
            >
                {event.image ? (
                    <img
                        src={`http://127.0.0.1:8000${event.image}`}
                        alt={event.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        className="w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}
                    >
                        <span style={{ fontSize: '80px' }}>🎉</span>
                    </div>
                )}
                {/* Dark overlay */}
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'rgba(0,0,0,0.4)' }}
                ></div>
                {/* Back button */}
                <button
                    className="position-absolute top-0 start-0 m-3 btn btn-light btn-sm"
                    onClick={() => navigate('/')}
                >
                    ← Back to Events
                </button>
                {/* Event title overlay */}
                <div className="position-absolute bottom-0 start-0 p-4 text-white">
                    <span
                        className={`badge bg-${categoryColors[event.category] || 'secondary'} mb-2 text-capitalize`}
                    >
                        {event.category}
                    </span>
                    <h1 className="fw-bold">{event.title}</h1>
                </div>
            </div>

            <div className="container py-4">
                <div className="row g-4">

                    {/* Left Column — Event Details */}
                    <div className="col-lg-7">
                        {/* Quick Info Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <div className="card border-0 shadow-sm p-3">
                                    <div className="text-muted small mb-1">📅 Date & Time</div>
                                    <div className="fw-semibold">{formattedDate}</div>
                                    <div className="text-muted">{formattedTime}</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="card border-0 shadow-sm p-3">
                                    <div className="text-muted small mb-1">📍 Venue</div>
                                    <div className="fw-semibold">{event.venue}</div>
                                    <div className="text-muted">{event.city}</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="card border-0 shadow-sm p-3">
                                    <div className="text-muted small mb-1">🪑 Seats</div>
                                    <div className="fw-semibold">{event.available_seats} available</div>
                                    <div className="text-muted">of {event.total_seats} total</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="card border-0 shadow-sm p-3">
                                    <div className="text-muted small mb-1">🎟️ Ticket Price</div>
                                    <div className="fw-bold fs-5 text-success">
                                        {event.ticket_price === '0.00' ? 'Free' : `₹${event.ticket_price}`}
                                    </div>
                                    <div className="text-muted">per ticket</div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="card border-0 shadow-sm p-4">
                            <h5 className="fw-bold mb-3">About This Event</h5>
                            <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                                {event.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column — Booking Form */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '80px' }}>

                            {/* Booking Success */}
                            {bookingSuccess ? (
                                <div className="text-center py-3">
                                    <div className="fs-1 mb-3">🎉</div>
                                    <h4 className="fw-bold text-success">Booking Confirmed!</h4>
                                    <p className="text-muted">
                                        Your {bookingForm.tickets} ticket(s) for<br />
                                        <strong>{event.title}</strong><br />
                                        have been booked successfully.
                                    </p>
                                    <p className="text-muted small">
                                        Confirmation sent to<br />
                                        <strong>{bookingForm.user_email}</strong>
                                    </p>
                                    <div className="d-grid gap-2 mt-3">
                                        <button
                                            className="btn btn-dark"
                                            onClick={() => navigate('/my-bookings')}
                                        >
                                            View My Bookings
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/')}
                                        >
                                            Browse More Events
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h5 className="fw-bold mb-4">Book Tickets</h5>

                                    {/* No seats available */}
                                    {event.available_seats === 0 ? (
                                        <div className="alert alert-danger text-center">
                                            <strong>Sold Out!</strong><br />
                                            No seats available for this event.
                                        </div>
                                    ) : (
                                        <form onSubmit={handleBooking}>
                                            {/* Name */}
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="user_name"
                                                    placeholder="Enter your full name"
                                                    value={bookingForm.user_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="user_email"
                                                    placeholder="Enter your email"
                                                    value={bookingForm.user_email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            {/* Tickets */}
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Number of Tickets
                                                </label>
                                                <select
                                                    className="form-select"
                                                    name="tickets"
                                                    value={bookingForm.tickets}
                                                    onChange={handleInputChange}
                                                >
                                                    {[1, 2, 3, 4, 5].map(n => (
                                                        <option
                                                            key={n}
                                                            value={n}
                                                            disabled={n > event.available_seats}
                                                        >
                                                            {n} {n === 1 ? 'ticket' : 'tickets'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Total Amount */}
                                            <div className="bg-light rounded p-3 mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">
                                                        {bookingForm.tickets} × ₹{event.ticket_price}
                                                    </span>
                                                    <span className="fw-bold fs-5 text-success">
                                                        ₹{totalAmount}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Booking Error */}
                                            {bookingError && (
                                                <div className="alert alert-danger small">
                                                    {bookingError}
                                                </div>
                                            )}

                                            {/* Submit Button */}
                                            <div className="d-grid">
                                                <button
                                                    type="submit"
                                                    className="btn btn-warning fw-bold py-2"
                                                    disabled={bookingLoading}
                                                >
                                                    {bookingLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        `Confirm Booking — ₹${totalAmount}`
                                                    )}
                                                </button>
                                            </div>

                                            <p className="text-muted small text-center mt-2">
                                                No payment required for now
                                            </p>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetailPage;