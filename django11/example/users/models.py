from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now

# 기존 사용자 모델 유지
class UserInfo(AbstractUser):
    id = models.AutoField(primary_key=True)  # 기본키로 사용할 AutoField 추가
    username = models.CharField(max_length=100, unique=True)  # 사용자명 (UNIQUE)
    password = models.CharField(max_length=100)  # 비밀번호

    def __str__(self):
        return self.username

# 새 글 작성 모델 추가
class Post(models.Model):
    id = models.CharField(max_length=10, primary_key=True, editable=False)  # 글 번호
    author = models.ForeignKey(UserInfo, on_delete=models.CASCADE, to_field='username')  # 'username'을 참조하도록 설정
    timestamp = models.DateTimeField(auto_now_add=True)  # 작성 시간
    updated_at = models.DateTimeField(auto_now=True)     # 수정 시간
    title = models.CharField(max_length=200)  # 글 제목
    content = models.TextField()  # 글 내용
    def save(self, *args, **kwargs):
        if not self.id:
            # 마지막 번호를 가져와서 증가시키기
            last_post = Post.objects.all().order_by("id").last()
            if last_post:
                last_id = int(last_post.id[1:])  # 'T01'에서 숫자 부분 추출
                new_id = f"T{last_id + 1:02d}"  # 'T02', 'T03' 등 포맷 유지
            else:
                new_id = "T01"  # 첫 번째 글
            self.id = new_id
        super().save(*args, **kwargs)
    # 글 번호 자동 생성 (T01, T02, ...)
   

    def __str__(self):
        return self.title
