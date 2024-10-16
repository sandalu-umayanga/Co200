# Generated by Django 5.1.2 on 2024-10-12 06:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_merge_20241012_1225'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Doctors',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, default='profile_pics/user.jpg', null=True, upload_to='profile_pics/')),
                ('name', models.CharField(max_length=150)),
                ('profecion', models.CharField(default='other', max_length=100)),
                ('birth', models.DateField()),
                ('contact', models.CharField(max_length=12)),
                ('email', models.EmailField(max_length=254)),
                ('specility', models.CharField(blank=True, max_length=150, null=True)),
                ('username', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='docs', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='doctor',
            name='username',
        ),
        migrations.DeleteModel(
            name='Image',
        ),
        migrations.RemoveField(
            model_name='report',
            name='patient',
        ),
        migrations.DeleteModel(
            name='Doctor',
        ),
        migrations.DeleteModel(
            name='Patient',
        ),
        migrations.DeleteModel(
            name='Report',
        ),
    ]
