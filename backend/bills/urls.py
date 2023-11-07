from django.urls import path
from .views import BillList, BillDetail, UpdateBillPaidStatus

urlpatterns = [
    path('bills/<uuid:bill_id>/mark-paid/', UpdateBillPaidStatus.as_view(), name='mark-bill-paid'),
    path('bills/', BillList.as_view(), name='bill-list'),
    path('bills/<uuid:pk>/', BillDetail.as_view(), name='bill-detail'),
]