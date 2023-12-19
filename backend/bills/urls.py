from django.urls import path
from .views import BillList, BillDetail, UpdateBillPaidStatus

urlpatterns = [
    path('<uuid:bill_id>/mark-paid/', UpdateBillPaidStatus.as_view(), name='mark-bill-paid'),
    path('', BillList.as_view(), name='bill-list'),
    path('<uuid:pk>/', BillDetail.as_view(), name='bill-detail'),
]