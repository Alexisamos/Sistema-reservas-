from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import Servicio, Reserva
from .serializers import (
    UserSerializer, RegisterSerializer,
    ServicioSerializer, ReservaSerializer
)

# Registro de usuarios
class RegisterView(generics.CreateAPIView):
    queryset = Servicio.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

# Login JWT
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Credenciales inválidas'}, status=401)

# Servicios públicos
class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [permissions.AllowAny]

# CRUD de Reservas (autenticado)
class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    def get_queryset(self):
        if self.request.user.is_staff:
            return Reserva.objects.all()
        return Reserva.objects.filter(usuario=self.request.user)
