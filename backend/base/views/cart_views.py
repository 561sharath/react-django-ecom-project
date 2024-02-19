from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import UserCart
from base.serializers import UserCartSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from rest_framework import status
from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserCart(request):
    
    user = request.user
    orders = user.usercart_set.all()
    serializer = UserCartSerializer(orders,many=True)
    return Response(serializer.data)




