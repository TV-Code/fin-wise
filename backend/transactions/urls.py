from django.urls import path
from .views import TransactionList, TransactionDetail, bulk_create_transactions, bulk_update_transactions

urlpatterns = [
    path('transactions/', TransactionList.as_view(), name='transaction-list'),
    path('transactions/<uuid:pk>/', TransactionDetail.as_view(), name='transaction-detail'),
    path('transactions/bulk_create/', bulk_create_transactions, name='bulk-create-transactions'),
    path('transactions/bulk_update/', bulk_update_transactions, name='bulk-update-transactions')
]