#from django.urls import path
#from .views import login_view, PostView

#urlpatterns = [
   # path('login/', login_view, name='login'),
    #path('posts/', PostView.as_view(), name='post-list'),
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import login_view, PostView, check_username, PostDetailView, signup_view, send_post_email
from . import views

urlpatterns = [
    path('login/', login_view, name='login'),                # 로그인 API
    path('signup/', signup_view, name='signup'),            # 회원가입 API
    path('check-username/', check_username, name='check-username'),  # 아이디 중복 확인 API
    path('posts/', PostView.as_view(), name='post-list'),   # 게시물 API
    path('posts/<str:pk>/', PostDetailView.as_view(), name='post-detail'),  # 단일 게시물 API
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('users/<str:username>/', views.DeleteUserView.as_view(), name='delete-user'),
    path('posts/user/<str:username>/', views.UserPostsView2.as_view(), name='user-posts'),
    path('send-email/', send_post_email, name='send_email'),
]

