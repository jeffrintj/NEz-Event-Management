import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event APIs
export const getEvents = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`/events/?${params}`);
};

export const getEventDetail = (id) => {
  return api.get(`/events/${id}/`);
};

export const createEvent = (eventData) => {
  return api.post('/events/create/', eventData);
};

export const updateEvent = (id, eventData) => {
  return api.put(`/events/${id}/update/`, eventData);
};

export const deleteEvent = (id) => {
  return api.delete(`/events/${id}/delete/`);
};

// Booking APIs
export const createBooking = (bookingData) => {
  return api.post('/bookings/create/', bookingData);
};

export const getBookings = (email) => {
  return api.get(`/bookings/?email=${email}`);
};

export const cancelBooking = (id) => {
  return api.put(`/bookings/${id}/cancel/`);
};

export default api;