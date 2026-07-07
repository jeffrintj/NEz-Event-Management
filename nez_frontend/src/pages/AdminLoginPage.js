import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(null);

    // Simple admin credentials
    // In real world this would use JWT — for now hardcoded for simplicity
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (
            credentials.username === ADMIN_USERNAME &&
            credentials.password === ADMIN_PASSWORD
        ) {
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin-dashboard');
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
            <div className="card border-0 shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <div className="fs-1 mb-2">🔐</div>
                    <h4 className="fw-bold">Admin Login</h4>
                    <p className="text-muted small">NEz Event Management</p>
                </div>

                {error && (
                    <div className="alert alert-danger small">{error}</div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            placeholder="Enter username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Enter password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-warning fw-bold py-2">
                            Login to Dashboard
                        </button>
                    </div>
                </form>

                <p className="text-muted small text-center mt-3">
                    Username: admin / Password: admin123
                </p>
            </div>
        </div>
    );
}

export default AdminLoginPage;