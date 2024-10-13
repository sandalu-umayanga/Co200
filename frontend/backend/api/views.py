from django.contrib.auth.models import User
from .serializer import (
    UserSerializer, DoctorSerializer, DeleteAccountSerializer, ProfessionSerializer, PatientSerializer, ReportSerializer, ImageSerializer
)
from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Doctor, Patient, Report, Image
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate
from datetime import date


# User registration view
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# Fetch current logged-in user's details
class CurrentUserView(APIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        data = serializer.data
        data['is_superuser'] = user.is_superuser
        return Response(data, status=status.HTTP_200_OK)


# Doctor ViewSet for listing, creating, updating, and deleting doctors
class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        # Automatically assign the authenticated user to the doctor record
        serializer.save(username=self.request.user)


# Patient ViewSet for managing patients
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


# Fetch and update the current doctor's profile
class CurrentDoctorProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DoctorSerializer

    def get(self, request):
        try:
            doctor = Doctor.objects.get(username=request.user)
            serializer = DoctorSerializer(doctor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        doctor = get_object_or_404(Doctor, username=request.user)
        serializer = DoctorSerializer(doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View to delete the doctor's account
class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeleteAccountSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user and user == request.user:
                try:
                    doctor = Doctor.objects.get(username=user)
                    doctor.delete()
                    user.delete()
                    return Response({"message": "Doctor and account deleted successfully"}, status=status.HTTP_200_OK)
                except Doctor.DoesNotExist:
                    return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Search for doctors by profession
class DoctorsByProfessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProfessionSerializer(data=request.data)
        if serializer.is_valid():
            profession = serializer.validated_data['profession']
            doctors = Doctor.objects.filter(profession__iexact=profession)
            if doctors.exists():
                doctor_serializer = DoctorSerializer(doctors, many=True)
                return Response(doctor_serializer.data, status=status.HTTP_200_OK)
            return Response({"detail": "No doctors found with this profession."}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Search for patients
class SearchPatientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get('query', '')
        column = request.GET.get('colum', '')
        if query and column:
            if column == "national_id":
                results = Patient.objects.filter(national_id__startswith=query)
            elif column == "hospital_id":
                results = Patient.objects.filter(hospital_id__startswith=query)
            else:
                results = Patient.objects.filter(name__icontains=query)
            if results:
                serializer = PatientSerializer(results, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_404_NOT_FOUND)


# Report ViewSet for creating and retrieving reports
class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        hospital_id = self.request.data.get('hospital_id')
        try:
            patient = Patient.objects.get(hospital_id=hospital_id)
            serializer.save(patient=patient, date=date.today())
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)


# Upload patient images
class UploadImagesView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        files = request.FILES.getlist('report_img')
        hospital_id = request.data.get('hos_id')
        if not hospital_id:
            return Response({"error": "Hospital ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not files:
            return Response({"error": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Upload and save files
        file_paths = []
        for file in files:
            file_path = f'media/report_img/{file.name}'
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            file_paths.append(file_path)

        if not Patient.objects.filter(hospital_id=hospital_id).exists():
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

        image_data = {
            'hospital_id': hospital_id,
            'report_imgs': file_paths
        }
        serializer = ImageSerializer(data=image_data)
        if serializer.is_valid():
            serializer.save(date=date.today())
            return Response({"message": "Images uploaded successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get images by hospital ID and date
class ImageByHospitalIDView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        hospital_id = request.data.get('hos_id')
        date1 = date.today()
        images = Image.objects.filter(hospital_id=hospital_id, date=date1)
        if images.exists():
            serializer = ImageSerializer(images, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "No images found for the given hospital ID and date"}, status=status.HTTP_404_NOT_FOUND)
