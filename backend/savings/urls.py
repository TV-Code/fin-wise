from django.urls import path
from .views import SavingList, SavingDetail, SaveSelectedSavingsView, GetSelectedSavingsView

urlpatterns = [
    path('', SavingList.as_view(), name='saving-list'),
    path('<uuid:pk>/', SavingDetail.as_view(), name='saving-detail'),
    path('saveSelectedSavings/', SaveSelectedSavingsView.as_view(), name='save-selected-savings'),
    path('getSelectedSavings/', GetSelectedSavingsView.as_view(), name='get-selected-savings'),
]