from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin URL 패턴 추가
    path('api/', include('users.urls')),  # API URL 패턴
    # ... 기타 URL 패턴 ...
]