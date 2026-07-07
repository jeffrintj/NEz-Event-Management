from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event, Booking
from .serializers import EventSerializer, BookingSerializer

# ─── EVENT VIEWS ───────────────────────────────────────────

@api_view(['GET'])
def event_list(request):
    """Get all events - with optional category filter"""
    category = request.query_params.get('category', None)
    city = request.query_params.get('city', None)

    events = Event.objects.all().order_by('-created_at')

    if category:
        events = events.filter(category=category)
    if city:
        events = events.filter(city__icontains=city)

    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def event_detail(request, pk):
    """Get single event by ID"""
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(
            {'error': 'Event not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = EventSerializer(event)
    return Response(serializer.data)


@api_view(['POST'])
def event_create(request):
    """Create a new event"""
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def event_update(request, pk):
    """Update an existing event"""
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(
            {'error': 'Event not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = EventSerializer(event, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def event_delete(request, pk):
    """Delete an event"""
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(
            {'error': 'Event not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    event.delete()
    return Response(
        {'message': 'Event deleted successfully'},
        status=status.HTTP_204_NO_CONTENT
    )


# ─── BOOKING VIEWS ─────────────────────────────────────────

@api_view(['POST'])
def booking_create(request):
    """Book tickets for an event"""
    event_id = request.data.get('event')
    tickets = request.data.get('tickets', 1)

    try:
        event = Event.objects.get(pk=event_id)
    except Event.DoesNotExist:
        return Response(
            {'error': 'Event not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check seat availability
    if event.available_seats < int(tickets):
        return Response(
            {'error': 'Not enough seats available'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Calculate total amount
    total_amount = event.ticket_price * int(tickets)

    # Reduce available seats
    event.available_seats -= int(tickets)
    event.save()

    # Save booking
    booking_data = request.data.copy()
    booking_data['total_amount'] = total_amount
    serializer = BookingSerializer(data=booking_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def booking_list(request):
    """Get all bookings for a specific email"""
    email = request.query_params.get('email', None)
    if email:
        bookings = Booking.objects.filter(user_email=email).order_by('-booked_at')
    else:
        bookings = Booking.objects.all().order_by('-booked_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def booking_cancel(request, pk):
    """Cancel a booking"""
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Restore available seats
    event = booking.event
    event.available_seats += booking.tickets
    event.save()

    booking.status = 'cancelled'
    booking.save()
    return Response({'message': 'Booking cancelled successfully'})
