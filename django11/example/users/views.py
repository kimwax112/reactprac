from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from users.models import User
import json
from django.db import models

# 로그인 처리 뷰
@csrf_exempt  # CSRF 검사를 비활성화 (개발용으로만 사용)
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # userCode를 자동으로 생성하는 로직
        # 현재 존재하는 모든 사용자 수를 기반으로 userCode를 생성
        existing_users = User.objects.count()
        userCode = f"{existing_users + 1:02d}A"  # 1부터 시작하며, 2자리 수로 형식화

        try:
            # 데이터베이스에서 해당 username과 password를 가진 사용자 검색
            user = User.objects.get(username=username, password=password)
            return JsonResponse({'message': '환영합니다!', 'username': user.username},status=200)
        except User.DoesNotExist:
            # 로그인 실패 시, 새 사용자 생성
            User.objects.create(userCode=userCode, username=username, password=password)
            return JsonResponse({'message': '상기 정보로 데이터베이스에 입력'}, status=201)

    return JsonResponse({'message': '잘못된 요청입니다.'}, status=400)
