from rest_framework import serializers
from .models import Transaction

class BulkTransactionListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        # Use the bulk_create method to create multiple transactions at once
        return Transaction.objects.bulk_create([
            Transaction(**item) for item in validated_data
        ])

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        # Specify the ListSerializer for bulk operations
        list_serializer_class = BulkTransactionListSerializer

# Add the child attribute after both serializers are defined
BulkTransactionListSerializer.child = TransactionSerializer()
