from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, MedicalRecord
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(BaseUserAdmin):
    model = CustomUser
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    list_display = ('email', 'first_name', 'last_name', 'role','height','weight', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'role')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_no','height','weight')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'role', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'phone_no', 'password1', 'password2', 'role''height','weight'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)

class MedicalRecordAdmin(admin.ModelAdmin):
    model = MedicalRecord
    list_display = ('user', 'allergies',  'dietary_restrictions')
    search_fields = ('user__email', 'allergies', 'dietary_restrictions')
    list_filter = ('user',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(MedicalRecord, MedicalRecordAdmin)
