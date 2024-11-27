# tests/test_views.py
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Doctors, Patients, Reports, Images
from datetime import date

class ViewTests(TestCase):
    def setUp(self):
        # Set up the test client and create test data
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        self.doctor = Doctors.objects.create(username=self.user, name='Dr. Test', profecion='Cardiology', birth='1980-01-01', contact='1234567890', email='doctor@test.com')
        self.patient = Patients.objects.create(name='John Doe', national_id='123456789', hospital_id='H123', birth='1990-01-01', address='123 Street', contact='9876543210', email='patient@test.com')
        self.report = Reports.objects.create(person=self.patient, date=date.today(), Indication='Test Indication', BHT='Test BHT', oparators='Test Operator', Vascular_Access='Test Access', Catheters='Test Catheter')
        self.image = Images.objects.create(hos_id='H123', date=date.today(), report_imgs=['test_image.jpg'])

    def test_current_user_view(self):
        # Test the current user view
        response = self.client.get('/api/user/now/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_doctor_list_view(self):
        # Test the doctor list view
        response = self.client.get('/api/doctors/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_patient_create_view(self):
        # Test the patient create view
        response = self.client.post('/api/patients/', {'name': 'Jane Doe', 'national_id': '987654321', 'hospital_id': 'H456', 'birth': '1995-01-01', 'address': '456 Street', 'contact': '1234567890', 'email': 'jane@test.com'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_currunt_profile_view(self):
        # Test the current profile view
        response = self.client.get('/api/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Dr. Test')

    def test_doctor_update_view(self):
        # Test the doctor update view
        response = self.client.patch('/api/profile/update/', {'profecion': 'Neurology'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_doctors_by_profession_view(self):
        # Test the doctors by profession view
        response = self.client.post('/api/doctor_list/', {'profe': 'Cardiology'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_search_patient_view(self):
        # Test the search patient view
        response = self.client.get('/api/patient/search/', {'query': 'John', 'colum': 'name'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_report_create_view(self):
        # Test the report create view
        response = self.client.post('/api/report/', {'hospital_id': 'H123', 'Indication': 'Test Indication', 'BHT': 'Test BHT', 'oparators': 'Test Operator', 'Vascular_Access': 'Test Access', 'Catheters': 'Test Catheter'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_upload_images_view(self):
        # Test the upload images view
        with open('D:/semester4/Co200/new/New Folder/Co200/backend/media/profile_pics/1.PNG', 'rb') as img:
            response = self.client.post('/api/upload-images/', {'report_img': img, 'hos_id': 'H123'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_image_by_hos_id_view(self):
        # Test the image by hospital ID view
        response = self.client.post('/api/images/', {'hos_id': 'H123'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_report_by_person_view(self):
        # Test the report by person view
        response = self.client.post('/api/oldreports/', {'person_id': self.patient.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_reports_view(self):
        # Test the get reports view
        response = self.client.get('/api/reports/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)