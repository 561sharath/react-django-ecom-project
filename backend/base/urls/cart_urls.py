from django.urls import path
from base.views import cart_views as views

urlpatterns = [
    
    path('usercart/',views.getUserCart,name="user-cart"),
    
    
]