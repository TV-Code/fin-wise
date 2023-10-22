from django.db import models
from django.contrib.auth.models import User
from colorfield.fields import ColorField
import uuid

class Saving(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='savings', null=True)
    name = models.CharField(max_length=255)
    amount = models.IntegerField(default=0)
    saved = models.IntegerField(default=0)
    left = models.IntegerField(default=0)
    percentage = models.PositiveIntegerField(default=0)
    color = ColorField()
    selected = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        self.left = self.amount - self.saved
        if self.amount != 0:
            self.percentage = (self.saved / self.amount) * 100
        super().save(*args, **kwargs)
