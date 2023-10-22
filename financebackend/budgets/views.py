from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Budget
from .serializers import BudgetSerializer, SelectedBudgetsSerializer

class BudgetList(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    pagination_class = None
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        instance.compute_aggregates()

class BudgetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        instance = serializer.save()
        instance.compute_aggregates()

class SaveSelectedBudgetsView(generics.CreateAPIView):
    serializer_class = SelectedBudgetsSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():

            user.budgets.update(selected=False)

            Budget.objects.filter(id__in=serializer.validated_data["budget_ids"]).update(selected=True)

            return Response({"message": "Selected budgets saved successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetSelectedBudgetsView(generics.ListAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Budget.objects.filter(user=user, selected=True)