from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from .models import UserInfo,Post

from .serializers import PostSerializer
from django.db import connection
from django.contrib.auth.hashers import make_password, check_password

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
def after_login_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "비정상 접속입니다"}, status=403)
    return JsonResponse({"message": "정상 접속입니다"}, status=200)
#def login_view(request):
    #if request.method == 'POST':
       # data = json.loads(request.body)
        #username = data.get('username')
        #password = data.get('password')

        # 사용자 인증
        #user = validate_user(request, username=username, password=password)
        #if user is not None:
            # JWT 토큰 발급
           # refresh = RefreshToken.for_user(user)
           # return JsonResponse({
            #    'message': '환영합니다!',
             #   'username': user.username,
              #  'access_token': str(refresh.access_token),
               # 'refresh_token': str(refresh)
            #}, status=200)
        #else:
            # 새 사용자 생성
         #   if UserInfo.objects.filter(username=username).exists():
          #      return JsonResponse({'message': '로그인 정보가 잘못되었습니다.'}, status=400)
            #else:
                # 비밀번호를 해싱하여 저장
                #hashed_password = make_password(password)
                #user = UserInfo.objects.create(username=username, password=hashed_password)
                #return JsonResponse({'message': '상기 정보로 데이터베이스에 입력되었습니다.'}, status=201)

    #return JsonResponse({'message': '잘못된 요청입니다.'}, status=400)
@csrf_exempt
def login_view(request):
    """
    로그인 API
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        try:
            # 사용자 조회
            user = UserInfo.objects.get(username=username)

            # 비밀번호 확인
            if check_password(password, user.password):
                # JWT 토큰 발급
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'message': '환영합니다!',
                    'username': user.username,
                    'access_token': str(refresh.access_token),  # 발급된 액세스 토큰
                    'refresh_token': str(refresh)  # 발급된 리프레시 토큰
                }, status=200)
            else:
                return JsonResponse({'message': '잘못된 비밀번호입니다.'}, status=400)

        except UserInfo.DoesNotExist:
            return JsonResponse({'message': '존재하지 않는 아이디입니다.'}, status=400)

    return JsonResponse({'message': 'Invalid request'}, status=400)

@csrf_exempt
def check_username(request):
    """
    아이디 중복 확인 API
    """
    if request.method == 'GET':
        username = request.GET.get('username')
        if UserInfo.objects.filter(username=username).exists():
            return JsonResponse({'exists': True}, status=200)
        return JsonResponse({'exists': False}, status=200)

    return JsonResponse({'message': 'Invalid request'}, status=400)


@csrf_exempt
def signup_view(request):
    """
    회원가입 API
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # 아이디 중복 확인
        if UserInfo.objects.filter(username=username).exists():
            return JsonResponse({'message': '이미 존재하는 아이디입니다.'}, status=400)

        # 비밀번호 해싱 후 저장
        hashed_password = make_password(password)
        UserInfo.objects.create(username=username, password=hashed_password)
        return JsonResponse({'message': '회원가입 성공!'}, status=201)

    return JsonResponse({'message': 'Invalid request'}, status=400)




class UserPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"현재 로그인한 사용자: {request.user.username}")
        # 로그인한 사용자의 글 목록을 가져오기
        posts = Post.objects.filter(user=request.user).order_by('-timestamp')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
class PostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 로그인한 사용자만의 게시물을 조회
        user = request.user  # 로그인한 사용자의 UserInfo 객체를 가져옴
        
        # 해당 사용자가 작성한 게시물을 조회
        posts = Post.objects.filter(author=user).order_by("-timestamp")
        serializer = PostSerializer(posts, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # 'author'에 username이 오면 이를 사용해 UserInfo 객체를 찾고 Post를 생성
        username = request.data.get("author")  # POST 데이터에서 'author' 값을 가져옴
        try:
            user = get_object_or_404(UserInfo, username=username)  # username으로 UserInfo 객체 조회
        except NotFound:
            return Response({"detail": "UserInfo not found for the given username."}, status=status.HTTP_404_NOT_FOUND)
        
        # PostSerializer에 데이터 전달
        data = request.data
        data["author"] = user  # author를 UserInfo 객체로 설정
        
        # Post 생성 및 저장
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()  # 새 Post 저장
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        # 게시물 가져오기
        post = get_object_or_404(Post, id=pk)

        # 게시물 수정
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
        # 단일 게시물 조회
        post = get_object_or_404(Post, id=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def delete(self, request, pk):
        # 게시물 삭제
        post = get_object_or_404(Post, id=pk)
        if post.author != request.user:  # 삭제 권한 확인
            return Response({'detail': '삭제 권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)
        post.delete()
        return Response({'message': '게시물이 삭제되었습니다.'}, status=status.HTTP_204_NO_CONTENT)