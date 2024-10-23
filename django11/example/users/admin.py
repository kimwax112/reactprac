from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('userCode', 'username', 'password')  # 테이블에서 볼 필드