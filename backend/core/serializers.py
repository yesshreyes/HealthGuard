from core.models import CustomUser, MedicalRecord
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import update_last_login
User = get_user_model()

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = '__all__'
        
        
class CustomUserSerializer(serializers.ModelSerializer):
    medical_record = MedicalRecordSerializer(read_only=False)
    id = serializers.UUIDField(source='public_id',
                               read_only=True, format='hex')
    
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'role', 'is_active', 'medical_record']
        read_only_fields = ['is_active', 'role']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        medical_record_data = validated_data.get('medical_record')
        if medical_record_data:
            medical_record = instance.medical_record
            medical_record.allergies = medical_record_data.get('allergies', medical_record.allergies)
            medical_record.chronic_diseases = medical_record_data.get('chronic_diseases', medical_record.chronic_diseases)
            medical_record.dietary_restrictions = medical_record_data.get('dietary_restrictions', medical_record.dietary_restrictions)
            medical_record.save()

        return instance

        
        
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=126, min_length=8, write_only=True, required=True)
    id = serializers.UUIDField(source='public_id', read_only=True, format='hex')
    medical_record = MedicalRecordSerializer(required=False)  # Include MedicalRecord in the serializer

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'medical_record']

    def create(self, validated_data):
        password = validated_data.pop('password')
        medical_record_data = validated_data.pop('medical_record', {})
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.is_active = True
        user.save()

        # Create the MedicalRecord for the user
        MedicalRecord.objects.create(user=user, **medical_record_data)

        return user

        
class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("User account is not active.")

        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid email or password.")

        refresh = self.get_token(user)
        user_data = CustomUserSerializer(user).data

        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data,
        }

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, user)

        return data
