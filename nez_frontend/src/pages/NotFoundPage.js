import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center text-center"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
            <div className="text-white">
                <div style={{ fontSize: '80px' }}>🎭</div>
                <h1 className="fw-bold display-1" style={{ color: '#f97316' }}>404</h1>
                <h4 className="fw-bold mb-3">Page Not Found</h4>
                <p className="text-white-50 mb-4">
                    Looks like this event doesn't exist or has been removed.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                    <button
                        className="btn btn-warning fw-semibold px-4"
                        onClick={() => navigate('/')}
                    >
                        Browse Events
                    </button>
                    <button
                        className="btn btn-outline-light px-4"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;