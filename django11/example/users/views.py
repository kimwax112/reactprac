from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User  # Django 기본 사용자 모델을 사용하는 경우
from rest_framework_simplejwt.tokens import RefreshToken
import json

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # 사용자 인증
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # 사용자 인증 성공 시 JWT 토큰 발급
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': '환영합니다!',
                'username': user.username,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            }, status=200)
        else:
            # 사용자 인증 실패 시 새 사용자 생성
            # 사용자가 존재하지 않는다면, 비밀번호를 해시화하여 저장
            if User.objects.filter(username=username).exists():
                return JsonResponse({'message': '로그인 정보가 잘못되었습니다.'}, status=400)
            else:
                # 새 사용자 생성 시 비밀번호 해시화
                user = User.objects.create_user(username=username, password=password)
                return JsonResponse({'message': '상기 정보로 데이터베이스에 입력되었습니다.'}, status=201)

    return JsonResponse({'message': '잘못된 요청입니다.'}, status=400)
