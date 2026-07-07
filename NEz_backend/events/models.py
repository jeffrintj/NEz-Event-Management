from django.db import models

class Event(models.Model):
    CATEGORY_CHOICES = [
        ('concert', 'Concert'),
        ('workshop', 'Workshop'),
        ('business', 'Business'),
        ('food', 'Food'),
        ('sports', 'Sports'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    venue = models.CharField(max_length=300)
    city = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()
    total_seats = models.IntegerField()
    available_seats = models.IntegerField()
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Booking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    tickets = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} - {self.event.title}"