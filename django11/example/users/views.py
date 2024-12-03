from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Post
from .models import UserInfo
from .serializers import PostSerializer
from django.db import connection
from django.contrib.auth.hashers import make_password
import json

@csrf_exempt
def validate_user(request, username, password):
    try:
        user = UserInfo.objects.get(username=username)
        if check_password(password, user.password):
            return user  # 인증 성공
        else:
            return None  # 비밀번호 불일치
    except UserInfo.DoesNotExist:
        return None  # 사용자 존재하지 않음

def enable_foreign_key():
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA foreign_keys = ON;")
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # 사용자 인증
        user = validate_user(request, username=username, password=password)
        if user is not None:
            # JWT 토큰 발급
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': '환영합니다!',
                'username': user.username,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            }, status=200)
        else:
            # 새 사용자 생성
            if UserInfo.objects.filter(username=username).exists():
                return JsonResponse({'message': '로그인 정보가 잘못되었습니다.'}, status=400)
            else:
                # 비밀번호를 해싱하여 저장
                hashed_password = make_password(password)
                user = UserInfo.objects.create(username=username, password=hashed_password)
                return JsonResponse({'message': '상기 정보로 데이터베이스에 입력되었습니다.'}, status=201)

    return JsonResponse({'message': '잘못된 요청입니다.'}, status=400)

class PostView(APIView):
    def post(self, request):
        # 'username'으로 User 객체를 찾기
        username = request.data.get("author")  # 'author'에 username이 올 것으로 예상
        try:
            author = UserInfo.objects.get(username=username)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
        
        # author를 User 객체로 설정
        data = request.data
        data["author"] = author  # 'author'를 User 객체로 설정
        
        # PostSerializer에 data 전달
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()  # Post 생성 및 저장
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # 모든 게시물 목록 반환
        posts = Post.objects.all().order_by("-timestamp")
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
