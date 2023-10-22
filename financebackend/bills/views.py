from rest_framework import generics, views, status
from rest_framework.response import Response
from dateutil.relativedelta import relativedelta
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from transactions.models import Transaction
from .models import Bill
from .serializers import BillSerializer
from transactions.serializers import TransactionSerializer

class CustomPageNumberPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'bills': data,
            'totalCount': self.page.paginator.count
        })

class BillList(generics.ListCreateAPIView):
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = Bill.objects.filter(user=self.request.user)

        filter_param = self.request.query_params.get('filter', '').lower()
        if filter_param == "amount \u2197\uFE0E":
            queryset = queryset.order_by('amount')
        elif filter_param == "amount \u2198\uFE0E":
            queryset = queryset.order_by('-amount')
        elif filter_param == "date \u2197\uFE0E":
            queryset = queryset.order_by('due_date')
        elif filter_param == "date \u2198\uFE0E":
            queryset = queryset.order_by('-due_date')
        elif filter_param == "paid":
            queryset = queryset.filter(isPaid=1)
        elif filter_param == "unpaid":
            queryset = queryset.filter(isPaid=0)
        elif filter_param == "not recurring":
            queryset = queryset.filter(recurring="no")
        elif filter_param == "weekly":
            queryset = queryset.filter(recurring="weekly")
        elif filter_param == "monthly":
            queryset = queryset.filter(recurring="monthly")
        elif filter_param == "annually":
            queryset = queryset.filter(recurring="annually")

        search_description = self.request.query_params.get('searchDescription')
        if search_description:
            queryset = queryset.filter(description__icontains=search_description)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BillDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bill.objects.filter(user=self.request.user)

class UpdateBillPaidStatus(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, bill_id, *args, **kwargs):
        try:
            isPaid = str(request.data.get('isPaid')).lower() == 'true'
            bill = Bill.objects.get(id=bill_id, user=request.user)

            if isPaid:
                # Using serializer for Transaction
                transaction_data = {
                    'user': request.user.id,
                    'date': bill.due_date,
                    'description': f"Payment for {bill.name}",
                    'amount': bill.amount,
                    'type': 'outbound',
                    'bill': bill.id
                }
                transaction_serializer = TransactionSerializer(data=transaction_data)
                if transaction_serializer.is_valid():
                    transaction_serializer.save()
                else:
                    return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                # Handle recurring bill creation using a serializer
                if bill.recurring == 'weekly' or bill.recurring == 'monthly' or bill.recurring == 'annually':
                    if bill.recurring == 'weekly':
                        next_due_date = bill.due_date + relativedelta(weeks=1)
                    elif bill.recurring == 'monthly':
                        next_due_date = bill.due_date + relativedelta(months=1)
                    elif bill.recurring =='annually':
                        next_due_date = bill.due_date + relativedelta(years=1)
                    new_bill_data = {
                        'user': request.user.id,
                        'name': bill.name,
                        'amount': bill.amount,
                        'due_date': next_due_date,
                        'recurring': bill.recurring,
                        'isPaid': False,
                        'parent_bill': bill.id
                    }
                    new_bill_serializer = BillSerializer(data=new_bill_data, context={'user': request.user})
                    if new_bill_serializer.is_valid():
                        new_bill_serializer.save()
                        print("New bill created")
                    else:
                        return Response(new_bill_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Delete associated transactions and subsequent bills
                Transaction.objects.filter(bill=bill).delete()
                Bill.objects.filter(parent_bill=bill).delete()
                
            bill.isPaid = isPaid
            bill.save()

            return Response({"status": f"Bill marked as {'paid' if isPaid else 'unpaid'}"}, status=status.HTTP_200_OK)
        except Bill.DoesNotExist:
            return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)
