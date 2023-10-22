from rest_framework import serializers
from .models import Bill

class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'  # Include all fields in the serialization
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context.get('user')
        if user:
            validated_data['user'] = user
        return super().create(validated_data)