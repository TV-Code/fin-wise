from rest_framework import serializers
from .models import Saving

class SelectedSavingsSerializer(serializers.Serializer):
    saving_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False
    )

class SavingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saving
        fields = '__all__'  # Include all fields in the serialization
        read_only_fields = ['user']