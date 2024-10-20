from django.contrib.auth.models import User
from .serializer import UserSerializer, DoctorSerializer, DeleteAccountSerializer, PassProfSerializer, PetientSerializer, ReportsSerializer, ImageSerializer, ReportsCountSerializer,AgeDistributionSerializer,CatheterTypeSerializer
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Doctors, Patients, Reports, Images
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import JSONParser
from datetime import date
from django.db.models import Count



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CurrentUserView(APIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            doctor = Doctors.objects.filter(username=request.user).first()
            isnurs = False
            isother = False
            if doctor is None:
                isdoc = False
            else:
                if doctor.profecion == "Doctor":
                    isdoc = True
                else:
                    isdoc = False
                    if doctor.profecion == "Nurse":
                        isnurs = True
                    elif doctor.profecion == "Other":
                        isother = True
            user = request.user
            serializer = UserSerializer(user)
            data = serializer.data
            data['is_superuser'] = user.is_superuser
            data['is_doctor'] = isdoc
            data['is_nurse'] = isnurs
            data['is_other'] = isother
            return Response(data)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DoctorListView(viewsets.ModelViewSet):
    queryset = Doctors.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        # Automatically assign the authenticated user to the username field
        serializer.save(username=self.request.user)

class PatientCreateView(viewsets.ModelViewSet):
    queryset = Patients.objects.all()
    serializer_class = PetientSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        serializer.save()
    
class CurruntProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DoctorSerializer

    def get(self, request):
        user = request.user
        try:
            doctor = Doctors.objects.get(username=user)
            if doctor is not None:
                serializer = self.serializer_class(doctor)
                data = serializer.data
                data["is_account"] = True
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({"is_account": False})
        except Doctors.DoesNotExist:
            return Response({"is_account": False})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serializer = DeleteAccountSerializer(data=request.data.get('data', {}))
        if serializer.is_valid():
            user_name = serializer.validated_data.get('user_name')
            password = serializer.validated_data.get('password')
            
            user = authenticate(username=user_name, password=password)
            if user is not None:
                try:
                    if (request.user == user):
                    # Find the doctor's record associated with the user
                        doctor = Doctors.objects.get(username=user)
                        doctor.delete()
                        return Response({"message": "1"}, status=status.HTTP_200_OK)
                    else:
                        return Response({"message" : "0"})
                except Doctors.DoesNotExist:
                    return Response({"error": "Doctor not found."}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class DoctorUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DoctorSerializer

    def get_object(self):
        return Doctors.objects.get(username=self.request.user)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)



class DoctorsByProfessionView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]  # Use JSONParser for handling JSON data

    def post(self, request):
        print("Request data:", request.data)  # Ensure this line is executed
        serializer = PassProfSerializer(data=request.data)
        if serializer.is_valid():
            profe = serializer.validated_data.get('profe')
            print("Profession:", profe)  # Ensure this line is executed
            doctors = Doctors.objects.filter(profecion__iexact=profe)
            if not doctors:
                return Response({"detail": "No doctors found with this profession."}, status=status.HTTP_404_NOT_FOUND)
            doctor_serializer = DoctorSerializer(doctors, many=True)
            return Response(doctor_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class SearchPatientView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        colum = request.GET.get('colum', '')  # Fixed typo here
        if query and colum:
            if colum == "national_id":
                results = Patients.objects.filter(national_id__startswith=query)
            elif colum == "hospital_id":
                results = Patients.objects.filter(hospital_id__startswith=query)
            elif colum == "get":
                results = Patients.objects.filter(hospital_id=query)
            else:
                results = Patients.objects.filter(name__icontains=query)
            if results is not None:
                serializer = PetientSerializer(results, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        return Response([]) 
    

class ReportCreateView(viewsets.ModelViewSet):
    serializer_class = ReportsSerializer
    queryset = Reports.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        hos_key = self.request.data.get("hospital_id")
        if not hos_key:
            return Response({"message" : "enter hospital_ID"})
        try:
            patient = Patients.objects.get(hospital_id=hos_key)
            serializer.save(person=patient, date=date.today())
        except Patients.DoesNotExist:
            return Response({"message" : "patient not found"})


class UploadImagesView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('report_img') 
        hos_id = request.data.get('hos_id')  

        file_paths = []
        for file in files:
            file_path = f'media/report_img/{file.name}' 
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            file_paths.append(file_path)
        image_data = {
            'hos_id': hos_id,
            'report_imgs': file_paths, 
        }
        if not Patients.objects.filter(hospital_id=hos_id).exists():
            return Response({"err" : "Hospital_ID do not exists"})
        serializer = ImageSerializer(data=image_data)
        if serializer.is_valid():
            serializer.save(date=date.today())
            return Response({"message": "Images uploaded successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class ImageByHosIDView(APIView):
    def post(self, request):
        hos_id = request.data.get('hos_id')
        stat1 = request.data.get("today")
        if stat1:
            if not hos_id:
                return Response({"error": "Hospital ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            date1 = date.today()
            images = Images.objects.filter(hos_id=hos_id, date=date1)
            if images.exists():
                serializer = ImageSerializer(images, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            if not hos_id:
                return Response({"error": "Hospital ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            images = Images.objects.filter(hos_id=hos_id)
            if images.exists():
                serializer = ImageSerializer(images, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "No images found for the given Hospital ID and date"}, status=status.HTTP_404_NOT_FOUND)
        

class ReportByPersonView(APIView):
    def post(self, request, *args, **kwargs):
        person_id = request.data.get('person_id')
        if not person_id:
            return Response({"error": "person_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        reports = Reports.objects.filter(person=person_id)
        if not reports:
            return Response({"error": "No reports found for this person."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReportsSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class GetReportsView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            reports = Reports.objects.values('date').annotate(procedure_count=Count('id')).order_by('date')
            print(reports)  
            serializer = ReportsCountSerializer(reports, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class AgeDistributionView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            patients = Patients.objects.all()
            current_year = date.today().year
            age_groups = {
                '0-5': 0,
                '5-10': 0,
                '10-15': 0,
                '15-20': 0,
                '20-25': 0,
                '25-30': 0,
                '30-35': 0,
                '35-40': 0,
                '40-45': 0,
                '45-50': 0,
                '50-55': 0,
                '55-60': 0,
                '60-65': 0,
                '65-70': 0,
                '70-75': 0,
                '75++': 0,
            }

            for patient in patients:
                patient_age = current_year - patient.birth.year

                if patient_age <= 5:
                    age_groups['0-5'] += 1
                elif 6 <= patient_age <= 10:
                    age_groups['5-10'] += 1
                elif 11 <= patient_age <= 15:
                    age_groups['10-15'] += 1
                elif 16 <= patient_age <= 20:
                    age_groups['15-20'] += 1
                elif 21 <= patient_age <= 25:
                    age_groups['20-25'] += 1
                elif 26 <= patient_age <= 30:
                    age_groups['25-30'] += 1
                elif 31 <= patient_age <= 35:
                    age_groups['30-35'] += 1
                elif 36 <= patient_age <= 40:
                    age_groups['35-40'] += 1
                elif 41 <= patient_age <= 45:
                    age_groups['40-45'] += 1
                elif 46 <= patient_age <= 50:
                    age_groups['45-50'] += 1
                elif 51 <= patient_age <= 55:
                    age_groups['50-55'] += 1
                elif 56 <= patient_age <= 60:
                    age_groups['55-60'] += 1
                elif 61 <= patient_age <= 65:
                    age_groups['60-65'] += 1
                elif 66 <= patient_age <= 70:
                    age_groups['65-70'] += 1
                elif 71 <= patient_age <= 75:
                    age_groups['70-75'] += 1
                else:
                    age_groups['75++'] += 1

            age_distribution = [
                {'age_group': group, 'patient_count': count} 
                for group, count in age_groups.items()
            ]
        
            serializer = AgeDistributionSerializer(age_distribution, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetCatheterTypeReportsView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            catheter_data = Reports.objects.values('catheter_type').annotate(count=Count('id')).order_by('catheter_type')
            print("pakaya")
            serializer = CatheterTypeSerializer(catheter_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)