from django.db import models
from django.contrib.auth.models import User

# Doctor model to store doctor details
class Doctor(models.Model):
    image = models.ImageField(upload_to='profile_pics/', null=True, blank=True, default="profile_pics/user.jpg")
    name = models.CharField(max_length=150)
    profession = models.CharField(max_length=100, default="other")  # Fixed spelling from 'profecion'
    birth = models.DateField()
    contact = models.CharField(max_length=12)
    email = models.EmailField()
    speciality = models.CharField(null=True, blank=True, max_length=150)  # Fixed spelling from 'specility'
    username = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctor")

    def __str__(self):
        return self.name

# Patient model to store patient details
class Patient(models.Model):
    national_id = models.CharField(max_length=20)
    hospital_id = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    birth = models.DateField()
    address = models.CharField(max_length=150)
    contact = models.CharField(max_length=15)
    email = models.EmailField(null=True)

    def __str__(self):
        return f"{self.hospital_id} - {self.name}"

# Report model to store medical reports
class Report(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="reports")
    date = models.DateField()
    indication = models.CharField(max_length=150)  # Renamed from 'Indication' for consistency
    BHT = models.CharField(max_length=150)
    operators = models.CharField(max_length=200)
    vascular_access = models.CharField(max_length=250)
    catheters = models.CharField(max_length=150)
    catheter_type = models.CharField(max_length=300, null=True)
    description = models.TextField(null=True)
    balloon_size = models.CharField(max_length=150, null=True)
    balloon_pressure = models.CharField(max_length=150, null=True)
    stent_name = models.CharField(max_length=150, null=True)
    stent_pressure = models.CharField(max_length=150, null=True)

    def __str__(self):
        return self.patient.name

# Image model to store patient images for reports
class Image(models.Model):
    hospital_id = models.CharField(max_length=10)
    date = models.DateField(null=True)
    report_imgs = models.JSONField()

    def __str__(self):
        return self.hospital_id
