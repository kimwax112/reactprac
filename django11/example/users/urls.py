#from django.urls import path
#from .views import login_view, PostView

#urlpatterns = [
   # path('login/', login_view, name='login'),
    #path('posts/', PostView.as_view(), name='post-list'),
from django.urls import path
from .views import login_view, PostView

urlpatterns = [
    path('login/', login_view, name='login'),
    path('posts/', PostView.as_view(), name='post-list'),
   
]

