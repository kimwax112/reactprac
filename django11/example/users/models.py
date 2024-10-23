from django.db import models

class User(models.Model):
    userCode = models.CharField(max_length=10, unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.username