from django.urls import path
from . import views

urlpatterns = [
    # Event URLs
    path('events/', views.event_list, name='event-list'),
    path('events/<int:pk>/', views.event_detail, name='event-detail'),
    path('events/create/', views.event_create, name='event-create'),
    path('events/<int:pk>/update/', views.event_update, name='event-update'),
    path('events/<int:pk>/delete/', views.event_delete, name='event-delete'),

    # Booking URLs
    path('bookings/', views.booking_list, name='booking-list'),
    path('bookings/create/', views.booking_create, name='booking-create'),
    path('bookings/<int:pk>/cancel/', views.booking_cancel, name='booking-cancel'),
]