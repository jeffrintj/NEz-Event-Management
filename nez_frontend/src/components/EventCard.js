import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event }) {
  const {
    id,
    title,
    category,
    venue,
    city,
    date,
    time,
    available_seats,
    ticket_price,
    image,
  } = event;

  // Format date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Format time nicely
  const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Category badge color
  const categoryColors = {
    concert: 'danger',
    workshop: 'primary',
    business: 'success',
    food: 'warning',
    sports: 'info',
    other: 'secondary',
  };
  const badgeColor = categoryColors[category] || 'secondary';

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
      {/* Event Image */}
      {image ? (
        <img
          src={`http://127.0.0.1:8000${image}`}
          alt={title}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
      ) : (
        <div
          className="card-img-top d-flex align-items-center justify-content-center bg-secondary"
          style={{ height: '200px' }}
        >
          <span className="text-white fs-1">🎉</span>
        </div>
      )}

      <div className="card-body d-flex flex-column">
        {/* Category Badge */}
        <span className={`badge bg-${badgeColor} mb-2 align-self-start text-capitalize`}>
          {category}
        </span>

        {/* Title */}
        <h5 className="card-title fw-bold">{title}</h5>

        {/* Details */}
        <div className="text-muted small mb-3">
          <div className="mb-1">
            <span>📅</span> {formattedDate} at {formattedTime}
          </div>
          <div className="mb-1">
            <span>📍</span> {venue}, {city}
          </div>
          <div className="mb-1">
            <span>🪑</span> {available_seats} seats available
          </div>
        </div>

        {/* Price and Button */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-5 text-success">
            {ticket_price === '0.00' ? 'Free' : `₹${ticket_price}`}
          </span>
          <Link
            to={`/events/${id}`}
            className="btn btn-dark btn-sm px-3"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;