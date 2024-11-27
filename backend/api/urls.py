from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Define and register a router for viewsets
router = DefaultRouter()
router.register(r'doctors', views.DoctorListView)  
router.register(r'patients', views.PatientCreateView) 
router.register(r'report', views.ReportCreateView)

urlpatterns = [
    path("user/now/", views.CurrentUserView.as_view(), name="now-user"),
    path('delete-doctor/', views.DeleteAccountView.as_view(), name='delete_doctor'),
    path("profile/", views.CurruntProfileView.as_view(), name="profile"),
    path("profile/update/", views.DoctorUpdateView.as_view(), name="profile-update"),
    path("doctor_list/", views.DoctorsByProfessionView.as_view(), name='doctors-by-profession'),
    path("patient/search/", views.SearchPatientView.as_view(), name="patient-search"),
    path("upload-images/", views.UploadImagesView.as_view(), name="image-upload"),
    path("images/", views.ImageByHosIDView.as_view() , name="pak"),
    path("oldreports/", views.ReportByPersonView.as_view(), name="old-reports"),
    path('reports/', views.GetReportsView.as_view(), name='get-reports'),
    path('AgeDistribution/reports/', views.AgeDistributionView.as_view(), name='get-age-reports'),
    path('CatheterType/reports/', views.GetCatheterTypeReportsView.as_view(), name='catheter-type-reports'),
    path("imageProcess/", views.Create_images.as_view(), name="aa"),
] + router.urls  # Include the router URLs automatically

