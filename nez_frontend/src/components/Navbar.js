import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
            <div className="container">
                {/* Logo */}
                <Link className="navbar-brand fw-bold fs-4" to="/">
                    <span style={{ color: '#f97316' }}>N</span>
                    <span className="text-white">ew</span>
                    <span style={{ color: '#f97316' }}>E</span>
                    <span className="text-white">vent</span>
                    <span style={{ color: '#f97316' }}>z</span>
                </Link>

                {/* Mobile toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Nav links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto gap-2">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/' ? 'active fw-semibold' : ''}`}
                                to="/"
                            >
                                Events
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/my-bookings' ? 'active fw-semibold' : ''}`}
                                to="/my-bookings"
                            >
                                My Bookings
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="btn btn-warning btn-sm px-3 ms-2 fw-semibold"
                                to="/admin-dashboard"
                            >
                                Admin
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;