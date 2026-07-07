import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getBookings,
} from '../services/api';

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'concert',
        venue: '',
        city: '',
        date: '',
        time: '',
        total_seats: '',
        available_seats: '',
        ticket_price: '',
    });
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                getEvents(),
                getBookings(),
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'concert',
            venue: '',
            city: '',
            date: '',
            time: '',
            total_seats: '',
            available_seats: '',
            ticket_price: '',
        });
        setEditingEvent(null);
        setShowForm(false);
        setFormError(null);
        setFormSuccess(null);
    };

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            category: event.category,
            venue: event.venue,
            city: event.city,
            date: event.date,
            time: event.time.slice(0, 5),
            total_seats: event.total_seats,
            available_seats: event.available_seats,
            ticket_price: event.ticket_price,
        });
        setShowForm(true);
        setActiveTab('events');
        window.scrollTo(0, 0);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        try {
            if (editingEvent) {
                await updateEvent(editingEvent.id, formData);
                setFormSuccess('Event updated successfully!');
            } else {
                await createEvent(formData);
                setFormSuccess('Event created successfully!');
            }
            await fetchData();
            setTimeout(() => resetForm(), 1500);
        } catch (err) {
            setFormError('Failed to save event. Check all fields and try again.');
        }
    };

    const handleDelete = async (eventId, eventTitle) => {
        if (!window.confirm(`Delete "${eventTitle}"? This cannot be undone.`)) return;
        try {
            await deleteEvent(eventId);
            setEvents(prev => prev.filter(e => e.id !== eventId));
        } catch (err) {
            alert('Failed to delete event.');
        }
    };

    // Dashboard stats
    const totalEvents = events.length;
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + parseFloat(b.total_amount), 0)
        .toFixed(2);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
        });

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-warning"></div>
                    <p className="mt-3 text-muted">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            {/* Admin Header */}
            <div
                className="text-white py-3 px-4 d-flex justify-content-between align-items-center"
                style={{ background: '#1a1a2e' }}
            >
                <div>
                    <h5 className="mb-0 fw-bold">
                        <span style={{ color: '#f97316' }}>NEz</span> Admin Dashboard
                    </h5>
                    <small className="text-white-50">Event Management System</small>
                </div>
                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-bottom px-4">
                <div className="container">
                    <ul className="nav nav-tabs border-0">
                        {['dashboard', 'events', 'bookings'].map(tab => (
                            <li className="nav-item" key={tab}>
                                <button
                                    className={`nav-link text-capitalize fw-semibold ${activeTab === tab ? 'active' : 'text-muted'}`}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        if (tab !== 'events') resetForm();
                                    }}
                                >
                                    {tab === 'dashboard' && '📊 '}
                                    {tab === 'events' && '🎉 '}
                                    {tab === 'bookings' && '🎟️ '}
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="container py-4">

                {/* ── DASHBOARD TAB ── */}
                {activeTab === 'dashboard' && (
                    <>
                        <h5 className="fw-bold mb-4">Overview</h5>

                        {/* Stats Cards */}
                        <div className="row g-3 mb-4">
                            {[
                                { label: 'Total Events', value: totalEvents, icon: '🎉', color: 'primary' },
                                { label: 'Total Bookings', value: totalBookings, icon: '🎟️', color: 'success' },
                                { label: 'Confirmed', value: confirmedBookings, icon: '✅', color: 'warning' },
                                { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: '💰', color: 'danger' },
                            ].map((stat) => (
                                <div className="col-6 col-md-3" key={stat.label}>
                                    <div className="card border-0 shadow-sm p-3 text-center h-100">
                                        <div className="fs-2 mb-1">{stat.icon}</div>
                                        <div className={`fw-bold fs-4 text-${stat.color}`}>{stat.value}</div>
                                        <div className="text-muted small">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Bookings */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white fw-bold border-0 pt-3">
                                🕒 Recent Bookings
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Event</th>
                                            <th>Tickets</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.slice(0, 5).map(booking => (
                                            <tr key={booking.id}>
                                                <td>{booking.user_name}</td>
                                                <td className="text-truncate" style={{ maxWidth: '150px' }}>
                                                    {booking.event_title}
                                                </td>
                                                <td>{booking.tickets}</td>
                                                <td>₹{booking.total_amount}</td>
                                                <td>
                                                    <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td>{formatDate(booking.booked_at)}</td>
                                            </tr>
                                        ))}
                                        {bookings.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted py-4">
                                                    No bookings yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* ── EVENTS TAB ── */}
                {activeTab === 'events' && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Manage Events ({totalEvents})</h5>
                            {!showForm && (
                                <button
                                    className="btn btn-warning fw-semibold"
                                    onClick={() => setShowForm(true)}
                                >
                                    + Create New Event
                                </button>
                            )}
                        </div>

                        {/* Create / Edit Form */}
                        {showForm && (
                            <div className="card border-0 shadow-sm p-4 mb-4">
                                <h6 className="fw-bold mb-3">
                                    {editingEvent ? '✏️ Edit Event' : '➕ Create New Event'}
                                </h6>

                                {formError && <div className="alert alert-danger small">{formError}</div>}
                                {formSuccess && <div className="alert alert-success small">{formSuccess}</div>}

                                <form onSubmit={handleFormSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <label className="form-label fw-semibold">Event Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleFormChange}
                                                placeholder="Enter event title"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Category</label>
                                            <select
                                                className="form-select"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleFormChange}
                                            >
                                                {['concert', 'workshop', 'meetup', 'festival', 'sports', 'other'].map(c => (
                                                    <option key={c} value={c} className="text-capitalize">{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Description</label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                rows="3"
                                                value={formData.description}
                                                onChange={handleFormChange}
                                                placeholder="Describe your event"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Venue</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="venue"
                                                value={formData.venue}
                                                onChange={handleFormChange}
                                                placeholder="Venue name"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">City</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleFormChange}
                                                placeholder="City"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Time</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                name="time"
                                                value={formData.time}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Ticket Price (₹)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="ticket_price"
                                                value={formData.ticket_price}
                                                onChange={handleFormChange}
                                                placeholder="0 for free"
                                                min="0"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Total Seats</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="total_seats"
                                                value={formData.total_seats}
                                                onChange={handleFormChange}
                                                placeholder="Total capacity"
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Available Seats</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="available_seats"
                                                value={formData.available_seats}
                                                onChange={handleFormChange}
                                                placeholder="Available seats"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 mt-4">
                                        <button type="submit" className="btn btn-warning fw-semibold px-4">
                                            {editingEvent ? 'Update Event' : 'Create Event'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary px-4"
                                            onClick={resetForm}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Events Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Date</th>
                                            <th>City</th>
                                            <th>Seats</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map(event => (
                                            <tr key={event.id}>
                                                <td className="fw-semibold">{event.title}</td>
                                                <td>
                                                    <span className="badge bg-secondary text-capitalize">
                                                        {event.category}
                                                    </span>
                                                </td>
                                                <td>{formatDate(event.date)}</td>
                                                <td>{event.city}</td>
                                                <td>
                                                    <span className={event.available_seats === 0 ? 'text-danger fw-semibold' : ''}>
                                                        {event.available_seats}/{event.total_seats}
                                                    </span>
                                                </td>
                                                <td>
                                                    {event.ticket_price === '0.00' ? (
                                                        <span className="text-success">Free</span>
                                                    ) : (
                                                        `₹${event.ticket_price}`
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() => handleEditClick(event)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDelete(event.id, event.title)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {events.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted py-4">
                                                    No events yet — create your first event!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* ── BOOKINGS TAB ── */}
                {activeTab === 'bookings' && (
                    <>
                        <h5 className="fw-bold mb-4">All Bookings ({totalBookings})</h5>
                        <div className="card border-0 shadow-sm">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Event</th>
                                            <th>Tickets</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Booked On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking, index) => (
                                            <tr key={booking.id}>
                                                <td className="text-muted">{index + 1}</td>
                                                <td>{booking.user_name}</td>
                                                <td className="text-muted small">{booking.user_email}</td>
                                                <td
                                                    className="text-truncate fw-semibold"
                                                    style={{ maxWidth: '150px' }}
                                                >
                                                    {booking.event_title}
                                                </td>
                                                <td>{booking.tickets}</td>
                                                <td>₹{booking.total_amount}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="text-muted small">
                                                    {formatDate(booking.booked_at)}
                                                </td>
                                            </tr>
                                        ))}
                                        {bookings.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="text-center text-muted py-4">
                                                    No bookings yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminDashboardPage;