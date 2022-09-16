from django.urls import path
from .views_manager import list, remove_todo, add_subtask, add_todo

urlpatterns = [
    path("list/", list),
    path("remove/", remove_todo),
    path("add_subtask/", add_subtask),
    path("add_todo/", add_todo)
]
