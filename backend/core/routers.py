from core.views import  PredictSuitabilityView
from core.viewsets import LoginAPIView, LogoutViewSet, MedicalRecordViewSet, RefreshViewSet, RegisterViewSet, UserViewSet
from rest_framework.routers import SimpleRouter
from django.urls import path
routes = SimpleRouter()

routes.register(r'user-auth/register', RegisterViewSet, basename='user-auth-register')
routes.register(r'user-auth/logout', LogoutViewSet, basename='user-auth-logout')
routes.register(r'user-auth/refresh', RefreshViewSet, basename='user-auth-refresh')

####features

routes.register(r'users', UserViewSet)
routes.register(r'medical-records', MedicalRecordViewSet)
urlpatterns = [
    *routes.urls,
    path('login/', LoginAPIView.as_view(), name='login_api'),
    path('predict/', PredictSuitabilityView.as_view(), name='predict_suitability'),
]