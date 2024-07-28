from django.conf import settings
import uuid
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.core.mail import send_mail
from django.db import models
from django.db.models import Q, F
from django.utils.translation import gettext_lazy as _

from core.managers import CustomUserManager

class CustomUser(AbstractBaseUser,PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    public_id = models.UUIDField(db_index=True, unique=True,
                                 default=uuid.uuid4, editable=False)
    first_name= models.CharField(max_length=255)
    last_name= models.CharField(max_length=255)
    email = models.EmailField(db_index=True, unique=True)
    phone_no = models.CharField(max_length=10,blank=True, unique=True, null=True)
    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    medical_records = models.OneToOneField('MedicalRecord', on_delete=models.CASCADE, null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email}"
    
    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"
    
    
class MedicalRecord(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='medical_record')
    allergies = models.TextField(blank=True)  # Use a text field to store multiple entries separated by commas or another delimiter
    dietary_restrictions = models.TextField(blank=True)

    def get_allergies(self):
        return self.allergies.split(',') if self.allergies else []

    def get_dietary_restrictions(self):
        return self.dietary_restrictions.split(',') if self.dietary_restrictions else []