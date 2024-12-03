from django.contrib import admin
from .models import UserInfo, Post

# 기존 사용자 모델 등록
@admin.register(UserInfo)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'password')

# 새 글 작성 모델 등록
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'timestamp', 'title')
