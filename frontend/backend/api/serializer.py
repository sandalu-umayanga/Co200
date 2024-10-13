from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Doctor, Patient, Report, Image
from django.contrib.auth import authenticate

# Serializer for User model (for registration and user-related tasks)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, valid_data):
        user = User.objects.create_user(**valid_data)
        return user

# Serializer for Doctor model
class DoctorSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True, max_length=None, use_url=True)

    class Meta:
        model = Doctor
        fields = ["id", "image", "name", "profession", "birth", "contact", "email", "speciality"]

    def validate(self, data):
        # Add custom validations if needed
        return data

# Serializer for Patient model
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"

    def validate(self, data):
        # Add custom validations if needed
        return data

# Serializer for Report model
class ReportSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Report
        fields = [
            'id',
            'indication',
            'BHT',
            'operators',
            'vascular_access',
            'catheters',
            'catheter_type',
            'description',
            'balloon_size',
            'balloon_pressure',
            'stent_name',
            'stent_pressure'
        ]
        extra_kwargs = {
            'patient': {'required': True},
            'date': {'required': True},
            'indication': {'required': True},
            'BHT': {'required': True},
            'operators': {'required': True},
            'vascular_access': {'required': True},
            'catheters': {'required': True}
        }

# Serializer for Image model
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'hospital_id', 'report_imgs']

# Serializer for account deletion
class DeleteAccountSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(write_only=True)

# Serializer for passing profession to Doctor views
class ProfessionSerializer(serializers.Serializer):
    profession = serializers.CharField(max_length=100)
