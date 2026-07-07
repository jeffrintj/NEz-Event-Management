import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer
            className="text-white pt-5 pb-4 mt-5"
            style={{ background: '#1a1a2e' }}
        >
            <div className="container">
                <div className="row g-4">

                    {/* Brand */}
                    <div className="col-md-4">
                        <h5 className="fw-bold mb-3">
                            <span style={{ color: '#f97316' }}>NE</span>z
                        </h5>
                        <p className="text-white-50 small">
                            Discover and book the best events in your city.
                            Concerts, workshops, meetups and more — all in one place.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-4">
                        <h6 className="fw-bold mb-3">Quick Links</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-white-50 text-decoration-none small">
                                    Browse Events
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/my-bookings" className="text-white-50 text-decoration-none small">
                                    My Bookings
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/admin-login" className="text-white-50 text-decoration-none small">
                                    Admin Panel
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="col-md-4">
                        <h6 className="fw-bold mb-3">Categories</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {['Concert', 'Workshop', 'Meetup', 'Festival', 'Sports', 'Other'].map(cat => (
                                <span
                                    key={cat}
                                    className="badge bg-secondary small"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <hr className="border-secondary mt-4" />
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <p className="text-white-50 small mb-0">
                        © 2026 NEz. Built with React.js + Django + MySQL
                    </p>
                    <p className="text-white-50 small mb-0">
                        Made by{' '}

                        href="https://github.com/jeffrintj"
                        target="_blank"
                        rel="noreferrer"
                        className="text-warning text-decoration-none"
                        <a>
                            Jeffrin T J
                        </a>
                    </p>
                </div>
            </div>
        </footer >
    );
}

export default Footer;