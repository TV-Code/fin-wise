from rest_framework import generics, status
from rest_framework.response import Response
from .models import Saving
from .serializers import SavingSerializer, SelectedSavingsSerializer
from rest_framework.permissions import IsAuthenticated

class SavingList(generics.ListCreateAPIView):
    serializer_class = SavingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Saving.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavingDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SavingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Saving.objects.filter(user=self.request.user)

class SaveSelectedSavingsView(generics.CreateAPIView):
    serializer_class = SelectedSavingsSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():

            user.savings.update(selected=False)

            Saving.objects.filter(id__in=serializer.validated_data["saving_ids"]).update(selected=True)

            return Response({"message": "Selected savings saved successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetSelectedSavingsView(generics.ListAPIView):
    serializer_class = SavingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Saving.objects.filter(user=user, selected=True)