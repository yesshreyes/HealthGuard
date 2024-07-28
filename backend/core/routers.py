from core.views import  PredictSuitabilityView
from core.viewsets import LoginAPIView, LogoutViewSet, MedicalRecordViewSet, RefreshViewSet, RegisterViewSet, \
    UserViewSet, CustomUserViewSet
from rest_framework.routers import SimpleRouter
from django.urls import path
routes = SimpleRouter()

routes.register(r'user-auth/register', RegisterViewSet, basename='user-auth-register')
routes.register(r'user-auth/logout', LogoutViewSet, basename='user-auth-logout')
routes.register(r'user-auth/refresh', RefreshViewSet, basename='user-auth-refresh')

####features

routes.register(r'users', CustomUserViewSet,basename='user-profile')
routes.register(r'medical-records', MedicalRecordViewSet,basename='user-medical-record')
urlpatterns = [
    *routes.urls,
    path('login/', LoginAPIView.as_view(), name='login_api'),
    path('predict/', PredictSuitabilityView.as_view(), name='predict_suitability'),
    # path('users/me/', CustomUserViewSet.as_view({
    #     'get': 'retrieve',
    #     'put': 'update',
    #     'patch': 'partial_update'
    # })),
]