from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import Transaction
from .serializers import TransactionSerializer, BulkTransactionListSerializer

class CustomPageNumberPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'transactions': data,
            'totalCount': self.page.paginator.count
        })

class TransactionList(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        if request.query_params.get('paginate', 'true').lower() == 'false':
            serializer = self.get_serializer(self.get_queryset().all().order_by('-date'), many=True)
            return Response(serializer.data)

        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)

        filter_param = self.request.query_params.get('filter', '').lower()
        if filter_param == "amount \u2197\uFE0E":
            queryset = queryset.order_by('amount')
        elif filter_param == "amount \u2198\uFE0E":
            queryset = queryset.order_by('-amount')
        elif filter_param == "date \u2197\uFE0E":
            queryset = queryset.order_by('date')
        elif filter_param == "date \u2198\uFE0E":
            queryset = queryset.order_by('-date')
        elif filter_param == "inbound":
            queryset = queryset.filter(type='inbound')
        elif filter_param == "outbound":
            queryset = queryset.filter(type='outbound')

        search_description = self.request.query_params.get('searchDescription')
        if search_description:
            queryset = queryset.filter(description__icontains=search_description)

        return queryset


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

@api_view(['POST'])
def bulk_create_transactions(request):
    modified_data = []
    user_id = request.user.id
    
    for transaction_data in request.data:
        transaction_data_copy = transaction_data.copy()  # Create a copy of the data
        transaction_data_copy["user"] = user_id          # Set the user for this copy
        modified_data.append(transaction_data_copy)      # Add the modified data to the new list

    serializer = TransactionSerializer(data=modified_data, many=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def bulk_update_transactions(request):
    data = request.data
    for transaction_data in data:
        try:
            instance = Transaction.objects.get(id=transaction_data["id"])
            serializer = TransactionSerializer(instance, data=transaction_data, partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Transaction.DoesNotExist:
            pass
    return Response(status=status.HTTP_204_NO_CONTENT)
