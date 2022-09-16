from django.urls import path, include

urlpatterns = [
    path("auth/", include("app.api.auth.urls_auth")),
    path("manager/", include("app.api.manager.urls_manager"))
]