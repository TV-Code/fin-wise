from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('auth_check/', views.auth_check, name='auth-check'),
    path('logout/', views.logout_view, name='logout'),
]
