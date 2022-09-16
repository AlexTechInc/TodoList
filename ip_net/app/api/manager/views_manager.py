from django.http import JsonResponse
from django.shortcuts import redirect
from app.models import TODO, User, Subtask
from string import digits, hexdigits

hexdigits = digits + hexdigits

def index():
    pass

def remove_todo(request):
    if request.method == "POST" and "login" in request.session:
        post = request.POST

        if "todo_id" in post:
            object = TODO.objects.filter(todo_id=post["todo_id"])

            if (object): 
                object.delete()

                return JsonResponse({"status": True})
            else:
                return JsonResponse({"status": False, "message": "Object doesn't exist"})
        else:
            return JsonResponse({"status": False, "message": "Wrong keys in POST query"})
         
    else:
        return JsonResponse({"status": False, "message": "Unauthorized"})

def add_todo(request):
    if request.method == "POST" and "login" in request.session:
        post = request.POST

        if all(key in post for key in ("color", "text")):
            text = post["text"]
            color = post["color"]
            owner = User.objects.filter(email=request.session["login"]).first()

            if (not text):
                return JsonResponse({"status": False, "message": "Value cannot be empty"})

            if (not owner):
                return JsonResponse({"status": False, "message": "User doesn't exist"})

            if len(color) == 7:
                if color.startswith("#"):
                    if all(digit in hexdigits for digit in color[1: ]):
                        new = TODO(owner=owner, text=text, color=color)
                        new.save()

                        return JsonResponse({"status": True, "todo_id": new.todo_id})
            else:
                return JsonResponse({"status": False, "message": "Invalid color value"})
        else:
            return JsonResponse({"status": False, "message": "Wrong keys in POST query"})
         
    else:
        return JsonResponse({"status": False, "message": "Unauthorized"})

def add_subtask(request):
    if request.method == "POST" and "login" in request.session:
        post = request.POST

        if all(key in post for key in ("todo_id", "text")):
            todo_id = post["todo_id"]
            text = post["text"]

            if (not text):
                 return JsonResponse({"status": False, "message": "Value cannot be empty"})

            parent = TODO.objects.filter(todo_id=todo_id).first()

            if (parent):
                subtask = Subtask(parent=parent, text=text)
                subtask.save()

                print(subtask.subtask_id)

                return JsonResponse({"status": True, "subtask_id": subtask.subtask_id})
            else:
                return JsonResponse({"status": False, "message": "Parent doesn't exist"})
        else:
            return JsonResponse({"status": False, "message": "Wrong keys in POST query"})
    else:
        return JsonResponse({"status": False, "message": "Unauthorized"})


def list(request):
    if "login" in request.session and request.method == "POST":
        response = {"status": True, "list": []}
        
        for todo in reversed(TODO.objects.filter(owner=User(email=request.session["login"]))):
            todo_dict = {
                "todo_id": todo.todo_id,
                "text": todo.text,
                "color": todo.color,
                "sub": []
            }

            for sub in Subtask.objects.filter(parent=todo):
                sub_dict = {
                    "subtask_id": sub.subtask_id,
                    "text": sub.text
                }

                todo_dict["sub"].append(sub_dict)


            response["list"].append(todo_dict)

        return JsonResponse(response)

    else:
        return redirect("/login")