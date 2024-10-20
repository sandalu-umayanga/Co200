from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Doctors, Patients, Reports, Images
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password" : {"write_only" : True}}


    def create(self, valid_data):
        user = User.objects.create_user(**valid_data)
        return user


class DoctorSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True, max_length=None, use_url=True)

    class Meta:
        model = Doctors
        fields = ["id", "image", "name", "profecion", "birth", "contact", "email", "specility"]

    def validate(self, data):
        return data


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ['id', 'hos_id', 'report_imgs']

class PetientSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Patients
        fields = "__all__"  

    def validate(self, data):
        return data
        

class DeleteAccountSerializer(serializers.Serializer):
    user_name = serializers.CharField(max_length=100)
    password = serializers.CharField(write_only=True)


class PassProfSerializer(serializers.Serializer):
    profe = serializers.CharField(max_length=100)


class ReportsSerializer(serializers.ModelSerializer):

    discription = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Reports
        fields = [
            'id',                 
            'Indication',
            'BHT',
            'oparators',
            'Vascular_Access',
            'Catheters',
            'catheter_type',
            'discription',
            'baloon_size',
            'baloon_presure',
            'stent_name',
            'stent_pressure'
        ]
        extra_kwargs = {
            'person': {'required': True},
            'date': {'required': True},
            'Indication': {'required': True},
            'BHT': {'required': True},
            'oparators': {'required': True},
            'Vascular_Access': {'required': True},
            'Catheters': {'required': True}
        }
 

class ReportsCountSerializer(serializers.Serializer):
    date = serializers.DateField()
    procedure_count = serializers.IntegerField()

class AgeDistributionSerializer(serializers.Serializer):
    age_group = serializers.CharField()  
    patient_count = serializers.IntegerField()  

class CatheterTypeSerializer(serializers.Serializer):
    catheter_type = serializers.CharField()
    count = serializers.IntegerField()