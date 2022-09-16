from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import User
 
def login(request):
    if "login" not in request.session:
        return render(request, "app/auth/login.html")
    else:
        return redirect("/")
 
def register(request):
    if "login" not in request.session:
        return render(request, "app/auth/register.html")
    else:
        return redirect("/")

def index(request):
    if "login" not in request.session:
        return redirect("login/")
    else:
        return render(request, "app/cabinet/index.html", context={"username": request.session["login"]})
