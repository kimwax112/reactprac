from django.apps import AppConfig
from django.db import connection


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'
    def ready(self):
        # 앱이 시작될 때마다 외래 키 제약 활성화
        with connection.cursor() as cursor:
            cursor.execute("PRAGMA foreign_keys = ON;")