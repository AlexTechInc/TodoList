from hashlib import md5
from django.shortcuts import redirect
from django.http import HttpResponse, JsonResponse
import re
from app.models import User, TODO, Subtask


re_email = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
re_pass = re.compile(r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')

is_email_valid = lambda email: True if re.fullmatch(re_email, email) else False
is_pass_valid = lambda passw: True if  re.fullmatch(re_pass, passw) else False


def login(request):
    if "login" not in request.session:
        if request.method == "POST": 
            post = request.POST

            if all(key in post for key in ("login", "password")):
                login = post["login"]
                password = post["password"]

                if (User.objects.filter(email=login, password=md5(password.encode()).hexdigest())):
                    request.session["login"] = login

                    return JsonResponse({"status": True})
                else:
                    return JsonResponse({"status": False, "message": "Wrong login or password"})
            else:
                return JsonResponse({"status": False, "message": "Wrong request parameters"})

        return JsonResponse({"status": False, "message": "Unable to process request"})
    else:
        return redirect("/");


def register(request):
    if "login" not in request.session:
        if request.method == "POST": 
            post = request.POST

            if all(key in post for key in ("login", "password", "password_repeat")):
                login = post["login"]
                password = post["password"]
                password_repeat = post["password_repeat"]

                if all((login, password, password_repeat)):
                    if not is_email_valid(login):
                        return JsonResponse({"status": False, "message": "E-mail must have format 'example@example.com'"})

                    if not is_pass_valid(password):
                        return JsonResponse({"status": False, "message": "Password must consist of at least one upper-case letter, one lower-case letter, one number and has length greater than 8'"})
                    
                    if (password != password_repeat):
                        return JsonResponse({"status": False, "message": "Passwords doesn't match"})

                    if User.objects.filter(email=login):
                        return JsonResponse({"status": False, "message": f"User with email '{login}' is already registered"})

                    user = User(email=login, password=md5(password.encode()).hexdigest())
                    user.save()

                    todo = TODO(owner=user, text="Hello, to your todo list, " + login + "!")
                    todo.save()

                    Subtask(parent=todo, text="You can add TODO in entry above =)").save()
                    Subtask(parent=todo, text="You can remove TODO by pressing X-key on the right top").save()
                    Subtask(parent=todo, text="You can add subtask to your TODO pressing +-key on the right top").save()

                    return JsonResponse({"status": True})
                else:
                    return JsonResponse({"status": False, "message": "Values cannot be empty"})

            else:
                return JsonResponse({"status": False, "message": "Wrong request parameters"})

        return JsonResponse({"status": False, "message": "Unable to process request"})
    else:
        return redirect("/");

def logout(request):
    if request.method == "POST":
        if "login" in request.session:
            request.session.clear()

            print(dir(request.session))

            return JsonResponse({"status": True})

    return redirect("/login")