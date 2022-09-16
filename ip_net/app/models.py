from statistics import mode
from django.db import models

# Create your models here.

class User(models.Model):
    email = models.CharField(max_length=32, primary_key=True, null=False)
    password = models.CharField(max_length=32, null=False)

    def __repr__(self) -> str:
        return self.email

class TODO(models.Model):
    todo_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    text = models.CharField(max_length=1024)
    color = models.CharField(max_length=7)

class Subtask(models.Model):
    subtask_id = models.AutoField(primary_key=True)
    parent = models.ForeignKey(TODO, on_delete=models.CASCADE)
    text = models.CharField(max_length=256)