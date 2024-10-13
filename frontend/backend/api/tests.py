from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Doctor, Patient, Report, Image
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date, timedelta
from rest_framework.exceptions import ValidationError


class UserTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_register_user(self):
        """ Test registration of a user """
        response = self.client.post(reverse('register'), {
            'username': 'newuser',
            'password': 'newpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_with_existing_username(self):
        """ Test registration with an existing username """
        response = self.client.post(reverse('register'), {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_missing_fields(self):
        """ Test registration with missing fields """
        response = self.client.post(reverse('register'), {
            'username': 'user'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        """ Test user login """
        response = self.client.post(reverse('get-token'), {
            'username': 'testuser',
            'password': 'testpass'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_login(self):
        """ Test login with invalid credentials """
        response = self.client.post(reverse('get-token'), {
            'username': 'wronguser',
            'password': 'wrongpass'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_protected_route_without_token(self):
        """ Test access to a protected route without authentication """
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_protected_route_with_token(self):
        """ Test access to a protected route with valid authentication """
        token_response = self.client.post(reverse('get-token'), {
            'username': 'testuser',
            'password': 'testpass'
        })
        token = token_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_access_protected_route_with_invalid_token(self):
        """ Test access to a protected route with invalid token """
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token(self):
        """ Test token refresh """
        token_response = self.client.post(reverse('get-token'), {
            'username': 'testuser',
            'password': 'testpass'
        })
        refresh_token = token_response.data['refresh']
        response = self.client.post(reverse('refresh'), {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_refresh_token_invalid(self):
        """ Test token refresh with invalid token """
        response = self.client.post(reverse('refresh'), {'refresh': 'invalid_refresh_token'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

     # JWT Token Tests
    def test_access_with_expired_token(self):
        """ Test accessing protected routes with an expired token """
        token = RefreshToken.for_user(self.user)
        # Simulate token expiry by modifying its expiry time
        token.set_exp(lifetime=timedelta(seconds=-10))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(token.access_token)}')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_with_invalid_token(self):
        """ Test accessing protected routes with an invalid token """
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_with_missing_token(self):
        """ Test accessing protected routes without providing a token """
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class DoctorTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='doctoruser', password='doctpass')
        self.doctor = Doctor.objects.create(
            username=self.user,
            name="Test Doctor",
            profession="Cardiology",
            birth="1980-01-01",
            contact="1234567890",
            email="testdoctor@example.com",
            speciality="Cardiologist"
        )
        self.other_doctor = Doctor.objects.create(
            username=self.other_user,
            name="Other Doctor",
            profession="Orthopedics",
            birth="1970-01-01",
            contact="9876543210",
            email="otherdoctor@example.com",
            speciality="Orthopedic"
        )
        self.client.force_authenticate(user=self.user)

    def test_get_doctor_list(self):
        """ Test fetching the list of doctors by profession """
        response = self.client.post(reverse('doctors-by-profession'), {'profe': 'Cardiology'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_doctor_list_with_invalid_profession(self):
        """ Test fetching doctors with a profession that does not exist """
        response = self.client.post(reverse('doctors-by-profession'), {'profe': 'UnknownProfession'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_doctor_profile(self):
        """ Test fetching the current doctor's profile """
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Doctor')

    def test_update_doctor_profile(self):
        """ Test updating the doctor's profile """
        response = self.client.patch(reverse('profile-update'), {
            'name': 'Updated Doctor',
            'speciality': 'General Physician'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Doctor')

    def test_update_doctor_profile_with_invalid_data(self):
        """ Test updating the doctor's profile with invalid data """
        response = self.client.patch(reverse('profile-update'), {
            'email': 'invalid_email'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_doctor_account(self):
        """ Test deleting a doctor account """
        response = self.client.post(reverse('delete_doctor'), {
            'user_name': 'doctoruser',
            'password': 'doctpass'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_doctor_account_with_invalid_credentials(self):
        """ Test deleting a doctor account with invalid credentials """
        response = self.client.post(reverse('delete_doctor'), {
            'user_name': 'doctoruser',
            'password': 'wrongpass'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    # Multi-user Access Control
    def test_doctor_cannot_access_another_doctor_profile(self):
        """ Test that a doctor cannot access another doctor's profile """
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(reverse('profile'))
        self.assertNotEqual(response.data['name'], self.doctor.name)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_doctor_cannot_update_another_doctor_profile(self):
        """ Test that a doctor cannot update another doctor's profile """
        response = self.client.patch(reverse('profile-update'), {
            'name': 'Hacked Name'
        })
        self.assertEqual(response.data['name'], 'Test Doctor')  # Unchanged

    # Boundary Testing
    def test_create_doctor_with_long_name(self):
        """ Test that doctor creation fails with a name longer than 150 characters """
        long_name = 'D' * 151
        response = self.client.patch(reverse('profile-update'), {
            'name': long_name
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_doctor_with_invalid_contact_length(self):
        """ Test doctor creation fails with invalid contact length """
        response = self.client.patch(reverse('profile-update'), {
            'contact': '1234567890123'  # More than 12 characters
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PatientTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='nurseuser', password='nursepass')
        self.patient = Patient.objects.create(
            national_id="PID001",
            hospital_id="HID123",
            name="John Doe",
            birth="1990-01-01",
            address="123 Test St",
            contact="5555555555",
            email="johndoe@example.com"
        )
        self.other_user = User.objects.create_user(username='otheruser', password='otherpass')
        self.other_patient = Patient.objects.create(
            national_id="PID002",
            hospital_id="HID124",
            name="Jane Doe",
            birth="1985-01-01",
            address="456 Test St",
            contact="5555555556",
            email="janedoe@example.com"
        )
        self.client.force_authenticate(user=self.user)

    def test_create_patient(self):
        """ Test creating a new patient """
        response = self.client.post(reverse('patients'), {
            'national_id': 'PID002',
            'hospital_id': 'HID124',
            'name': 'Jane Doe',
            'birth': '1985-12-12',
            'address': '456 Test St',
            'contact': '5555555556',
            'email': 'janedoe@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_patient_with_missing_fields(self):
        """ Test creating a patient with missing required fields """
        response = self.client.post(reverse('patients'), {
            'name': 'Jane Doe'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_patient_with_invalid_email(self):
        """ Test creating a patient with invalid email """
        response = self.client.post(reverse('patients'), {
            'national_id': 'PID003',
            'hospital_id': 'HID125',
            'name': 'John Smith',
            'birth': '1990-05-05',
            'address': '789 Test St',
            'contact': '5555555557',
            'email': 'invalidemail'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_search_patient_by_national_id(self):
        """ Test searching a patient by national ID """
        response = self.client.get(reverse('patient-search'), {'query': 'PID001', 'colum': 'national_id'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_patient_by_hospital_id(self):
        """ Test searching a patient by hospital ID """
        response = self.client.get(reverse('patient-search'), {'query': 'HID123', 'colum': 'hospital_id'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_patient_by_invalid_national_id(self):
        """ Test searching a patient by invalid national ID """
        response = self.client.get(reverse('patient-search'), {'query': 'INVALID_ID', 'colum': 'national_id'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_patient_without_query(self):
        """ Test searching a patient without providing a query """
        response = self.client.get(reverse('patient-search'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
     # Boundary Testing
    def test_create_patient_with_long_name(self):
        """ Test patient creation with a name longer than 100 characters """
        long_name = 'P' * 101
        response = self.client.post(reverse('patients'), {
            'national_id': 'PID003',
            'hospital_id': 'HID125',
            'name': long_name,
            'birth': '1990-05-05',
            'address': '789 Test St',
            'contact': '5555555557',
            'email': 'janesmith@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_patient_with_invalid_contact_length(self):
        """ Test patient creation fails with invalid contact length """
        response = self.client.post(reverse('patients'), {
            'national_id': 'PID003',
            'hospital_id': 'HID125',
            'name': 'Valid Name',
            'birth': '1990-05-05',
            'address': '789 Test St',
            'contact': '1234567890123',  # Invalid length
            'email': 'janesmith@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Multi-user Access Control
    def test_user_cannot_access_another_user_patient(self):
        """ Test that a user cannot access another user's patient details """
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(reverse('patients') + f'{self.patient.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)  # Should not be accessible



class ReportTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='reportuser', password='reportpass')
        self.patient = Patient.objects.create(
            national_id="PID003",
            hospital_id="HID125",
            name="Alice Test",
            birth="1995-01-01",
            address="789 Test St",
            contact="5555555557",
            email="alicetest@example.com"
        )
        self.report = Report.objects.create(
            patient=self.patient,
            date=date.today(),
            indication="Test Indication",
            BHT="BHT123",
            operators="Operator1",
            vascular_access="Vascular Access 1",
            catheters="Catheter 1",
            catheter_type="Type 1",
            description="Description of procedure",
            balloon_size="Balloon size",
            balloon_pressure="Pressure value",
            stent_name="Stent name",
            stent_pressure="Stent pressure"
        )
        self.client.force_authenticate(user=self.user)

    def test_create_report(self):
        """ Test creating a report """
        response = self.client.post(reverse('report'), {
            'hospital_id': 'HID125',
            'indication': 'New Test Indication',
            'BHT': 'BHT124',
            'operators': 'Operator2',
            'vascular_access': 'Vascular Access 2',
            'catheters': 'Catheter 2',
            'catheter_type': 'Type 2',
            'description': 'New description of procedure',
            'balloon_size': 'New Balloon size',
            'balloon_pressure': 'New Pressure value',
            'stent_name': 'New Stent name',
            'stent_pressure': 'New Stent pressure'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_report_with_invalid_data(self):
        """ Test creating a report with missing required fields """
        response = self.client.post(reverse('report'), {
            'hospital_id': 'HID125',
            'indication': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_report(self):
        """ Test fetching a report for a patient """
        response = self.client.get(reverse('report', args=[self.report.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_report_invalid_id(self):
        """ Test fetching a report with invalid ID """
        response = self.client.get(reverse('report', args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_report(self):
        """ Test updating an existing report """
        response = self.client.patch(reverse('report', args=[self.report.id]), {
            'indication': 'Updated Indication'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_report_with_invalid_data(self):
        """ Test updating a report with invalid data """
        response = self.client.patch(reverse('report', args=[self.report.id]), {
            'BHT': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_report(self):
        """ Test deleting a report """
        response = self.client.delete(reverse('report', args=[self.report.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_report_invalid_id(self):
        """ Test deleting a report with invalid ID """
        response = self.client.delete(reverse('report', args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    # Boundary Testing
    def test_create_report_with_large_description(self):
        """ Test creating a report with an extremely large description """
        large_description = 'D' * 5001  # Beyond any reasonable size
        response = self.client.post(reverse('report'), {
            'hospital_id': self.patient.hospital_id,
            'indication': 'New Indication',
            'BHT': 'BHT124',
            'operators': 'Operator2',
            'vascular_access': 'Vascular Access 2',
            'catheters': 'Catheter 2',
            'description': large_description
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_report_with_missing_required_fields(self):
        """ Test creating a report with missing required fields """
        response = self.client.post(reverse('report'), {
            'hospital_id': self.patient.hospital_id,
            'BHT': 'BHT124'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Multi-user Access Control
    def test_user_cannot_access_another_user_report(self):
        """ Test that one user cannot access another user's reports """
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(reverse('report', args=[self.report.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)




class ImageTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.patient = Patient.objects.create(
            national_id="PID004",
            hospital_id="HID126",
            name="Bob Test",
            birth="1980-10-10",
            address="111 Test Ave",
            contact="5555555558",
            email="bobtest@example.com"
        )
        self.image = Image.objects.create(
            hospital_id="HID126",
            date=date.today(),
            report_imgs=["/media/report_img/sample1.jpg"]
        )

    def test_upload_image(self):
        """ Test uploading images """
        with open("sample.jpg", "rb") as img:
            response = self.client.post(reverse('image-upload'), {
                'hos_id': 'HID126',
                'report_img': img
            })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_upload_image_with_invalid_hospital_id(self):
        """ Test uploading images with invalid hospital ID """
        with open("sample.jpg", "rb") as img:
            response = self.client.post(reverse('image-upload'), {
                'hos_id': 'INVALID_ID',
                'report_img': img
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_image_with_missing_file(self):
        """ Test uploading images without a file """
        response = self.client.post(reverse('image-upload'), {
            'hos_id': 'HID126'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_images_by_hospital_id(self):
        """ Test fetching images by hospital ID and date """
        response = self.client.post(reverse('pak'), {'hos_id': 'HID126'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_images_with_invalid_hospital_id(self):
        """ Test fetching images with invalid hospital ID """
        response = self.client.post(reverse('pak'), {'hos_id': 'INVALID_ID'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    # Multi-user Access Control
    def test_user_cannot_access_another_user_images(self):
        """ Test that one user cannot access another user's images """
        response = self.client.post(reverse('pak'), {'hos_id': 'HID126'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Boundary Testing
    def test_upload_image_with_invalid_extension(self):
        """ Test uploading an image with an invalid file extension """
        with open("sample.txt", "rb") as img:
            response = self.client.post(reverse('image-upload'), {
                'hos_id': 'HID126',
                'report_img': img
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_image_with_large_file(self):
        """ Test uploading an excessively large image file """
        with open("large_image.jpg", "rb") as img:  # Assuming it's too large
            response = self.client.post(reverse('image-upload'), {
                'hos_id': 'HID126',
                'report_img': img
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)