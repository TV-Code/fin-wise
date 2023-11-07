from rest_framework import serializers
from .models import Budget

class SelectedBudgetsSerializer(serializers.Serializer):
    budget_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False
    )

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'  # Include all fields in the serialization
        read_only_fields = ['user']