from django.urls import path
from .views import BudgetList, BudgetDetail, SaveSelectedBudgetsView, GetSelectedBudgetsView

urlpatterns = [
    path('', BudgetList.as_view(), name='budget-list'),
    path('<uuid:pk>/', BudgetDetail.as_view(), name='budget-detail'),
    path('saveSelectedBudgets/', SaveSelectedBudgetsView.as_view(), name='save-selected-budgets'),
    path('getSelectedBudgets/', GetSelectedBudgetsView.as_view(), name='get-selected-budgets'),
]