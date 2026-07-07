# NEz — Event Management Platform

A full-stack event booking platform where users can discover, browse and book tickets for events across the city.

![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

---

## 🎯 Project Purpose

This project was built to practice and demonstrate full stack development skills including Python backend development, Django REST API development, MySQL database design, React.js component architecture, state management with React hooks, API integration using Axios, client-side caching, and end-to-end event booking business logic.

> Built as part of my journey transitioning into software development.

---

## 🚀 Features

### User Features
- 🎉 Browse all events with category and city filters
- 🔍 Search events by city
- 📄 View detailed event information
- 🎟️ Book tickets with instant confirmation
- 💺 Real-time seat availability tracking
- 📋 View all bookings by email
- ❌ Cancel bookings anytime

### Admin Features
- 🔐 Protected admin login
- 📊 Dashboard with total events, bookings and revenue stats
- ➕ Create new events
- ✏️ Edit existing events
- 🗑️ Delete events
- 👁️ View all bookings across all events

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Bootstrap 5, Axios, React Router DOM |
| Backend | Python, Django, Django REST Framework |
| Database | MySQL |
| Auth | JWT (djangorestframework-simplejwt) |
| Version Control | Git, GitHub |

---

## 📁 Project Structure

NEz/
├── NEz_backend/          # Django Backend
│   ├── events/           # Events and Bookings app
│   │   ├── models.py     # Event and Booking models
│   │   ├── serializers.py # DRF Serializers
│   │   ├── views.py      # API Views
│   │   └── urls.py       # API URL routes
│   ├── users/            # Users app
│   └── NEz_backend/      # Django settings
│
└── nez_frontend/         # React Frontend
└── src/
├── components/   # Navbar, Footer, EventCard
├── pages/        # All page components
└── services/     # API service (Axios)

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL

### Backend Setup
```bash
cd NEz_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create MySQL database:
```sql
CREATE DATABASE nez_db;
```

Update `settings.py` with your MySQL credentials, then:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd nez_frontend
npm install
npm start
```

---

## 🔗 API Endpoints

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/` | Get all events |
| GET | `/api/events/?category=concert` | Filter by category |
| GET | `/api/events/?city=Bangalore` | Filter by city |
| GET | `/api/events/:id/` | Get single event |
| POST | `/api/events/create/` | Create event |
| PUT | `/api/events/:id/update/` | Update event |
| DELETE | `/api/events/:id/delete/` | Delete event |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings/create/` | Book tickets |
| GET | `/api/bookings/?email=user@email.com` | Get bookings by email |
| PUT | `/api/bookings/:id/cancel/` | Cancel booking |

---

## 👤 Author

**Jeffrin T J**
- 💼 LinkedIn: [linkedin.com/in/jeffrin-tj](https://linkedin.com/in/jeffrin-tj)
- 🐙 GitHub: [github.com/jeffrintj](https://github.com/jeffrintj)
- 📧 Email: jeffrintjoy@gmail.com
