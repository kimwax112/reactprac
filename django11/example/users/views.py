from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json

# 로그인 처리 뷰
@csrf_exempt  # CSRF 검사를 비활성화 (개발용으로만 사용)
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # 사용자 인증 로직: '김무스'와 '123!'일 경우에만 로그인 성공
        if username == '김무스' and password == '123!':
            return JsonResponse({'message': '환영합니다!'}, status=200)
        else:
            return JsonResponse({'message': '아이디 또는 비밀번호가 잘못되었습니다.'}, status=401)
    return JsonResponse({'message': '잘못된 요청입니다.'}, status=400)
