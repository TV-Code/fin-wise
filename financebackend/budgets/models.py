from django.db import models
from django.contrib.auth.models import User
from colorfield.fields import ColorField
import uuid

class Budget(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets', null=True)
    name = models.CharField(max_length=200)
    amount = models.IntegerField()
    startDate = models.DateField(null=True)
    endDate = models.DateField(null=True)
    color = ColorField()
    spent = models.IntegerField(default=0)
    left = models.IntegerField(default=0)
    percentage = models.IntegerField(default=0)
    selected = models.BooleanField(default=False)

    def compute_aggregates(self):
        total_spent = self.transactions.aggregate(spent=models.Sum('amount'))['spent']
        total_spent = total_spent if total_spent is not None else 0.0

        print(f"Total Spent: {total_spent}")
        print(f"Budget Amount: {self.amount}")

        self.spent = total_spent
        self.left = self.amount - total_spent
        self.percentage = round((total_spent / self.amount) * 100 if self.amount > 0 else 0)
            
        print(f"Left: {self.left}")
        print(f"Percentage: {self.percentage}")
        
        self.save()



