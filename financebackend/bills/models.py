from django.db import models
from django.contrib.auth.models import User
import uuid

class Bill(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bills', null=True)
    RECURRING_TYPES = [
        ('no', 'No'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('annually', 'Annually'),
    ]

    name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    recurring = models.CharField(max_length=8, choices=RECURRING_TYPES, default='no')
    isPaid = models.BooleanField(default=False)
    parent_bill = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
