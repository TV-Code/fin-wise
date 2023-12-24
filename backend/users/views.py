from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    remember_me = request.data.get('remember_me', False)
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        response = Response({'detail': 'Login successful'}, status=status.HTTP_200_OK)
        max_age = 14*24*60*60 if remember_me else None
        response.set_cookie('auth_token', token.key, max_age=max_age, httponly=True, domain='localhost', path='/', samesite='Lax')
        return response
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_check(request):
    return Response({"message": "Authenticated"})

@api_view(['POST'])
def logout_view(request):
    # Delete the token to log the user out
    request.auth.delete() if request.auth else None
    response = Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
    response.delete_cookie('auth_token')
    return response
