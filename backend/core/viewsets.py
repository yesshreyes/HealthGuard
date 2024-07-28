from django.http import Http404

from core.serializers import CustomUserSerializer, LoginSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet,ModelViewSet
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from .models import CustomUser, MedicalRecord
from .serializers import MedicalRecordSerializer
from rest_framework.decorators import action

User = get_user_model()

class RegisterViewSet(ViewSet):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        print("Received data:", request.data)  # Print the received data

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create an empty MedicalRecord for the new user
        medical_record = MedicalRecord.objects.create(user=user)

        # Serialize the MedicalRecord to include in the response
        medical_record_serializer = MedicalRecordSerializer(medical_record)

        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response({
            "user": serializer.data,
            "medical_record": medical_record_serializer.data,
            "refresh": res["refresh"],
            "access": res["access"]
        }, status=status.HTTP_201_CREATED)
        
class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            # Collect error messages from the serializer
            errors = serializer.errors
            error_message = next(iter(errors.values()))[0]  # Extract the first error message
            return Response({'detail': error_message}, status=status.HTTP_400_BAD_REQUEST)

class LogoutViewSet(ViewSet):
    # authentication_classes = ()
    permission_classes = (IsAuthenticated,)  # You can temporarily change this to AllowAny for testing
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        refresh = request.data.get("refresh")
        print("Received refresh token:", refresh)  # Print the received refresh token

        if refresh is None:
            raise ValidationError({"detail": "A refresh token is required."})

        try:
            token = RefreshToken(request.data.get("refresh"))
            
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_204_NO_CONTENT)
        except TokenError:
            raise ValidationError({"detail": "The refresh token is invalid."})


class RefreshViewSet(ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ['post']


    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
#####Features

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    
    def get_object(self):
        try:
            obj = CustomUser.objects.get_object_by_public_id(self.kwargs['pk'])
            self.check_object_permissions(self.request, obj)
            return obj
        except CustomUser.DoesNotExist:
            raise Http404

### Dashboard
class CustomUserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'public_id'  # This will still be used for admin operations

    def get_queryset(self):
        # Admin users can see all users
        if self.request.user.is_staff:
            return CustomUser.objects.all()
        # Regular users can only see their own data
        return CustomUser.objects.filter(public_id=self.request.user.public_id)

    def retrieve(self, request, *args, **kwargs):
        # If the user is an admin, proceed with the default retrieve method
        if self.request.user.is_staff:
            return super().retrieve(request, *args, **kwargs)
        # For regular users, retrieve their own data only
        user = self.request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        print("Received data:", request.data)
        # If the user is an admin, proceed with the default update method
        if self.request.user.is_staff:
            return super().update(request, *args, **kwargs)
        # For regular users, update their own data only
        user = self.request.user
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(user, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        # If the user is an admin, proceed with the default partial_update method
        if self.request.user.is_staff:
            return super().partial_update(request, *args, **kwargs)
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def medical_records(self, request):
        # Fetch the authenticated user's medical record
        user = self.request.user
        medical_record = user.medical_record
        serializer = MedicalRecordSerializer(medical_record)
        return Response(serializer.data)

class MedicalRecordViewSet(ModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalRecord.objects.filter(user__public_id=self.request.user.public_id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)