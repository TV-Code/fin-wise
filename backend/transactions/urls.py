from django.urls import path
from .views import TransactionList, TransactionDetail, bulk_create_transactions, bulk_update_transactions

urlpatterns = [
    path('', TransactionList.as_view(), name='transaction-list'),
    path('<uuid:pk>/', TransactionDetail.as_view(), name='transaction-detail'),
    path('bulk_create/', bulk_create_transactions, name='bulk-create-transactions'),
    path('bulk_update/', bulk_update_transactions, name='bulk-update-transactions')
]