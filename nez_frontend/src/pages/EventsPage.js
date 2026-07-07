import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { getEvents } from '../services/api';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const categories = ['', 'concert', 'workshop', 'business', 'food', 'sports', 'other'];

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, searchCity]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (searchCity) filters.city = searchCity;

      const response = await getEvents(filters);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div
        className="text-white text-center py-5"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">
            Discover Events in <span style={{ color: '#f97316' }}>Bangalore & Chennai</span>
          </h1>
          <p className="lead text-white-50 mb-4">
            Concerts, Workshops, Meetups and more — all in one place
          </p>

          {/* Search Bar */}
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group input-group-lg shadow">
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search by city..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
                <button
                  className="btn btn-warning px-4 fw-semibold"
                  onClick={fetchEvents}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter + Events */}
      <div className="container py-5">
        {/* Category Filter */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm px-3 rounded-pill ${selectedCategory === cat
                  ? 'btn-dark'
                  : 'btn-outline-secondary'
                }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === '' ? 'All Events' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-muted mb-4">
          {loading ? 'Loading...' : `${events.length} event${events.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-5">
            <div className="fs-1 mb-3">🔍</div>
            <h4 className="text-muted">No events found</h4>
            <p className="text-muted">Try a different category or city</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {events.map((event) => (
              <div className="col" key={event.id}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;