from django.db import models
from django.contrib.auth.models import User


class Doctors(models.Model):
    image = models.ImageField(upload_to='profile_pics/', null=True, blank=True, default="profile_pics/user.jpg")
    name = models.CharField(max_length=150)
    profecion = models.CharField(max_length=100, default="other")
    birth = models.DateField()
    contact = models.CharField(max_length=12)
    email = models.EmailField()
    specility = models.CharField(null=True, blank=True, max_length=150)
    username = models.OneToOneField(User, on_delete=models.CASCADE, related_name="docs")

    def __str__(self):
        return self.name
    

class Patients(models.Model):
    national_id = models.CharField(max_length=20, unique=True)
    hospital_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    birth = models.DateField()
    address = models.CharField(max_length=150)
    contact = models.CharField(max_length=15)
    email = models.EmailField(null=True)

    def __str__(self):
        return f"{self.hospital_id}-{self.name}"


class Reports(models.Model):
    person = models.ForeignKey(Patients, on_delete=models.CASCADE, related_name="reports")
    date = models.DateField()
    Indication = models.CharField(max_length=150)
    BHT = models.CharField(max_length=150)
    oparators = models.CharField(max_length=200)
    Vascular_Access = models.CharField(max_length=250)
    Catheters = models.CharField(max_length=150)
    catheter_type = models.CharField(max_length=300, null=True)
    discription = models.TextField(null=True)
    baloon_size = models.CharField(max_length=150,null=True)
    baloon_presure = models.CharField(max_length=150, null=True)
    stent_name = models.CharField(max_length=150,null=True)
    stent_pressure = models.CharField(max_length=150,null=True)

    def __str__(self):
        return self.person.name
    

class Images(models.Model):
    hos_id = models.CharField(max_length=10)
    date = models.DateField(null=True)
    report_imgs = models.JSONField() 

    def __str__(self):
        return self.hos_id
