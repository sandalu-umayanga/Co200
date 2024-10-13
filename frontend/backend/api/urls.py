from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    CreateUserView, CurrentUserView, DoctorViewSet, PatientViewSet, ReportViewSet,
    CurrentDoctorProfileView, DeleteAccountView, DoctorsByProfessionView, SearchPatientView,
    UploadImagesView, ImageByHospitalIDView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# Define the router for ViewSets
router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'reports', ReportViewSet)

urlpatterns = [
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get-token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh-token'),
    path('api/user/now/', CurrentUserView.as_view(), name='now-user'),
    path('api/doctor/profile/', CurrentDoctorProfileView.as_view(), name='profile'),
    path('api/doctor/profile/update/', CurrentDoctorProfileView.as_view(), name='profile-update'),
    path('api/doctor/delete/', DeleteAccountView.as_view(), name='delete_doctor'),
    path('api/doctors/by-profession/', DoctorsByProfessionView.as_view(), name='doctors-by-profession'),
    path('api/patients/search/', SearchPatientView.as_view(), name='patient-search'),
    path('api/images/upload/', UploadImagesView.as_view(), name='image-upload'),
    path('api/images/by-hospital/', ImageByHospitalIDView.as_view(), name='image-by-hospital'),
    path('api/', include(router.urls)),  # Register all ViewSets via router
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
