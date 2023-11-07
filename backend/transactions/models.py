from django.db import models
from budgets.models import Budget
from bills.models import Bill
from django.contrib.auth.models import User
from colorfield.fields import ColorField
import uuid

class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions', null=True)
    TRANSACTION_TYPES = [
        ('inbound', 'Inbound'),
        ('outbound', 'Outbound'),
    ]

    date = models.DateField()
    description = models.CharField(max_length=300)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=8, choices=TRANSACTION_TYPES)
    color = ColorField(null=True, blank=True)
    budget = models.ForeignKey(Budget, null=True, on_delete=models.CASCADE, related_name='transactions')
    bill = models.ForeignKey(Bill, null=True, blank=True, on_delete=models.SET_NULL)

    def get_adjusted_amount(self):
        return self.amount if self.type == 'inbound' else -self.amount
    
    def save(self, *args, **kwargs):
        if self.budget:
            self.color = self.budget.color 
        super(Transaction, self).save(*args, **kwargs) 
        if self.budget:
            self.budget.compute_aggregates()

    def delete(self, *args, **kwargs):
        budget = self.budget
        super(Transaction, self).delete(*args, **kwargs)
        if budget:
            budget.compute_aggregates()

